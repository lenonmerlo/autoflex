package com.projedata.autoflex.domain.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.projedata.autoflex.domain.dto.ProductionSuggestionDTO;
import com.projedata.autoflex.domain.model.Product;
import com.projedata.autoflex.domain.model.ProductRawMaterial;
import com.projedata.autoflex.domain.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductionSuggestionService {

    private final ProductRepository productRepository;

    public List<ProductionSuggestionDTO> calculate() {

        List<Product> products = productRepository.findAllWithBillOfMaterials();

        List<Product> ordered = products.stream()
                .sorted(Comparator.comparing(Product::getPrice).reversed())
                .toList();

        Map<Long, BigDecimal> remainingStock = new HashMap<>();

        for (Product product : ordered) {
            if (product.getBillOfMaterials() == null) continue;
            for (ProductRawMaterial bom : product.getBillOfMaterials()) {
                if (bom.getRawMaterial() == null) continue;
                Long rawId = bom.getRawMaterial().getId();
                if (rawId == null) continue;
                if (!remainingStock.containsKey(rawId)) {
                    BigDecimal stock = bom.getRawMaterial().getStockQuantity();
                    remainingStock.put(rawId, stock == null ? BigDecimal.ZERO : stock);
                }
            }
        }

        Map<Long, BigDecimal> remainingStockSnapshot = new HashMap<>(remainingStock);

        return ordered.stream()
                .map(p -> calculateForProduct(p, remainingStockSnapshot))
                .filter(s -> s.producibleQuantity() > 0)
                .toList();
    }

    private ProductionSuggestionDTO calculateForProduct(Product product, Map<Long, BigDecimal> remainingStock) {

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

            if (bom.getRawMaterial() == null || bom.getRawMaterial().getId() == null) {
                maxProducible = 0L;
                break;
            }

            BigDecimal stock = remainingStock.getOrDefault(bom.getRawMaterial().getId(), BigDecimal.ZERO);
            BigDecimal required = bom.getRequiredQuantity();

            if (required == null || required.compareTo(BigDecimal.ZERO) <= 0) {
                maxProducible = 0L;
                break;
            }

            long possible = stock.divide(required, 0, RoundingMode.DOWN).longValue();

            maxProducible = Math.min(maxProducible, possible);

            if (maxProducible == 0L) break;
        }

        if (maxProducible > 0 && maxProducible != Long.MAX_VALUE) {
            for (ProductRawMaterial bom : product.getBillOfMaterials()) {
                if (bom.getRawMaterial() == null || bom.getRawMaterial().getId() == null) continue;
                BigDecimal required = bom.getRequiredQuantity();
                if (required == null || required.compareTo(BigDecimal.ZERO) <= 0) continue;

                BigDecimal used = required.multiply(BigDecimal.valueOf(maxProducible));
                Long rawId = bom.getRawMaterial().getId();
                BigDecimal current = remainingStock.getOrDefault(rawId, BigDecimal.ZERO);
                BigDecimal next = current.subtract(used);
                remainingStock.put(rawId, next.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : next);
            }
        }

        if (maxProducible == Long.MAX_VALUE) {
            maxProducible = 0L;
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