package com.korea.travel.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.korea.travel.dto.ResponseDTO;
import com.korea.travel.dto.UserDTO;
import com.korea.travel.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/travel")
@RequiredArgsConstructor
public class UserController {

	private final UserService service;
	
	
    //회원가입
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

    
    //로그인
    @PostMapping("/login")
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
    
    
    //userPassword 수정하기
    @PatchMapping("/userPasswordEdit/{id}")
    public ResponseEntity<?> userPasswordEdit(@PathVariable Long id,@RequestBody UserDTO dto){
    	UserDTO userDTO = service.userPasswordEdit(id,dto);
    	if(userDTO != null) {
    		return ResponseEntity.ok().body(userDTO);
    	}else {
    		ResponseDTO responseDTO = ResponseDTO.builder()
                 .error("비밀번호 수정 실패")
                 .build();
    		return ResponseEntity.badRequest().body(responseDTO);
    	}
    }
    
    
    //userNickName 수정하기
    @PatchMapping("/userNickNameEdit/{id}")
    public ResponseEntity<?> userNickNameEdit(@PathVariable Long id,@RequestBody UserDTO dto){
    	UserDTO userDTO = service.userNickNameEdit(id,dto);
    	if(userDTO != null) {
    		return ResponseEntity.ok().body(userDTO);
    	}else {
    		ResponseDTO responseDTO = ResponseDTO.builder()
                 .error("닉네임 수정 실패")
                 .build();
    		return ResponseEntity.badRequest().body(responseDTO);
    	}
    }
    
    
    //프로필사진 수정
    @PatchMapping("/userProfileImageEdit/{id}")
    public ResponseEntity<?> userProfileImageEdit(@PathVariable Long id, @RequestParam("file") MultipartFile file) {

        try {
            // 서비스 호출하여 프로필 사진을 수정하고 결과를 반환
            UserDTO updatedUserDTO = service.userProfileImageEdit(id, file);

            return ResponseEntity.ok().body(updatedUserDTO);  // 성공적으로 수정된 UserDTO 반환

        } catch (RuntimeException e) {
            // 예외 처리: 사용자 정보가 없거나, 파일 업로드 중 에러가 발생한 경우
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error occurred during profile update: " + e.getMessage());
        }
    }

    
    //로그아웃
    @PostMapping("/logout/{id}")
    public boolean logout(@PathVariable Long id) {
    	
    	if(service.logout(id)) {
    		return true;
    	}else {
    		return false;
    	}
    	
    }
    

    //회원탈퇴
    @DeleteMapping("/withdraw/{id}")
    public boolean userWithdrawal(@PathVariable Long id,@RequestBody UserDTO dto){
    	if(service.userWithdrawal(id,dto)) {
    		return true;
    	}else {
    		return false;
    	}
    }
    

}
