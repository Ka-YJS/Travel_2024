package com.korea.travel.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	
	@Override
	public void addCorsMappings(CorsRegistry registry) {
//		registry.addMapping("/**")
//				.allowedOrigins("http://localhost:3000")
//				.allowedMethods("GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS")
//				.allowedHeaders("*")
//				.allowCredentials(true);
	}
	
	 @Override
	    public void addResourceHandlers(ResourceHandlerRegistry registry) {
	        // /uploads/** 경로의 요청을 서버의 실제 파일 경로로 매핑
	        registry.addResourceHandler("/uploads/**")
	                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
	    }
}