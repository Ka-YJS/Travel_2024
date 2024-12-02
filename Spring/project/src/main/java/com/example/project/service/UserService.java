package com.example.project.service;

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
	public UserDTO create(UserDTO dto) {
		UserEntity user = UserEntity.builder()
				.userId(dto.getUserId())
				.userName(dto.getUserName())
				.userNickName(dto.getUserNickName())
				.userPassword(dto.getUserPassword())
				.build();
		if(user == null || user.getUserId() == null) {
			throw new RuntimeException("Invalid Arguments 유효하지 않은 인자");
		}
		final String userId = user.getUserId();
		//존재하는 ID인지 검사
		if(repository.existsByUserName(userId)) {
			log.warn("userId이 이미 존재 합니다.1 {}", userId);
			throw new RuntimeException("이미 존재하는 ID 입니다.");
		}
	
		return new UserDTO(repository.save(user));
	}
		
	//주어진 userName과 userPassword로 UserEntity 조회하기
//	public UserDTO getByCredentials(String userName,String userPassword) {
//		UserEntity original = repository.findByUserName(userName);
//		//DB에 저장된 암호화된 비밀번호와 사용자에게 입력받아 전달된 암호화된 비밀번호를 비교
//		if(original != null && userPassword.equals(original.getUserPassword())) {
//			return UserDTO.builder()
//				.userId(original.getUserId())
//				.userName(original.getUserName())
//				.userNickName(original.getUserNickName())
//				.userPassword(original.getUserPassword())
//				.build();
//		}else {
//			return null;
//		}
//	}
	public UserDTO getByCredentials(String userName,String userPassword,PasswordEncoder encoder) {
		UserEntity original = repository.findByUserName(userName);
	    if(original != null && encoder.matches(userPassword, original.getUserPassword())) {
			return UserDTO.builder()
		            .userId(original.getUserId())
		            .userName(original.getUserName())
		            .userNickName(original.getUserNickName())
		            .userPassword(original.getUserPassword())
		            .build();
		}
		return null;
	}
}
