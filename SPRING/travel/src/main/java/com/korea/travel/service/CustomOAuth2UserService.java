package com.korea.travel.service;

import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.korea.travel.dto.GoogleDTO;
import com.korea.travel.model.GoogleEntity;
import com.korea.travel.persistence.GoogleRepository;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final GoogleRepository googleRepository;
    private final RestTemplate restTemplate;
    
    @Value("${jwt.secret}")
    private String JWT_SECRET;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();
                
        Map<String, Object> attributes = oAuth2User.getAttributes();
        GoogleDTO.dto googleDTO = GoogleDTO.dto.of(registrationId, userNameAttributeName, attributes);
        GoogleEntity user = saveOrUpdate(googleDTO);
        GoogleDTO.Session sessionUser = new GoogleDTO.Session(user);
        
        return new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority(user.getRole().getKey())),
            attributes,
            userNameAttributeName
        );
    }

    public GoogleEntity saveOrUpdate(GoogleDTO.dto googleDTO) {
        GoogleEntity user = googleRepository.findByGoogleId(googleDTO.getGoogleId())
                .map(entity -> entity.update(
                    googleDTO.getName(), 
                    googleDTO.getEmail(), 
                    googleDTO.getPicture()
                ))
                .orElse(googleDTO.toEntity());
        return googleRepository.save(user);
    }

    // 토큰 생성
    public String generateToken(GoogleDTO.Session googleUser) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + 86400000); // 1일 유효
        Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
        
        return Jwts.builder()
            .setSubject(googleUser.getGoogleId())
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
    }

    // 오버로딩된 토큰 생성 메서드
    public String generateToken(GoogleDTO.dto googleUser) {
        GoogleDTO.Session session = new GoogleDTO.Session(googleUser.toEntity());
        return generateToken(session);
    }

    // 토큰 검증
    public boolean validateToken(String token) {
        try {
            Key key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes());
            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return false;
    }

    // 구글 credential을 사용하여 사용자 정보 검증 및 조회
    public GoogleDTO.Session verifyAndGetUserInfo(String credential) {
        try {
            log.info("Starting verification with credential length: {}", 
                credential != null ? credential.length() : "null");

            // Google TokenInfo 엔드포인트 URL
            String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + credential;
            
            RestTemplate restTemplate = new RestTemplate();
            try {
                // TokenInfo 요청
                ResponseEntity<Map> response = restTemplate.getForEntity(tokenInfoUrl, Map.class);
                
                if (response.getStatusCode() != HttpStatus.OK) {
                    log.error("Token verification failed with status: {}", response.getStatusCode());
                    throw new OAuth2AuthenticationException("Token verification failed");
                }

                Map<String, Object> tokenInfo = response.getBody();
                log.info("Token verified successfully for user: {}", tokenInfo.get("email"));

                // Google 사용자 정보로 DTO 생성
                GoogleDTO.dto googleDTO = GoogleDTO.dto.builder()
                    .googleId((String) tokenInfo.get("sub"))
                    .email((String) tokenInfo.get("email"))
                    .name((String) tokenInfo.get("name"))
                    .picture((String) tokenInfo.get("picture"))
                    .createdAt(java.time.LocalDateTime.now().toString())
                    .build();

                // 사용자 저장/업데이트
                GoogleEntity savedUser = saveOrUpdate(googleDTO);
                return new GoogleDTO.Session(savedUser);

            } catch (RestClientException e) {
                log.error("Error verifying token with Google: ", e);
                throw new OAuth2AuthenticationException("Failed to verify token with Google");
            }
        } catch (Exception e) {
            log.error("Critical error in verifyAndGetUserInfo: ", e);
            throw new OAuth2AuthenticationException(
                e.getMessage() != null ? e.getMessage() : "Authentication failed"
            );
        }
    }
}