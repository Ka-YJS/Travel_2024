package com.korea.travel.security;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.korea.travel.model.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class TokenProvider {
   
   private static final long EXPIRATION_TIME = 1000 * 60L * 180L; // 3시간
   
   @Value("${jwt.secret}")
   private String secretKey;
   
   private Map<String, Object> createHeader() {
       Map<String, Object> header = new HashMap<>();
       header.put("typ", "JWT");
       return header;
   }
   
   private Date createExpiration() {
       Date expiration = new Date();
       expiration.setTime(expiration.getTime() + EXPIRATION_TIME);
       return expiration;
   }
   
   // 일반 사용자용 JWT 생성
   public String create(UserEntity entity) {
       Map<String, Object> header = createHeader();
       Date expiration = createExpiration();
       
       Map<String,Object> payload = new HashMap<>();
       payload.put("userId", entity.getUserId());
       payload.put("userNickName", entity.getUserNickName());
       
       String jwt = Jwts.builder()
               .setHeader(header)
               .signWith(SignatureAlgorithm.HS512, secretKey)
               .setSubject(entity.getUserId())
               .setIssuer("travel app")
               .setClaims(payload)
               .setIssuedAt(new Date())
               .setExpiration(expiration)
               .compact();
       return jwt;
   }
   
   // Google OAuth2 사용자용 JWT 생성
   public String createGoogleToken(String email, String name, String googleId) {
       Map<String, Object> header = createHeader();
       Date expiration = createExpiration();
       
       Map<String,Object> payload = new HashMap<>();
       payload.put("email", email);
       payload.put("name", name);
       payload.put("googleId", googleId);
       payload.put("provider", "google");
       
       try {
           String jwt = Jwts.builder()
                   .setHeader(header)
                   .signWith(SignatureAlgorithm.HS512, secretKey)
                   .setSubject(email)
                   .setIssuer("travel app")
                   .setClaims(payload)
                   .setIssuedAt(new Date())
                   .setExpiration(expiration)
                   .compact();
           log.info("Google token created for user: {}", email);
           return jwt;
       } catch (Exception e) {
           log.error("Error creating Google token for user {}: {}", email, e.getMessage());
           throw new TokenCreationException("Failed to create Google token", e);
       }
   }
   
   // JWT 토큰 검증 및 사용자 ID 반환
   public String validateAndGetUserId(String token) {
       if(!isTokenExpired(token)) {
           try {
               Claims claims = Jwts.parser()
                       .setSigningKey(secretKey)
                       .parseClaimsJws(token)
                       .getBody();
               
               // provider가 google인 경우 email을 반환
               if ("google".equals(claims.get("provider"))) {
                   return claims.get("email", String.class);
               }
               return claims.getSubject();
           } catch (Exception e) {
               log.error("Token validation failed for token {}: {}", token, e.getMessage());
               throw new TokenValidationException("Token validation failed", e);
           }
       } else {
           log.warn("Token has expired: {}", token);
           return null;
       }
   }
   
   // 토큰 만료 확인
   public boolean isTokenExpired(String token) {
       try {
           Date expiration = Jwts.parser()
                   .setSigningKey(secretKey)
                   .parseClaimsJws(token)
                   .getBody()
                   .getExpiration();
           
           return expiration.before(new Date());
       } catch (Exception e) {
           log.error("Error checking token expiration for token {}: {}", token, e.getMessage());
           return true;
       }
   }
}