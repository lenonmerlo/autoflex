package com.projedata.autoflex.domain.service;

import com.projedata.autoflex.domain.dto.RawMaterialDTO;
import com.projedata.autoflex.domain.model.RawMaterial;
import com.projedata.autoflex.domain.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RawMaterialService {

    private final RawMaterialRepository repository;

    // POST
    public RawMaterialDTO create(RawMaterialDTO dto) {
        if (repository.existsByCode(dto.code())) {
            throw new RuntimeException("Raw material code already exists");
        }

        RawMaterial rawMaterial = RawMaterial.builder()
                .code(dto.code())
                .name(dto.name())
                .stockQuantity(dto.stockQuantity())
                .build();

        RawMaterial saved = repository.save(rawMaterial);
        return toDTO(saved);
    }

    //GET ALL
    public List<RawMaterialDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    //GET BY ID
    public RawMaterialDTO findById(Long id) {
        RawMaterial rawMaterial = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        return toDTO(rawMaterial);
    }

    //PUT
    public RawMaterialDTO update(Long id, RawMaterialDTO dto) {
        RawMaterial rawMaterial = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        rawMaterial.setCode(dto.code());
        rawMaterial.setName(dto.name());
        rawMaterial.setStockQuantity(dto.stockQuantity());

        RawMaterial updated = repository.save(rawMaterial);

        return toDTO(updated);
    }

    //PATCH
    public RawMaterialDTO patch(Long id, RawMaterialDTO dto) {
        RawMaterial rawMaterial = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Raw material not found"));

        if (dto.code() != null) rawMaterial.setCode(dto.code());
        if (dto.name() != null) rawMaterial.setName(dto.name());
        if (dto.stockQuantity() != null) rawMaterial.setStockQuantity(dto.stockQuantity());

        RawMaterial updated = repository.save(rawMaterial);

        return toDTO(updated);

    }

    // DELETE
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Raw material not found");
        }

        repository.deleteById(id);
    }


    private RawMaterialDTO toDTO(RawMaterial rawMaterial) {
        return new RawMaterialDTO(
                rawMaterial.getId(),
                rawMaterial.getCode(),
                rawMaterial.getName(),
                rawMaterial.getStockQuantity()
        );
    }
}
