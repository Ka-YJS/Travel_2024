package com.korea.travel.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.korea.travel.dto.PostDTO;
import com.korea.travel.model.PostEntity;
import com.korea.travel.model.UserEntity;
import com.korea.travel.persistence.LikeRepository;
import com.korea.travel.persistence.PostRepository;
import com.korea.travel.persistence.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;	
	
    private final UserRepository userRepository;
    
    private final LikeRepository likeRepository;
	

    @Value("${file.upload-dir}") // 파일 저장 경로 설정
    private String uploadDir;

    // 게시판 전체 조회
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // 마이 게시판 조회
    public List<PostDTO> getMyPosts(Long userId) {
    	
       Optional<UserEntity> user = userRepository.findById(userId);
       
       if(user.isPresent()) {
    	   List<PostEntity> posts = postRepository.findByUserEntity(user.get());
       
	       return posts.stream()
	             .map(this::convertToDTO)
	             .collect(Collectors.toList());
       }
       else {
          throw new IllegalArgumentException("User not found");
       }
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

    
    //게시글 수정
    public PostDTO updatePost(Long id, String postTitle, String postContent, List<String> placeListParsed, 
    		String userNickName,List<MultipartFile> files, List<String> existingImageUrls) {
		
    	//게시글 조회
    	PostEntity postEntity = postRepository.findById(id)
		.orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
		
		postEntity.setPostTitle(postTitle);
		postEntity.setPostContent(postContent);
		postEntity.setUserNickname(userNickName);
		
		//여행지 리스트 업데이트
		if(placeListParsed != null && !placeListParsed.isEmpty()) {
			postEntity.setPlaceList(new ArrayList<>(placeListParsed));
        }else {
        	postEntity.setPlaceList(null);
        }
		
		//기존 이미지와 수정된 이미지 비교 삭제
	    List<String> currentImageUrls = postEntity.getImageUrls(); // DB에 저장된 이미지들
	    List<String> imagesToDelete = new ArrayList<>(currentImageUrls);
		
	    if (existingImageUrls != null) {
	        imagesToDelete.removeAll(existingImageUrls); // 유지할 이미지는 삭제 목록에서 제외
	    }
	    
	    if (imagesToDelete != null && !imagesToDelete.isEmpty()) {
	        for (String imageUrl : imagesToDelete) {
	            String filePath = System.getProperty("user.dir") + imageUrl;
	            File file = new File(filePath);

	            if (file.exists()) {
	                if (file.delete()) {
	                    System.out.println("이미지 삭제 완료: " + filePath);
	                } else {
	                    System.err.println("이미지 삭제 실패: " + filePath);
	                }
	            } else {
	                System.err.println("이미지가 존재하지 않습니다: " + filePath);
	            }
	        }
	    }
	    
	    //기존+새로 업로드된 이미지 저장
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
        	
        	PostEntity post = postRepository.getById(id);
        	
        	List<String> imageUrls = post.getImageUrls();
        	
        	if (imageUrls != null && !imageUrls.isEmpty()) {
                for (String imageUrl : imageUrls) {
                    // 저장된 파일 경로 생성
                    String filePath = System.getProperty("user.dir") + imageUrl;
                    File file = new File(filePath);
                    
                    if (file.exists()) {
                        if (file.delete()) {
                            System.out.println("이미지가 삭제되었습니다: " + filePath);
                        } else {
                            System.err.println("이미지 삭제 실패: " + filePath);
                        }
                    } else {
                        System.err.println("이미지가 존재하지 않습니다: " + filePath);
                    }
                }
            } else {
                System.out.println("삭제할 이미지가 없습니다. 게시물 ID: " + post.getPostId());
            }
        	
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
                .likes(likeRepository.countByPostEntity(entity))
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
                .postCreatedAt(dto.getPostCreatedAt())
                .userEntity(dto.getUserEntity())
                .build();
    }
}
