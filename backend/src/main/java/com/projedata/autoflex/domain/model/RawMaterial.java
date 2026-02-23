package com.projedata.autoflex.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "raw_materials", uniqueConstraints = {
        @UniqueConstraint(name = "uk_raw_materials_code", columnNames = "code")
})
public class RawMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String code;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "stock_quantity", nullable = false, precision = 19, scale = 4)
    private BigDecimal stockQuantity;

    @OneToMany(mappedBy = "rawMaterial", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ProductRawMaterial> usedInProducts = new HashSet<>();
}
