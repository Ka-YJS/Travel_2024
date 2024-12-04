package com.korea.travel.service;


import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.korea.travel.dto.UserDTO;
import com.korea.travel.model.UserEntity;
import com.korea.travel.persistence.UserRepository;
import com.korea.travel.security.TokenProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository repository;
	
	private final PasswordEncoder passwordEncoder;
	
	private final TokenProvider tokenProvider;
	
	
	//회원가입
	public UserDTO signup(UserDTO dto) {
		UserEntity user = UserEntity.builder()
				.userId(dto.getUserId())
				.userName(dto.getUserName())
				.userNickName(dto.getUserNickName())
				.userPassword(passwordEncoder.encode(dto.getUserPassword()))
				.build();
		if(user == null || user.getUserId() == null) {
			throw new RuntimeException("Invalid Arguments 유효하지 않은 인자");
		}
		final String userId = user.getUserId();
		//존재하는 ID인지 검사
		if(repository.existsByUserId(userId)) {
			log.warn("userId이 이미 존재 합니다.1 {}", userId);
			throw new RuntimeException("이미 존재하는 ID 입니다.");
		}else {
			repository.save(user);
			return UserDTO.builder()
					.userId(user.getUserId())
					.userName(user.getUserName())
					.userNickName(user.getUserNickName())
					.userPassword(user.getUserPassword())
					.build();
		}
	}
		
	
	//userName과 userPassword으로하기 로그인하기
	public UserDTO getByCredentials(String userId,String userPassword) {
		UserEntity user = repository.findByUserId(userId);
		//DB에 저장된 암호화된 비밀번호와 사용자에게 입력받아 전달된 암호화된 비밀번호를 비교
		if(user != null && passwordEncoder.matches(userPassword,user.getUserPassword())) {
			final String token = tokenProvider.create(user);
			return UserDTO.builder()
				.id(user.getId())
				.userId(user.getUserId())
				.userName(user.getUserName())
				.userNickName(user.getUserNickName())
				.userPassword(user.getUserPassword())
				.token(token)
				.build();
		}else {
			return null;
		}
	}
	
	
	//id로 조회후 userPassword 수정하기
	public UserDTO userPasswordEdit (Long id,UserDTO dto) {
		Optional <UserEntity> user = repository.findById(id);
		if(user != null && !passwordEncoder.matches(dto.getUserPassword(),user.get().getUserPassword())) {
			UserEntity entity = user.get();
			entity.setUserPassword(passwordEncoder.encode(dto.getUserPassword()));
			repository.save(entity);
			return UserDTO.builder()
					.userPassword(entity.getUserPassword())
					.build();
		}else {
			return null;
		}
	}
		
		
	//id로 조회후 userNickName 수정하기
    public UserDTO userNickNameEdit(Long id,UserDTO dto) {
    	Optional <UserEntity> user = repository.findById(id);
    	if(user.isPresent()) {
    		UserEntity entity = user.get();
    		entity.setUserNickName(dto.getUserNickName());
    		repository.save(entity);
    		return UserDTO.builder()
    				.userNickName(entity.getUserNickName())
    				.build();
    	}else {
    		return null;
    	}
    }
    
    
    //id로 회원탈퇴
    public boolean userWithdrawal (Long id, UserDTO dto) {
    	Optional<UserEntity> user = repository.findById(id);
    	if(user.isPresent() && passwordEncoder.matches(dto.getUserPassword(),user.get().getUserPassword())) {
    		UserEntity entity = user.get();
    		repository.delete(entity);
    		return true;
    	}else {
			return false;
		}
    }
    
}
