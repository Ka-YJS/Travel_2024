package com.example.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	private final long MAX_AGE_SECS = 3600;
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {		
		registry.addMapping("/**")
		//React 애플리케이션이 실행되는 도메인(출처 origins) 에서 오는 요청을 허용
		.allowedOrigins("http://localhost:3000")
		//HTTP 메서드 ("GET","POST","PUT","DELETE") 허용
		.allowedMethods("GET","POST","PUT","DELETE")
		//모든 헤더를 허용
		.allowedHeaders("*")
		//쿠키나 인증 정보를 포함한 요청을 허용
		.allowCredentials(true)
		//브라우저가 서버로부터 받은 응답을 일정 시간동안 저장해두고,
		//그 시간 내에 동일한 요청이 있을 경우
		//서버에 다시 요청하지 않고 저장된 응답을 재사용한다.
		.maxAge(MAX_AGE_SECS);
	}
}
