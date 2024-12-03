package com.example.project.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.project.dto.UserDTO;
import com.example.project.model.UserEntity;
import com.example.project.persistence.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository repository;
		
	//회원가입
	public UserEntity signup(UserEntity entity) {
		log.warn(entity.getUserId());
		//주어진 userEntity가 null이거나 또는 username이 null인경우 예외발생
		if(entity == null || entity.getUserId() == null) {
			//유효하지 않은 인자에 대해 예외를 던진다.
			throw new RuntimeException("Invalid Arguments 유효하지 않은 인자");
		}
		//Entity에서 userId을 가져와 상수 변수에 저장
		final String userId = entity.getUserId();
		
		//주어진 username이 이미 존재하는 경우, 경고 로그를 남기고 예외를 던진다.
		if(repository.existsByUserId(userId)) {
			//이미 존재하는 username에 대해 로그를 기록한다. 
			log.warn("username이 이미 존재 합니다.1 {}", userId);
			throw new RuntimeException("username이 이미 존재 합니다.2");
		}
	
		//username이 중복되지 않았다면, UserEntity를 데이터 베이스에 저장
			return repository.save(entity);
}
		
	//주어진 userId과 userPassword로 UserEntity 조회하기
	public UserEntity signin(String userId,String userPassword) {
		UserEntity user = repository.findByUserId(userId);
	    if(user != null && userPassword.equals(user.getUserPassword())) {
			return user;
		}
		return null;
	}
}
