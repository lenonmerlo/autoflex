package com.projedata.autoflex.web.controller;

import com.projedata.autoflex.domain.dto.ProductDTO;
import com.projedata.autoflex.domain.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @PostMapping
    public ProductDTO create(@RequestBody ProductDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<ProductDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ProductDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public ProductDTO update(@PathVariable Long id, @RequestBody ProductDTO dto) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}")
    public ProductDTO patch(@PathVariable Long id, @RequestBody ProductDTO dto) {
        return service.patch(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
