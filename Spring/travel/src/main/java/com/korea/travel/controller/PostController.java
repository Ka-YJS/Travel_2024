package com.korea.travel.controller;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.korea.travel.dto.PostDTO;
import com.korea.travel.dto.ResponseDTO;
import com.korea.travel.service.PostService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // React 앱이 동작하는 주소
public class PostController {

	@Autowired
    private PostService postService;

    // 게시판 전체 조회
    @GetMapping("/posts")
    public ResponseEntity<?> getAllPosts() {
        List<PostDTO> dtos = postService.getAllPosts();
        ResponseDTO<PostDTO> response = ResponseDTO.<PostDTO>builder().data(dtos).build();
        return ResponseEntity.ok(response);
    }

    // 게시글 한 건 조회
    @GetMapping("/posts/postDetail/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        List<PostDTO> dtos = List.of(postService.getPostById(id));
        ResponseDTO<PostDTO> response = ResponseDTO.<PostDTO>builder().data(dtos).build();
        return ResponseEntity.ok(response);
    }

    // 게시글 작성 + 이미지 업로드
    @PostMapping(value = "/write", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestPart("postTitle") String postTitle,
            @RequestPart("postContent") String postContent,
            @RequestPart("placeList") String placeList,
            @RequestPart("userNickName") String userNickName,
            @RequestPart("files") List<MultipartFile> files) {
    	
    	

        // 서비스 호출 및 DTO 빌드
        PostDTO postDTO = new PostDTO();
        postDTO.setPostTitle(postTitle);
        postDTO.setPostContent(postContent);
        postDTO.setPlaceList(Arrays.asList(placeList.split(", ")));
        postDTO.setUserNickname(userNickName);

        // 파일 저장 로직 호출
        List<String> imageUrls = postService.saveFiles(files);
        postDTO.setImageUrls(imageUrls);

        PostDTO createdPost = postService.createPost(postDTO);
        return ResponseEntity.ok(createdPost);
    }
    
    @PutMapping(value = "/posts/postEdit/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePost(
            @PathVariable Long id,
            @RequestPart("postTitle") String postTitle,
            @RequestPart("postContent") String postContent,
            @RequestPart("placeList") String placeList,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestPart(value = "existingImageUrls", required = false) String existingImageUrlsJson) {

        // JSON 문자열을 List<String>으로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> existingImageUrls = new ArrayList<>();
        try {
            if (existingImageUrlsJson != null && !existingImageUrlsJson.isEmpty()) {
                existingImageUrls = objectMapper.readValue(existingImageUrlsJson, new TypeReference<List<String>>() {});
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("existingImageUrls JSON 파싱 중 오류 발생", e);
        }

        // 업데이트 로직 수행
        PostDTO updatedPost = postService.updatePost(
            id,
            postTitle,
            postContent,
            new ArrayList<>(Arrays.asList(placeList.split(", "))), // 수정 가능한 리스트로 변환
            files,
            existingImageUrls
        );

        return ResponseEntity.ok(updatedPost);
    }




    // 게시글 삭제
    @DeleteMapping("/postDelete/{id}")
    public boolean deletePost(@PathVariable Long id) {
        return postService.deletePost(id);
    }
}
