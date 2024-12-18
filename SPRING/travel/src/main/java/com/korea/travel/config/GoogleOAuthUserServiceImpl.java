package com.korea.travel.config;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.korea.travel.model.GoogleEntity;
import com.korea.travel.persistence.GoogleRepository;
import com.korea.travel.security.GoogleOAuth2User;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GoogleOAuthUserServiceImpl extends DefaultOAuth2UserService {
    
    @Autowired
    private GoogleRepository googleRepository;
    
    public GoogleOAuthUserServiceImpl() {
        super();
    }
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // DefaultOAuth2UserService의 기존 loadUser를 호출하여 사용자 정보를 가져옴
        final OAuth2User oauth2User = super.loadUser(userRequest);
        final Map<String, Object> attributes = oauth2User.getAttributes();
        
        try {
            log.info("Google OAuth2User attributes {} ", 
                new ObjectMapper().writeValueAsString(attributes));
        } catch (Exception e) {
            log.error("Error logging OAuth2User attributes", e);
        }
        
        // Google에서 제공하는 사용자 정보 추출
        final String email = (String) attributes.get("email");
        final String name = (String) attributes.get("name");
        final String picture = (String) attributes.get("picture");
        final String googleId = (String) attributes.get("sub");
        
        // 현재 OAuth2 제공자 이름 (Google)
        final String authProvider = userRequest.getClientRegistration().getClientName();
        
        // 이메일로 기존 사용자 검색
        GoogleEntity googleEntity = googleRepository.findByEmail(email)
            .orElse(null);
        
        // 사용자가 존재하지 않으면 새로 생성
        if(googleEntity == null) {
            googleEntity = GoogleEntity.builder()
                .email(email)
                .name(name)
                .picture(picture)
                .googleId(googleId)
                .authProvider(authProvider)
                .build();
            
            googleEntity = googleRepository.save(googleEntity);
            log.info("New Google user created - email: {}", email);
        } else {
            googleEntity.updateInfo(name, picture);
            googleEntity = googleRepository.save(googleEntity);
            log.info("Existing Google user updated - email: {}", email);
        }
        
        log.info("Successfully processed Google user - email: {}, authProvider: {}", 
            email, authProvider);
        
        // GoogleOAuth2User 객체 반환
        return new GoogleOAuth2User(email, name, picture, googleId, attributes);
    }
}