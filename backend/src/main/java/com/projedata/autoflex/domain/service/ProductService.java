package com.projedata.autoflex.domain.service;

import com.projedata.autoflex.domain.dto.ProductDTO;
import com.projedata.autoflex.domain.model.Product;
import com.projedata.autoflex.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repository;

    //POST
    public ProductDTO create(ProductDTO dto) {

        if (repository.existsByCode(dto.code())) {
            throw new RuntimeException("Product code already exists");
        }

        Product product = Product.builder()
                .code(dto.code())
                .name(dto.name())
                .price(dto.price())
                .build();

        Product saved = repository.save(product);

        return toDTO(saved);
    }

    // GET ALL
    public List<ProductDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // GET BY ID
    public ProductDTO findById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return toDTO(product);
    }

    //PUT
    public ProductDTO update(Long id, ProductDTO dto) {

        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setCode(dto.code());
        product.setName(dto.name());
        product.setPrice(dto.price());

        Product updated = repository.save(product);

        return toDTO(updated);
    }

    //PATCH
    public ProductDTO patch(Long id, ProductDTO dto) {

        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (dto.code() != null) product.setCode(dto.code());
        if (dto.name() != null) product.setName(dto.name());
        if (dto.price() != null) product.setPrice(dto.price());

        Product updated = repository.save(product);

        return toDTO(updated);
    }

    //DELETE
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        repository.deleteById(id);
    }

    private ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(), product.getCode(), product.getName(), product.getPrice()
        );
    }
}

