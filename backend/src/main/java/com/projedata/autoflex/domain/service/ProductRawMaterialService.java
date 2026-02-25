package com.projedata.autoflex.domain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.projedata.autoflex.domain.dto.ProductRawMaterialDTO;
import com.projedata.autoflex.domain.model.Product;
import com.projedata.autoflex.domain.model.ProductRawMaterial;
import com.projedata.autoflex.domain.model.RawMaterial;
import com.projedata.autoflex.domain.repository.ProductRawMaterialRepository;
import com.projedata.autoflex.domain.repository.ProductRepository;
import com.projedata.autoflex.domain.repository.RawMaterialRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductRawMaterialService {

    private final ProductRawMaterialRepository productRawMaterialRepository;
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductRawMaterialDTO create(ProductRawMaterialDTO dto) {

        if (dto.productId() == null) throw new RuntimeException("Product id is required");
        if (dto.rawMaterialId() == null) throw new RuntimeException("Raw material id is required");
        if (dto.requiredQuantity() == null) throw new RuntimeException("Required quantity is required");
        if (dto.requiredQuantity().signum() <= 0) throw new RuntimeException("Required quantity must be greater than zero");

        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.rawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        boolean alreadyExists = productRawMaterialRepository
                .existsByProductIdAndRawMaterialId(product.getId(), rawMaterial.getId());

        if (alreadyExists) {
            throw new RuntimeException("Raw material already associated with this product");
        }

        ProductRawMaterial association = ProductRawMaterial.builder()
                .product(product)
                .rawMaterial(rawMaterial)
                .requiredQuantity(dto.requiredQuantity())
                .build();

        ProductRawMaterial saved = productRawMaterialRepository.save(association);

        return toDTO(saved);
    }

    // GET ALL
    public List<ProductRawMaterialDTO> findAll() {
        return productRawMaterialRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // GET BY ID
    public ProductRawMaterialDTO findById(Long id) {
        ProductRawMaterial association = productRawMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product raw material association not found"));

        return toDTO(association);
    }

    public List<ProductRawMaterialDTO> findByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new RuntimeException("Product not found");
        }

        return productRawMaterialRepository.findByProductId(productId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // PUT
    public ProductRawMaterialDTO update(Long id, ProductRawMaterialDTO dto) {

        ProductRawMaterial association = productRawMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product raw material association not found"));

        if (dto.productId() == null) throw new RuntimeException("Product id is required");
        if (dto.rawMaterialId() == null) throw new RuntimeException("Raw material id is required");
        if (dto.requiredQuantity() == null) throw new RuntimeException("Required quantity is required");
        if (dto.requiredQuantity().signum() <= 0) throw new RuntimeException("Required quantity must be greater than zero");

        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        RawMaterial rawMaterial = rawMaterialRepository.findById(dto.rawMaterialId())
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        boolean alreadyExists = productRawMaterialRepository
                .existsByProductIdAndRawMaterialId(product.getId(), rawMaterial.getId());

        if (alreadyExists && !(association.getProduct().getId().equals(product.getId())
                && association.getRawMaterial().getId().equals(rawMaterial.getId()))) {
            throw new RuntimeException("Raw material already associated with this product");
        }

        association.setProduct(product);
        association.setRawMaterial(rawMaterial);
        association.setRequiredQuantity(dto.requiredQuantity());

        ProductRawMaterial updated = productRawMaterialRepository.save(association);

        return toDTO(updated);
    }

    // PATCH
    public ProductRawMaterialDTO patch(Long id, ProductRawMaterialDTO dto) {

        ProductRawMaterial association = productRawMaterialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product raw material association not found"));

        if (dto.requiredQuantity() != null) {
            if (dto.requiredQuantity().signum() <= 0) throw new RuntimeException("Required quantity must be greater than zero");
            association.setRequiredQuantity(dto.requiredQuantity());
        }

        if (dto.productId() != null || dto.rawMaterialId() != null) {
            Long newProductId = dto.productId() != null ? dto.productId() : association.getProduct().getId();
            Long newRawMaterialId = dto.rawMaterialId() != null ? dto.rawMaterialId() : association.getRawMaterial().getId();

            Product product = productRepository.findById(newProductId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            RawMaterial rawMaterial = rawMaterialRepository.findById(newRawMaterialId)
                    .orElseThrow(() -> new RuntimeException("Raw material not found"));

            boolean alreadyExists = productRawMaterialRepository
                    .existsByProductIdAndRawMaterialId(product.getId(), rawMaterial.getId());

            if (alreadyExists && !(association.getProduct().getId().equals(product.getId())
                    && association.getRawMaterial().getId().equals(rawMaterial.getId()))) {
                throw new RuntimeException("Raw material already associated with this product");
            }

            association.setProduct(product);
            association.setRawMaterial(rawMaterial);
        }

        ProductRawMaterial updated = productRawMaterialRepository.save(association);

        return toDTO(updated);
    }

    // DELETE
    public void delete(Long id) {
        if (!productRawMaterialRepository.existsById(id)) {
            throw new RuntimeException("Product raw material association not found");
        }
        productRawMaterialRepository.deleteById(id);
    }

    private ProductRawMaterialDTO toDTO(ProductRawMaterial association) {
        return new ProductRawMaterialDTO(
                association.getId(),
                association.getProduct().getId(),
                association.getRawMaterial().getId(),
                association.getRequiredQuantity()
        );
    }
}