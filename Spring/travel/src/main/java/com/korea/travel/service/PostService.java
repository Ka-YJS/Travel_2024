package com.korea.travel.service;

import com.korea.travel.dto.PostDTO;
import com.korea.travel.model.PostEntity;
import com.korea.travel.persistence.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

//    public List<PostDTO> getAllPosts() {
//        return postRepository.findAll().stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public PostDTO createPost(PostDTO postDTO) {
//        PostEntity savedEntity = postRepository.save(convertToEntity(postDTO));
//        return convertToDTO(savedEntity);
//    }
//
//    private PostDTO convertToDTO(PostEntity entity) {
//        return PostDTO.builder()
//                .postId(entity.getPostId())
//                .postTitle(entity.getPostTitle())
//                .postContent(entity.getPostContent())
//                .userName(entity.getUserName())
//                .placeList(entity.getPlaceList())
//                .imageUrls(entity.getImageUrls())
//                .thumbnail(entity.getThumbnail())
//                .likes(entity.getLikes())
//                .postCreatedAt(entity.getPostCreatedAt())
//                .build();
//    }
//
//    private PostEntity convertToEntity(PostDTO dto) {
//        return PostEntity.builder()
//                .postTitle(dto.getPostTitle())
//                .postContent(dto.getPostContent())
//                .userName(dto.getUserName())
//                .placeList(dto.getPlaceList())
//                .imageUrls(dto.getImageUrls())
//                .thumbnail(dto.getThumbnail())
//                .likes(dto.getLikes())
//                .postCreatedAt(dto.getPostCreatedAt())
//                .build();
//    }
}
