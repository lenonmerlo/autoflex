package com.projedata.autoflex.web.controller;

import com.projedata.autoflex.domain.dto.RawMaterialDTO;
import com.projedata.autoflex.domain.service.RawMaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/raw-materials")
@RequiredArgsConstructor
public class RawMaterialController {
    private final RawMaterialService service;

    @PostMapping
    public RawMaterialDTO create(@RequestBody RawMaterialDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<RawMaterialDTO> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public RawMaterialDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public RawMaterialDTO update(@PathVariable Long id,
                                 @RequestBody RawMaterialDTO dto) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}")
    public RawMaterialDTO patch(@PathVariable Long id,
                                @RequestBody RawMaterialDTO dto) {
        return service.patch(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
