package com.korea.travel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.korea.travel.dto.ResponseDTO;
import com.korea.travel.dto.WriteDTO;
import com.korea.travel.service.WriteService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/write")
@RequiredArgsConstructor
public class WriteController {

	private WriteService writeService;
	
	//게시글 등록
	@PostMapping("/create/{userId}")
	public boolean writeCreate(@PathVariable Long userId,@RequestParam WriteDTO writeDTO) {
		
		if(writeService.writeCreate(userId, writeDTO)) {
			return true;
		}else {
			return false;
		}
		
	}
	
	
	//게시글 수정
	@PutMapping("{userId}/writeEdit/{writeId}")
	public ResponseEntity<?> writeEdit(@PathVariable Long userId,@PathVariable Long writeId,@RequestParam WriteDTO writeDTO){
		
		WriteDTO write = writeService.writeEdit(userId,writeId,writeDTO);
		
		if(write != null) {
			return ResponseEntity.ok().body(write);
		}else {
			ResponseDTO responseDTO = ResponseDTO.builder()
					.error("게시글 수정 실패")
					.build();
			return ResponseEntity.badRequest().body(responseDTO);
		}
			
	}
	
	
}
