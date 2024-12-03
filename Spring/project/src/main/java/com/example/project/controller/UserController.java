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
import com.example.project.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/travel")
@RequiredArgsConstructor
public class UserController {

	private final UserService service;
	
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	//회원가입
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserDTO dto){
		//request body 에 포함된 UserDTO 객체에 수신하여 처리한다.
		try {			
			//UserService를 이용해 새로 만든 UserEntity를 데이터베이스에 저장한다.
			UserDTO user = service.create(dto);
						
			//등록된 UserEntity 정보를 UserDTO로 변환하여 응답에 사용한다.
			UserDTO userDTO = UserDTO.builder()
					.userId(user.getUserId())
					.userName(user.getUserName())
					.userNickName(user.getUserNickName())
					.userPassword(user.getUserPassword())
					.build();
			// 성공적으로 저장된 유저 정보를 포함한 HTTP 200 응답을 반환한다.
            return ResponseEntity.ok().body(userDTO);
		} catch (Exception e) {
			//예외가 발생한 경우, 에러 메시지를 포함한 ResponseDTO 객체를 만들어 응답한다.
			ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
			
			//HTTP 400상태 코드를 반환하고, 에러메시지를 ResponseBody에 포함시킨다.
			return ResponseEntity.badRequest().body(responseDTO);// HTTP 400 응답을 생성한다.
		}
	}
	
	//로그인
	@PostMapping("/signin")
	public boolean authenticate(@RequestBody UserDTO dto){
		// 요청 본문으로 전달된 UserDTO의 username과 password를 기반으로 유저를 조회한다.
		//getByCredentials : Service에 있는 id와 password를 전달받아 조회하는 메서드
		UserDTO userDTO = service.getByCredentials(dto.getUserName(), dto.getUserPassword(),passwordEncoder);
				
		//사용자가 존재한다면
		if(userDTO != null) {
			//성공적으로 인증된 유저 정보를 포함한 HTTP 200 응답을 반환한다.
			return true;
		}else {
			return false;
			
		}
				
	}
}
