package com.korea.travel.service;

import com.korea.travel.dto.PostDTO;
import com.korea.travel.model.PostEntity;
import com.korea.travel.persistence.PostRepository;
import com.korea.travel.persistence.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

	@Autowired
    private PostRepository postRepository;
	
	

    @Value("${file.upload-dir}") // 파일 저장 경로 설정
    private String uploadDir;

    // 게시판 전체 조회
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 마이 게시판 조회
    public List<PostDTO> getMyPosts(Long id) {
    	
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    

    // 게시글 한 건 조회
    public PostDTO getPostById(Long id) {
        Optional<PostEntity> board = postRepository.findById(id);
        if(board.isPresent()) {
        	return board.map(this::convertToDTO)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        }else {
        	throw new RuntimeException("게시글을 찾을 수 없습니다.");
		}
    }

    // 게시글 생성
    public PostDTO createPost(PostDTO postDTO) {
        PostEntity savedEntity = postRepository.save(convertToEntity(postDTO));
        return convertToDTO(savedEntity);
    }

    public List<String> saveFiles(List<MultipartFile> files) {
        List<String> fileUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get("uploads/" + fileName);
                Files.write(filePath, file.getBytes());
                fileUrls.add("/uploads/" + fileName); // 파일 접근 URL
            } catch (IOException e) {
                throw new RuntimeException("파일 저장 중 오류 발생", e);
            }
        }
        return fileUrls;
    }


    public PostDTO updatePost(Long id, String postTitle, String postContent, List<String> placeList, 
            List<MultipartFile> files, List<String> existingImageUrls) {
		PostEntity postEntity = postRepository.findById(id)
		.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
		
		postEntity.setPostTitle(postTitle);
		postEntity.setPostContent(postContent);
		postEntity.setPlaceList(placeList);
		
		List<String> allImageUrls = new ArrayList<>(existingImageUrls);
		if (files != null && !files.isEmpty()) {
		List<String> newImageUrls = saveFiles(files);
		allImageUrls.addAll(newImageUrls);
		}
		postEntity.setImageUrls(allImageUrls);
		
		PostEntity updatedEntity = postRepository.save(postEntity);
		return convertToDTO(updatedEntity);
		}



    
    
    
    // 게시글 삭제
    public boolean deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PostDTO convertToDTO(PostEntity entity) {
        return PostDTO.builder()
                .postId(entity.getPostId())
                .userId(entity.getUserEntity().getId())
                .postTitle(entity.getPostTitle())
                .postContent(entity.getPostContent())
                .userNickname(entity.getUserNickname())
                .placeList(entity.getPlaceList())
                .imageUrls(entity.getImageUrls())
                .likes(entity.getLikes())
                .postCreatedAt(entity.getPostCreatedAt())
                .build();
    }

    private PostEntity convertToEntity(PostDTO dto) {
        return PostEntity.builder()
                .postTitle(dto.getPostTitle())
                .postContent(dto.getPostContent())
                .userNickname(dto.getUserNickname())
                .placeList(dto.getPlaceList())
                .imageUrls(dto.getImageUrls())
                .likes(dto.getLikes())
                .postCreatedAt(dto.getPostCreatedAt())
                .userEntity(dto.getUserEntity())
                .build();
    }
}
