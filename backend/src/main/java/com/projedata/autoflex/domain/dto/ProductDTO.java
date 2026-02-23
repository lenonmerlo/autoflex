package com.projedata.autoflex.domain.dto;

import java.math.BigDecimal;

public record ProductDTO (
        Long id,
        String code,
        String name,
        BigDecimal price
) {}
