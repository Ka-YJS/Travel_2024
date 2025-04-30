package com.korea.travel.security;

import java.io.IOException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoogleOAuthSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final TokenProvider tokenProvider;
    
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, 
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        try {
            // Google에서 제공하는 사용자 정보 추출
            String email = (String) oAuth2User.getAttributes().get("email");
            String name = (String) oAuth2User.getAttributes().get("name");
            String googleId = (String) oAuth2User.getAttributes().get("sub");
            
            // Google 사용자용 토큰 생성
            String token = tokenProvider.createGoogleToken(email, name, googleId);
            
            // CORS 헤더 설정
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            
            // Content Type 설정
            response.setContentType("application/json;charset=UTF-8");
            
            // 토큰을 JSON 형태로 응답
            response.getWriter().write("{\"token\":\"" + token + "\"}");
            
            log.info("Google OAuth 인증 성공: 사용자 {} 의 토큰 생성 완료", email);
            
        } catch (Exception e) {
            log.error("Google OAuth 인증 성공 처리 중 오류 발생", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\":\"인증 처리 중 오류가 발생했습니다.\"}");
        }
    }
}