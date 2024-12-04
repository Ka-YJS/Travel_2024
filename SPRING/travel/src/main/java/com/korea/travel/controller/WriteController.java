package com.korea.travel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.travel.dto.ResponseDTO;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/travel")
@RequiredArgsConstructor
public class WriteController {

@GetMapping("/post")
public ResponseEntity<?> postList(@RequestBody WriteDTO dto) {
    try {
    	WriteDTO user = service.signup(dto);
        return ResponseEntity.ok().body(user);
    } catch (Exception e) {
        ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();
        return ResponseEntity.badRequest().body(responseDTO);
    }
}



}
