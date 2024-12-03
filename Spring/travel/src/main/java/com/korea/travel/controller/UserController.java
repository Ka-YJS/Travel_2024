package com.korea.travel.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.travel.dto.ResponseDTO;
import com.korea.travel.dto.UserDTO;
import com.korea.travel.model.UserEntity;
import com.korea.travel.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/travel")
@RequiredArgsConstructor
public class UserController {

	private final UserService service;
	
    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserDTO dto) {
        try {
        	UserDTO user = service.signup(dto);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    // 로그인
    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO dto) {
        UserDTO userDTO = service.getByCredentials(dto.getUserId(), dto.getUserPassword());
        
        if(userDTO != null) {
        	return ResponseEntity.ok().body(userDTO);
        }else {
        	ResponseDTO responseDTO = ResponseDTO.builder()
        			.error("로그인 실패")
        			.build();
        	return ResponseEntity.badRequest().body(responseDTO);
        }
    }

}
