package com.korea.travel.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Table(name = "posts")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class PostEntity {
   
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long postId;            //고유 id
   
   @Column(nullable = false)
    private String postTitle;		//게시판제목
    
    @Column(columnDefinition = "TEXT")
    private String postContent;		//게시판내용
    
    @Column(nullable = false)
    private String userNickname;	//작성자닉네임
    
    @ElementCollection
    private List<String> placeList;	//여행경로저장List
    
    @ElementCollection
    private List<String> imageUrls;	//사진저장List
    
    private String thumbnail;
    
    private int likes;//좋아요하트수
    
    private String postCreatedAt;	//게시판등록시간
    
 // UserEntity와의 연관 관계 설정 (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)  // 다대일 관계 user가 여러 게시글을 쓸수있게해준다.
    @JoinColumn(name = "user_id")       // 외래 키 컬럼명
    private UserEntity userEntity;            // 해당 게시글을 작성한 UserEntity   
}