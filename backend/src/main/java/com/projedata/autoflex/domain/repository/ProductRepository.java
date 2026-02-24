package com.projedata.autoflex.domain.repository;

import com.projedata.autoflex.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCode(String code);
    boolean existsByCode(String code);

    @Query("select distinct p from Product p left join fetch p.billOfMaterials bom left join fetch bom.rawMaterial")
    List<Product> findAllWithBillOfMaterials();
}
