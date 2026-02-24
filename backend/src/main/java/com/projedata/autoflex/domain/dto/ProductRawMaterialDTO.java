package com.projedata.autoflex.domain.dto;


import java.math.BigDecimal;

public record ProductRawMaterialDTO(
        Long id,
        Long productId,
        Long rawMaterialId,
        BigDecimal requiredQuantity
) {}
