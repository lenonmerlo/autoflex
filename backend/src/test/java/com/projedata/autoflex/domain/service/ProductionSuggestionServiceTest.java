package com.projedata.autoflex.domain.service;

import com.projedata.autoflex.domain.dto.ProductionSuggestionDTO;
import com.projedata.autoflex.domain.model.Product;
import com.projedata.autoflex.domain.model.ProductRawMaterial;
import com.projedata.autoflex.domain.model.RawMaterial;
import com.projedata.autoflex.domain.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductionSuggestionServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductionSuggestionService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void calculate_shouldReturnProducibleProducts_sortedByPriceDesc() {
        RawMaterial steel = RawMaterial.builder()
                .id(1L).code("RM-001").name("Steel").stockQuantity(new BigDecimal("10.0000"))
                .build();

        Product productA = Product.builder()
                .id(1L).code("P-001").name("Chair").price(new BigDecimal("300.00"))
                .build();

        ProductRawMaterial bomA = ProductRawMaterial.builder()
                .id(10L).product(productA).rawMaterial(steel).requiredQuantity(new BigDecimal("2.5000"))
                .build();

        productA.setBillOfMaterials(Set.of(bomA));

        Product productB = Product.builder()
                .id(2L).code("P-002").name("Table").price(new BigDecimal("100.00"))
                .build();

        ProductRawMaterial bomB = ProductRawMaterial.builder()
                .id(11L).product(productB).rawMaterial(steel).requiredQuantity(new BigDecimal("5.0000"))
                .build();

        productB.setBillOfMaterials(Set.of(bomB));

        when(productRepository.findAllWithBillOfMaterials()).thenReturn(List.of(productB, productA));

        List<ProductionSuggestionDTO> result = service.calculate();

        assertEquals(2, result.size());

        assertEquals("P-001", result.get(0).productCode());
        assertEquals(4L, result.get(0).producibleQuantity());
        assertEquals(new BigDecimal("1200.00"), result.get(0).totalValue());

        assertEquals("P-002", result.get(1).productCode());
        assertEquals(2L, result.get(1).producibleQuantity());
        assertEquals(new BigDecimal("200.00"), result.get(1).totalValue());
    }
}