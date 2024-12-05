package com.korea.travel.model;

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
@Table
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class WriteEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;				//고유 id
	private String writeTitle;		//게시글제목
	private String writeContent;	//게시글내용
	private String writeCreatedAt;	//게시글등록시간
	
	// UserEntity와의 연관 관계 설정 (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)  // 다대일 관계 user가 여러 게시글을 쓸수있게해준다.
    @JoinColumn(name = "user_id")       // 외래 키 컬럼명
    private UserEntity userEntity;            // 해당 게시글을 작성한 UserEntity
    
}
