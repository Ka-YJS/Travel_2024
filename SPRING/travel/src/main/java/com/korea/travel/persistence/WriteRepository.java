package com.korea.travel.persistence;

import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;

import com.korea.travel.model.WriteEntity;

public interface WriteRepository extends JpaAttributeConverter<WriteEntity, Long> {

}
