package com.projedata.autoflex.domain.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.projedata.autoflex.domain.dto.RawMaterialDTO;
import com.projedata.autoflex.domain.model.RawMaterial;
import com.projedata.autoflex.domain.repository.RawMaterialRepository;

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
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM-001", "Steel", new BigDecimal("10.5000"));

        when(repository.existsByCode("RM-001")).thenReturn(false);

        RawMaterial savedEntity = RawMaterial.builder()
                .id(1L)
                .code("RM-001")
                .name("Steel")
                .stockQuantity(new BigDecimal("10.5000"))
                .build();

        when(repository.save(any(RawMaterial.class))).thenReturn(savedEntity);

        RawMaterialDTO result = service.create(dto);

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
        RawMaterialDTO dto = new RawMaterialDTO(null, "RM-001", "Steel", new BigDecimal("10.5000"));
        when(repository.existsByCode("RM-001")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.create(dto));
        assertEquals("Raw material code already exists", ex.getMessage());

        verify(repository, times(1)).existsByCode("RM-001");
        verify(repository, never()).save(any());
    }

    @Test
    void findById_shouldReturnRawMaterial_whenFound() {
        RawMaterial entity = RawMaterial.builder()
                .id(1L)
                .code("RM-001")
                .name("Steel")
                .stockQuantity(new BigDecimal("10.5000"))
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(entity));

        RawMaterialDTO result = service.findById(1L);

        assertEquals(1L, result.id());
        assertEquals("RM-001", result.code());
        assertEquals("Steel", result.name());
        assertEquals(new BigDecimal("10.5000"), result.stockQuantity());
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void findById_shouldThrowException_whenNotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.findById(99L));
        assertEquals("Raw material not found", ex.getMessage());
        verify(repository, times(1)).findById(99L);
    }

    @Test
    void patch_shouldUpdateOnlyProvidedFields() {
        RawMaterial existing = RawMaterial.builder()
                .id(1L)
                .code("RM-001")
                .name("Steel")
                .stockQuantity(new BigDecimal("10.5000"))
                .build();

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(RawMaterial.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RawMaterialDTO patchDto = new RawMaterialDTO(null, null, "Stainless Steel", null);

        RawMaterialDTO result = service.patch(1L, patchDto);

        assertEquals(1L, result.id());
        assertEquals("RM-001", result.code());
        assertEquals("Stainless Steel", result.name());
        assertEquals(new BigDecimal("10.5000"), result.stockQuantity());

        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(existing);
    }

    @Test
    void delete_shouldDelete_whenExists() {
        when(repository.existsById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository, times(1)).existsById(1L);
        verify(repository, times(1)).deleteById(1L);
    }

    @Test
    void delete_shouldThrowException_whenNotExists() {
        when(repository.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> service.delete(99L));
        assertEquals("Raw material not found", ex.getMessage());

        verify(repository, times(1)).existsById(99L);
        verify(repository, never()).deleteById(anyLong());
    }
}