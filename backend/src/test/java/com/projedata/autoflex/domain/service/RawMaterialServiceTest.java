package com.projedata.autoflex.domain.service;

import com.projedata.autoflex.domain.dto.RawMaterialDTO;
import com.projedata.autoflex.domain.model.RawMaterial;
import com.projedata.autoflex.domain.repository.RawMaterialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RawMaterialServiceTest {

    @Mock
    private RawMaterialRepository repository;

    @InjectMocks
    private RawMaterialService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void create_shouldCreateRawMaterial_whenCodeDoesNotExist() {
        // Arrange
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM-001", "Steel", new BigDecimal("10.5000"));

        when(repository.existsByCode("RM-001")).thenReturn(false);

        RawMaterial savedEntity = RawMaterial.builder()
                .id(1L)
                .code("RM-001")
                .name("Steel")
                .stockQuantity(new BigDecimal("10.5000"))
                .build();

        when(repository.save(any(RawMaterial.class))).thenReturn(savedEntity);

        // Act
        RawMaterialDTO result = service.create(dto);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("RM-001", result.code());
        assertEquals("Steel", result.name());
        assertEquals(new BigDecimal("10.5000"), result.stockQuantity());

        verify(repository, times(1)).existsByCode("RM-001");
        verify(repository, times(1)).save(any(RawMaterial.class));
    }

    @Test
    void create_shouldThrowException_whenCodeAlreadyExists() {
        // Arrange
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM-001", "Steel", new BigDecimal("10.5000"));
        when(repository.existsByCode("RM-001")).thenReturn(true);

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.create(dto));
        assertEquals("Raw material code already exists", ex.getMessage());

        verify(repository, times(1)).existsByCode("RM-001");
        verify(repository, never()).save(any());
    }

    @Test
    void findById_shouldReturnRawMaterial_whenFound() {
        // Arrange
        RawMaterial entity = RawMaterial.builder()
                .id(1L)
                .code("RM-001")
                .name("Steel")
                .stockQuantity(new BigDecimal("10.5000"))
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(entity));

        // Act
        RawMaterialDTO result = service.findById(1L);

        // Assert
        assertEquals(1L, result.id());
        assertEquals("RM-001", result.code());
        assertEquals("Steel", result.name());
        assertEquals(new BigDecimal("10.5000"), result.stockQuantity());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void findById_shouldThrowException_whenNotFound() {
        // Arrange
        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.findById(99L));
        assertEquals("Raw material not found", ex.getMessage());
        verify(repository, times(1)).findById(99L);
    }

    @Test
    void patch_shouldUpdateOnlyProvidedFields() {
        // Arrange
        RawMaterial existing = RawMaterial.builder()
                .id(1L)
                .code("RM-001")
                .name("Steel")
                .stockQuantity(new BigDecimal("10.5000"))
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(RawMaterial.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Vamos alterar só name (deixa code e stockQuantity como null no DTO)
        RawMaterialDTO patchDto = new RawMaterialDTO(null, null, "Stainless Steel", null);

        // Act
        RawMaterialDTO result = service.patch(1L, patchDto);

        // Assert
        assertEquals(1L, result.id());
        assertEquals("RM-001", result.code()); // não mudou
        assertEquals("Stainless Steel", result.name()); // mudou
        assertEquals(new BigDecimal("10.5000"), result.stockQuantity()); // não mudou

        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(existing);
    }

    @Test
    void delete_shouldDelete_whenExists() {
        // Arrange
        when(repository.existsById(1L)).thenReturn(true);

        // Act
        service.delete(1L);

        // Assert
        verify(repository, times(1)).existsById(1L);
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    void delete_shouldThrowException_whenNotExists() {
        // Arrange
        when(repository.existsById(99L)).thenReturn(false);

        // Act + Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.delete(99L));
        assertEquals("Raw material not found", ex.getMessage());

        verify(repository, times(1)).existsById(99L);
        verify(repository, never()).deleteById(anyLong());
    }
}