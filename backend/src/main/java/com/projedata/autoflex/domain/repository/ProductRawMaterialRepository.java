package com.projedata.autoflex.domain.repository;

import com.projedata.autoflex.domain.model.ProductRawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRawMaterialRepository extends JpaRepository<ProductRawMaterial, Long> {

    boolean existsByProductIdAndRawMaterialId(Long productId, Long rawMaterialId);

    List<ProductRawMaterial> findByProductId(Long productId);
}