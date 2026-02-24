package com.projedata.autoflex.domain.service;

import com.projedata.autoflex.domain.dto.ProductionSuggestionDTO;
import com.projedata.autoflex.domain.model.Product;
import com.projedata.autoflex.domain.model.ProductRawMaterial;
import com.projedata.autoflex.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductionSuggestionService {

    private final ProductRepository productRepository;

    public List<ProductionSuggestionDTO> calculate() {

        List<Product> products = productRepository.findAllWithBillOfMaterials();

        return products.stream()
                .map(this::calculateForProduct)
                .filter(s -> s.producibleQuantity() > 0)
                .sorted(Comparator.comparing(ProductionSuggestionDTO::unitPrice).reversed())
                .toList();
    }

    private ProductionSuggestionDTO calculateForProduct(Product product) {

        if (product.getBillOfMaterials() == null || product.getBillOfMaterials().isEmpty()) {
            return new ProductionSuggestionDTO(
                    product.getId(),
                    product.getCode(),
                    product.getName(),
                    product.getPrice(),
                    0L,
                    BigDecimal.ZERO
            );
        }

        long maxProducible = Long.MAX_VALUE;

        for (ProductRawMaterial bom : product.getBillOfMaterials()) {

            if (bom.getRawMaterial() == null || bom.getRawMaterial().getStockQuantity() == null) {
                maxProducible = 0L;
                break;
            }

            BigDecimal stock = bom.getRawMaterial().getStockQuantity();
            BigDecimal required = bom.getRequiredQuantity();

            if (required == null || required.compareTo(BigDecimal.ZERO) <= 0) {
                maxProducible = 0L;
                break;
            }

            long possible = stock.divide(required, 0, RoundingMode.DOWN).longValue();

            maxProducible = Math.min(maxProducible, possible);

            if (maxProducible == 0L) break;
        }

        BigDecimal totalValue = product.getPrice().multiply(BigDecimal.valueOf(maxProducible));

        return new ProductionSuggestionDTO(
                product.getId(),
                product.getCode(),
                product.getName(),
                product.getPrice(),
                maxProducible,
                totalValue
        );
    }
}