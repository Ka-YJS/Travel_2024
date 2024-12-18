package com.korea.travel.controller;

import com.korea.travel.dto.PostDTO;
import com.korea.travel.model.PostEntity;
import com.korea.travel.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // React 앱이 동작하는 주소
public class PostController {

    @Autowired
    private PostService postService;

//    @GetMapping("/posts")
//    public ResponseEntity<List<PostDTO>> getAllPosts() {
//        return ResponseEntity.ok(postService.getAllPosts());
//    }
//
//    @PostMapping("/map")
//    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO) {
//        return ResponseEntity.ok(postService.createPost(postDTO));
//    }
}
