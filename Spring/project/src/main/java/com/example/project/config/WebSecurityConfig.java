package com.example.project.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.project.security.JwtAuthenticationFilter;
import com.example.project.security.OAuthSuccessHandler;
import com.example.project.security.OAuthUserServiceImpl;
import com.example.project.security.RedirectUrlCookieFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
   
   @Autowired
   private JwtAuthenticationFilter jwtAuthenticationFilter;
   
   @Autowired
   private OAuthUserServiceImpl oAuthUserService;
   
   @Autowired
   private OAuthSuccessHandler oAuthSuccessHandler;
   
   @Autowired
   private RedirectUrlCookieFilter redirectUrlCookieFilter;
   
   @Bean
   protected DefaultSecurityFilterChain securityFilterChain(
         HttpSecurity http) throws Exception {

      http
         .cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()))
         .csrf(csrfConfigurer -> csrfConfigurer.disable())
         .httpBasic(httpBasicConfigurer -> httpBasicConfigurer.disable())
         .sessionManagement(sessionManagementConfigurer ->
               sessionManagementConfigurer.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
           )
         
         .authorizeHttpRequests(authorizeRequestsConfigurer -> 
            authorizeRequestsConfigurer
            .requestMatchers("/", "/auth/**","/oauth2/**").permitAll()
            .anyRequest().authenticated()
         )
         .oauth2Login()//oauth2Login 활성화
         .redirectionEndpoint() //아무 주소도 넣지 않았다면 베이스 URL인 http://localhost:5000으로 리다이렉트한다.
         .baseUri("/oauth2/callback/*")//인증이 성공하면 리다이렉트할 엔드포인트의 URI
         .and()
         .authorizationEndpoint()
         .baseUri("/auth/authorize")
         .and()
         //OAuth2 제공자로부터 사용자 정보를 가져올 때 사용하는 엔드포인트를 설정한다.
         //이 부분은 OAuth2 인증이 성공한 후, 사용자 프로필 데이터를 가져오는 역할
         .userInfoEndpoint()
         //사용자 정보를 처리하는 서비스를 지정하는 메서드 
         .userService(oAuthUserService)
         .and()
         .successHandler(oAuthSuccessHandler)
         .and()
         .exceptionHandling()
         .authenticationEntryPoint(new Http403ForbiddenEntryPoint());//oauth2 인증이 성공한 뒤 실행될 동작을 정의하는메서드

      http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
      
      http.addFilterAfter(redirectUrlCookieFilter,OAuth2AuthorizationRequestRedirectFilter.class);

      return http.build();
   }

   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      //React 애플리케이션이 실행되는 출처에서 오는 요청을 허용
      configuration.setAllowedOrigins(Arrays.asList(
    		  "http://localhost:3000",
    		  "http://app.todo-test-dev.store", "https://app.todo-test-dev.store"));
      //HTTP메서드 허용
      configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      //모든 헤더를 허용
      configuration.setAllowedHeaders(Arrays.asList("*"));
      //쿠키나 인증 정보를 포함한 요청을 허용
      configuration.setAllowCredentials(true);
      
      //모든 경로에 대해 CORS설정을 적용
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration);
      return source;
   }
}