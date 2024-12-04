package com.korea.travel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // CSRF 보호 비활성화 (필요시 활성화)
            .authorizeHttpRequests()
            .anyRequest().permitAll();  // 모든 요청 허용
//        	.csrf().disable()
//        	.authorizeHttpRequests()
//          .requestMatchers("/public/**").permitAll()  // /public/** 경로는 인증 없이 허용
//          .anyRequest().authenticated();  // 그 외 요청은 인증 필요
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}