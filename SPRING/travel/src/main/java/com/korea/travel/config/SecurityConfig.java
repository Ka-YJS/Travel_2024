package com.korea.travel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.korea.travel.config.GoogleOAuthUserServiceImpl;
import com.korea.travel.model.Role;
import com.korea.travel.security.GoogleOAuthSuccessHandler;
import com.korea.travel.security.JwtAuthenticationFilter;
import com.korea.travel.security.TokenProvider;
import com.korea.travel.service.CustomOAuth2UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import java.util.Arrays;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {
   
   private final TokenProvider tokenProvider;
   private final CustomOAuth2UserService customOAuth2UserService;
   private final GoogleOAuthUserServiceImpl googleOAuthUserService;
   private final GoogleOAuthSuccessHandler googleOAuthSuccessHandler;

   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
           // CSRF 비활성화
           .csrf(csrf -> csrf.disable())
           
           // CORS 설정
           .cors(cors -> cors.configurationSource(corsConfigurationSource()))
           
           // 세션 관리 설정
           .sessionManagement(session -> 
               session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
           )
           
           // 헤더 설정
           .headers(headers -> 
               headers
                   .frameOptions(frame -> frame.sameOrigin())
                   .contentSecurityPolicy(csp -> 
                       csp.policyDirectives(
                           "default-src 'self'; " +
                           "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                           "style-src 'self' 'unsafe-inline'; " +
                           "img-src 'self' data:; " +
                           "connect-src 'self' http://localhost:3000"
                       )
                   )
                   .addHeaderWriter((request, response) -> {
                       response.setHeader("X-Content-Type-Options", "nosniff");
                       response.setHeader("X-Frame-Options", "SAMEORIGIN");
                       response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
                       response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                       response.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups-with-unsafe-inheritance");
                       response.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
                   })
           )
           
           // URL 기반 권한 설정
           .authorizeHttpRequests(auth -> 
               auth
                   .requestMatchers(
                       "/", "/travel/login", "/travel/signup", 
                       "/travel/userIdCheck", "/api/email/**",
                       "/travel/oauth2/**", "/uploads/**",
                       "/css/**", "/images/**", "/js/**", 
                       "/oauth2/**", "/login/oauth2/code/**", "/error",
                       "/auth/**"
                   ).permitAll()
                   .requestMatchers("/api/**").authenticated()
                   .requestMatchers("/posts/new", "/comments/save")
                       .hasRole(Role.USER.name())
                   .requestMatchers(
                       "/travel/oauth2/google/callback",
                       "/oauth2/**"
                   ).permitAll()
                   .anyRequest().authenticated()
           )
           
           // 로그아웃 설정
           .logout(logout -> 
               logout
                   .logoutSuccessUrl("/")
                   .invalidateHttpSession(true)
                   .deleteCookies("JSESSIONID", "AUTH_TOKEN")
                   .clearAuthentication(true)
           )
           
           // OAuth2 로그인 설정
           .oauth2Login(oauth2 -> 
               oauth2
                   .userInfoEndpoint(endpoint -> 
                       endpoint.userService(googleOAuthUserService)
                   )
                   .successHandler(googleOAuthSuccessHandler)
           )
           
           // 예외 핸들링
           .exceptionHandling(exception -> 
               exception
                   .authenticationEntryPoint((request, response, authException) -> {
                       response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                       response.setContentType("application/json");
                       response.getWriter().write(
                           "{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}"
                       );
                   })
                   .accessDeniedHandler((request, response, accessDeniedException) -> {
                       response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                       response.setContentType("application/json");
                       response.getWriter().write(
                           "{\"error\": \"Forbidden\", \"message\": \"" + accessDeniedException.getMessage() + "\"}"
                       );
                   })
           )
           
           // JWT 필터 추가
           .addFilterBefore(
               new JwtAuthenticationFilter(tokenProvider),
               UsernamePasswordAuthenticationFilter.class
           );

       return http.build();
   }

   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration configuration = new CorsConfiguration();
       configuration.setAllowedOrigins(Arrays.asList(
           "http://localhost:3000", 
           "https://localhost:3000", 
           "http://localhost:3001",
           "https://accounts.google.com"
       ));
       configuration.setAllowedMethods(Arrays.asList(
           "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
       ));
       configuration.setAllowedHeaders(Arrays.asList(
           "Authorization", 
           "Content-Type", 
           "X-Requested-With", 
           "Accept",
           "Origin",
           "Access-Control-Request-Method",
           "Access-Control-Request-Headers"
       ));
       configuration.setExposedHeaders(Arrays.asList(
           "Authorization", 
           "Content-Type",
           "Access-Control-Allow-Origin",
           "Access-Control-Allow-Credentials",
           "Cross-Origin-Opener-Policy"
       ));
       configuration.setAllowCredentials(true);
       configuration.setMaxAge(3600L);
       
       UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
       source.registerCorsConfiguration("/**", configuration);
       return source;
   }

   // 토큰 쿠키 생성 메서드
   private Cookie createTokenCookie(String token) {
       Cookie cookie = new Cookie("AUTH_TOKEN", token);
       cookie.setHttpOnly(true);
       cookie.setSecure(true);
       cookie.setPath("/");
       cookie.setMaxAge(3 * 60 * 60); // 3시간
       return cookie;
   }

   @Bean
   public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
   }
}