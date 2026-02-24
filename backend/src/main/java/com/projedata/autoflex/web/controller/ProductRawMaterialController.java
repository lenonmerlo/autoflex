package com.projedata.autoflex.web.controller;

import com.projedata.autoflex.domain.dto.ProductRawMaterialDTO;
import com.projedata.autoflex.domain.service.ProductRawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product-raw-materials")
@RequiredArgsConstructor
public class ProductRawMaterialController {

    private final ProductRawMaterialService service;

    @PostMapping
    public ProductRawMaterialDTO create(@RequestBody ProductRawMaterialDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<ProductRawMaterialDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ProductRawMaterialDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/by-product/{productId}")
    public List<ProductRawMaterialDTO> findByProductId(@PathVariable Long productId) {
        return service.findByProductId(productId);
    }

    @PutMapping("/{id}")
    public ProductRawMaterialDTO update(@PathVariable Long id, @RequestBody ProductRawMaterialDTO dto) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}")
    public ProductRawMaterialDTO patch(@PathVariable Long id, @RequestBody ProductRawMaterialDTO dto) {
        return service.patch(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
