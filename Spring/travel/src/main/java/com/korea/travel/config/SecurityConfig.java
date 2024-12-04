package com.korea.travel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.korea.travel.security.JwtAuthenticationFilter;
import com.korea.travel.security.TokenProvider;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final TokenProvider tokenProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()  // CSRF 보호 비활성화 (필요시 활성화)
//            .authorizeRequests()
            .authorizeHttpRequests()
//            .anyRequest().permitAll();  // 모든 요청 허용
          	.requestMatchers("/travel/login","/travel/signup").permitAll()  // /public/** 경로는 인증 없이 허용
          	.anyRequest().authenticated()  // 그 외 요청은 인증 필요
        	.and()
        	.addFilterBefore(new JwtAuthenticationFilter(tokenProvider), UsernamePasswordAuthenticationFilter.class);
            
        
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}