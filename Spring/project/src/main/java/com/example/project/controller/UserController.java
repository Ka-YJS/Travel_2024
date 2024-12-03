package com.example.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.project.dto.ResponseDTO;
import com.example.project.dto.UserDTO;
import com.example.project.model.UserEntity;
import com.example.project.security.TokenProvider;
import com.example.project.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/travel")
@RequiredArgsConstructor
@Slf4j
public class UserController {

	private final UserService service;
	
	private final TokenProvider tokenProvider;
	
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	//회원가입
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserDTO dto){
		//request body 에 포함된 UserDTO 객체에 수신하여 처리한다.
		log.warn(dto.getUserId());
		try {			
			UserEntity userEntity = UserEntity.builder()
					.userId(dto.getUserId())
					.userName(dto.getUserName())
					.userNickName(dto.getUserNickName())
					//사용자에게 입력받은 비밀번호 암호화
					.userPassword(passwordEncoder.encode(dto.getUserPassword()))
					.build();
			//UserService를 이용해 새로 만든 UserEntity를 데이터베이스에 저장한다.
			UserEntity user = service.signup(userEntity);
						
			//등록된 UserEntity 정보를 UserDTO로 변환하여 응답에 사용한다.
			UserDTO response = UserDTO.builder()
					.id(user.getId())
					.userId(user.getUserId())
					.userName(user.getUserName())
					.userNickName(user.getUserNickName())
					.build();
			// 성공적으로 저장된 유저 정보를 포함한 HTTP 200 응답을 반환한다.
            return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			//예외가 발생한 경우, 에러 메시지를 포함한 ResponseDTO 객체를 만들어 응답한다.
			ResponseDTO response = ResponseDTO.builder().error(e.getMessage()).build();
			
			//HTTP 400상태 코드를 반환하고, 에러메시지를 ResponseBody에 포함시킨다.
			return ResponseEntity.badRequest().body(response);// HTTP 400 응답을 생성한다.
		}
	}
	
	//로그인
	@PostMapping("/signin")
	public ResponseEntity<?> signin(@RequestBody UserDTO dto){
		// 요청 본문으로 전달된 UserDTO의 username과 password를 기반으로 유저를 조회한다.
		//getByCredentials : Service에 있는 id와 password를 전달받아 조회하는 메서드
		UserEntity user = service.signin(
				dto.getUserId(), 
				dto.getUserPassword(),
				passwordEncoder);
				
		//사용자가 존재한다면
		if(user != null) {
			//성공적으로 인증된 유저 정보를 포함한 HTTP 200 응답을 반환한다.
			final String token = tokenProvider.create(user);
			final UserDTO response = UserDTO.builder()
					.id(user.getId())
					.userId(user.getUserId())
					.userName(user.getUserName())
					.userNickName(user.getUserNickName())
					.token(token)
					.build();
			return ResponseEntity.ok().body(response);
		}else {
			//유저가 존재하지 않거나 인증 실패시 에러 메시지를 포함한 ResponseDTO를 반환한다.
			ResponseDTO response = ResponseDTO.builder()
					.error("로그인 실패")//에러 메세지 설정
					.build();//ResponseDTO 객체를 빌드한다.
			
			//HTTP 400 상태 코드를 반환하고, 에러 메시지를 응답 본문에 포함시킨다.
			return ResponseEntity.badRequest().body(response);		
		}				
	}
	
	
	
}
