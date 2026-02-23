package com.projedata.autoflex.domain.service;

import com.projedata.autoflex.domain.dto.ProductDTO;
import com.projedata.autoflex.domain.model.Product;
import com.projedata.autoflex.domain.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository repository;

    @InjectMocks
    private ProductService service;

    @Test
    void shouldCreateProduct() {

        ProductDTO dto = new ProductDTO(
                null,
                "P001",
                "Produto Teste",
                BigDecimal.valueOf(100)
        );

        Product product = Product.builder()
                .id(1L)
                .code("P001")
                .name("Produto Teste")
                .price(BigDecimal.valueOf(100))
                .build();

        when(repository.existsByCode("P001")).thenReturn(false);
        when(repository.save(any(Product.class))).thenReturn(product);

        ProductDTO result = service.create(dto);

        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.code()).isEqualTo("P001");

        verify(repository, times(1)).save(any(Product.class));
    }
}