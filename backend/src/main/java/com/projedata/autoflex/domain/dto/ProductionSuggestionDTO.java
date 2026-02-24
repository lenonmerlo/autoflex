package com.projedata.autoflex.domain.dto;

import java.math.BigDecimal;

public record ProductionSuggestionDTO(
        Long productId,
        String productCode,
        String productName,
        BigDecimal unitPrice,
        Long producibleQuantity,
        BigDecimal totalValue
) {}