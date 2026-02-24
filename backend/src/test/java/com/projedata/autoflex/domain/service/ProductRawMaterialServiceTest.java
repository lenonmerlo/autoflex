package com.projedata.autoflex.domain.service;

import com.projedata.autoflex.domain.dto.ProductRawMaterialDTO;
import com.projedata.autoflex.domain.model.Product;
import com.projedata.autoflex.domain.model.ProductRawMaterial;
import com.projedata.autoflex.domain.model.RawMaterial;
import com.projedata.autoflex.domain.repository.ProductRawMaterialRepository;
import com.projedata.autoflex.domain.repository.ProductRepository;
import com.projedata.autoflex.domain.repository.RawMaterialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductRawMaterialServiceTest {

    @Mock
    private ProductRawMaterialRepository productRawMaterialRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @InjectMocks
    private ProductRawMaterialService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void create_shouldCreateAssociation_whenValidAndNotDuplicated() {
        // Arrange
        ProductRawMaterialDTO dto = new ProductRawMaterialDTO(
                null,
                1L,
                2L,
                new BigDecimal("2.5000")
        );

        Product product = Product.builder().id(1L).code("P-001").name("Chair").price(new BigDecimal("299.90")).build();
        RawMaterial rawMaterial = RawMaterial.builder().id(2L).code("RM-001").name("Steel").stockQuantity(new BigDecimal("100.0000")).build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(rawMaterialRepository.findById(2L)).thenReturn(Optional.of(rawMaterial));
        when(productRawMaterialRepository.existsByProductIdAndRawMaterialId(1L, 2L)).thenReturn(false);

        ProductRawMaterial saved = ProductRawMaterial.builder()
                .id(10L)
                .product(product)
                .rawMaterial(rawMaterial)
                .requiredQuantity(new BigDecimal("2.5000"))
                .build();

        when(productRawMaterialRepository.save(any(ProductRawMaterial.class))).thenReturn(saved);

        // Act
        ProductRawMaterialDTO result = service.create(dto);

        // Assert
        assertNotNull(result);
        assertEquals(10L, result.id());
        assertEquals(1L, result.productId());
        assertEquals(2L, result.rawMaterialId());
        assertEquals(new BigDecimal("2.5000"), result.requiredQuantity());

        verify(productRepository).findById(1L);
        verify(rawMaterialRepository).findById(2L);
        verify(productRawMaterialRepository).existsByProductIdAndRawMaterialId(1L, 2L);
        verify(productRawMaterialRepository).save(any(ProductRawMaterial.class));
    }

    @Test
    void create_shouldThrowException_whenAssociationAlreadyExists() {
        // Arrange
        ProductRawMaterialDTO dto = new ProductRawMaterialDTO(null, 1L, 2L, new BigDecimal("1.0000"));

        Product product = Product.builder().id(1L).build();
        RawMaterial rawMaterial = RawMaterial.builder().id(2L).build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(rawMaterialRepository.findById(2L)).thenReturn(Optional.of(rawMaterial));
        when(productRawMaterialRepository.existsByProductIdAndRawMaterialId(1L, 2L)).thenReturn(true);

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.create(dto));
        assertEquals("Raw material already associated with this product", ex.getMessage());

        verify(productRawMaterialRepository, never()).save(any());
    }

    @Test
    void create_shouldThrowException_whenProductNotFound() {
        // Arrange
        ProductRawMaterialDTO dto = new ProductRawMaterialDTO(null, 999L, 2L, new BigDecimal("1.0000"));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.create(dto));
        assertEquals("Product not found", ex.getMessage());

        verify(rawMaterialRepository, never()).findById(anyLong());
        verify(productRawMaterialRepository, never()).save(any());
    }

    @Test
    void create_shouldThrowException_whenRawMaterialNotFound() {
        // Arrange
        ProductRawMaterialDTO dto = new ProductRawMaterialDTO(null, 1L, 999L, new BigDecimal("1.0000"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(Product.builder().id(1L).build()));
        when(rawMaterialRepository.findById(999L)).thenReturn(Optional.empty());

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.create(dto));
        assertEquals("Raw material not found", ex.getMessage());

        verify(productRawMaterialRepository, never()).save(any());
    }

    @Test
    void patch_shouldUpdateRequiredQuantity_whenProvided() {
        // Arrange
        Product product = Product.builder().id(1L).build();
        RawMaterial rawMaterial = RawMaterial.builder().id(2L).build();

        ProductRawMaterial existing = ProductRawMaterial.builder()
                .id(10L)
                .product(product)
                .rawMaterial(rawMaterial)
                .requiredQuantity(new BigDecimal("2.5000"))
                .build();

        when(productRawMaterialRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(productRawMaterialRepository.save(any(ProductRawMaterial.class))).thenAnswer(inv -> inv.getArgument(0));

        ProductRawMaterialDTO patchDto = new ProductRawMaterialDTO(null, null, null, new BigDecimal("3.0000"));

        // Act
        ProductRawMaterialDTO result = service.patch(10L, patchDto);

        // Assert
        assertEquals(10L, result.id());
        assertEquals(1L, result.productId());
        assertEquals(2L, result.rawMaterialId());
        assertEquals(new BigDecimal("3.0000"), result.requiredQuantity());

        verify(productRawMaterialRepository).findById(10L);
        verify(productRawMaterialRepository).save(existing);
    }

    @Test
    void findByProductId_shouldReturnAssociations_whenProductExists() {
        // Arrange
        when(productRepository.existsById(1L)).thenReturn(true);

        Product product = Product.builder().id(1L).build();
        RawMaterial rm = RawMaterial.builder().id(2L).build();

        ProductRawMaterial a1 = ProductRawMaterial.builder()
                .id(10L).product(product).rawMaterial(rm).requiredQuantity(new BigDecimal("1.0000")).build();

        when(productRawMaterialRepository.findByProductId(1L)).thenReturn(List.of(a1));

        // Act
        List<ProductRawMaterialDTO> result = service.findByProductId(1L);

        // Assert
        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).id());
        assertEquals(1L, result.get(0).productId());
        assertEquals(2L, result.get(0).rawMaterialId());

        verify(productRepository).existsById(1L);
        verify(productRawMaterialRepository).findByProductId(1L);
    }

    @Test
    void findByProductId_shouldThrowException_whenProductNotFound() {
        // Arrange
        when(productRepository.existsById(999L)).thenReturn(false);

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.findByProductId(999L));
        assertEquals("Product not found", ex.getMessage());

        verify(productRawMaterialRepository, never()).findByProductId(anyLong());
    }

    @Test
    void delete_shouldDelete_whenExists() {
        // Arrange
        when(productRawMaterialRepository.existsById(10L)).thenReturn(true);

        // Act
        service.delete(10L);

        // Assert
        verify(productRawMaterialRepository).existsById(10L);
        verify(productRawMaterialRepository).deleteById(10L);
    }

    @Test
    void delete_shouldThrowException_whenNotExists() {
        // Arrange
        when(productRawMaterialRepository.existsById(999L)).thenReturn(false);

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.delete(999L));
        assertEquals("Product raw material association not found", ex.getMessage());

        verify(productRawMaterialRepository, never()).deleteById(anyLong());
    }
}