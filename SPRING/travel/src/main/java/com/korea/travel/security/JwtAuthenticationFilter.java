package com.korea.travel.security;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.korea.travel.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final TokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String requestURI = request.getRequestURI();
        System.out.println("Current Request URI: " + requestURI); // URI 로깅
        String token = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + token);
        
        // 인증이 필요없는 경로들
        if (requestURI.equals("/travel/userIdCheck") ||
            requestURI.equals("/travel/login") || 
            requestURI.equals("/travel/signup") || 
            requestURI.startsWith("/api/email") || 
            requestURI.startsWith("/uploads") ||
            requestURI.startsWith("/login/oauth2") ||  // OAuth2 로그인 관련 경로 추가
            requestURI.startsWith("/oauth2/") ||       // OAuth2 인증 관련 경로 추가
            requestURI.startsWith("/travel/oauth2/") ||  // 구글 OAuth2 콜백 URL 허용
            requestURI.equals("/") ||                  // 루트 경로 추가
            requestURI.contains("favicon.ico")) {      // favicon 요청 무시
            
            filterChain.doFilter(request, response);
            return;
        }
        
        
        // OPTIONS 요청은 토큰 검사 없이 통과
        if (request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            try {
                String userId = tokenProvider.validateAndGetUserId(token);
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("Invalid or expired token");
                return;
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authorization header is missing or invalid");
            return;
        }
    }
}