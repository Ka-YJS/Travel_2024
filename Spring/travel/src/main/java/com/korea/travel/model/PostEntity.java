package com.korea.travel.model;

import java.util.List;

import jakarta.persistence.CollectionTable;
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
	private Long postId;				//고유 id
	
	@Column(nullable = false)
    private String postTitle;
    
    @Column(columnDefinition = "TEXT")
    private String postContent;
    
    @Column(nullable = false)
    private String userNickname;
    
    @ElementCollection
    @CollectionTable(name = "post_places", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "place_list")
    private List<String> placeList;
    
    @ElementCollection
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "image_urls")
    private List<String> imageUrls;
    
    private String thumbnail;
    
    private int likes;
    
    private String postCreatedAt;
    
 // UserEntity와의 연관 관계 설정 (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)  // 다대일 관계 user가 여러 게시글을 쓸수있게해준다.
    @JoinColumn(name = "user_id")       // 외래 키 컬럼명
    private UserEntity userEntity;            // 해당 게시글을 작성한 UserEntity
    
    
    
}