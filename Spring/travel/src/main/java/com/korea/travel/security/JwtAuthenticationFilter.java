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
		
		String token = request.getHeader("Authorization");
		
		if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);  // "Bearer " 제거

            if (!tokenProvider.isTokenExpired(token)) {
                try {
                    String userId = tokenProvider.validateAndGetUserId(token);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null, new ArrayList<>());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (Exception e) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);  // 403 Forbidden
                    response.getWriter().write("Invalid or expired token");
                    return; // 토큰이 유효하지 않거나 만료되었으면, 필터에서 더 이상 진행되지 않도록
                }
            } else {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);  // 403 Forbidden
                response.getWriter().write("Token is expired");
                return;
            }
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);  // 401 Unauthorized
            response.getWriter().write("Authorization header is missing or invalid");
            return;
        }

        filterChain.doFilter(request, response);
    }

}

	

