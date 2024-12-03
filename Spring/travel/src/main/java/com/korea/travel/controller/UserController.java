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
            UserEntity user = service.signup(dto);
            UserDTO userDTO = UserDTO.builder()
        			.userId(user.getUserId())
        			.userName(user.getUserName())
        			.userNickName(user.getUserNickName())
        			.userPassword(user.getUserPassword())
        			.build();
            return ResponseEntity.ok().body(userDTO);
        } catch (Exception e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    // 로그인
    @PostMapping("/signin")
    public boolean authenticate(@RequestBody UserDTO dto) {
        UserDTO userDTO = service.getByCredentials(dto.getUserId(), dto.getUserPassword());
        return userDTO != null;
    }
				
}
