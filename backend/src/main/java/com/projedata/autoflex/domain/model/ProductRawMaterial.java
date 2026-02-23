package com.projedata.autoflex.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "product_raw_materials", uniqueConstraints = @UniqueConstraint(
        name = "uk_product_raw_materials_product_raw",
        columnNames = {
                "product_id",
                "raw_material_id"
        }
))
public class ProductRawMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
            name = "product_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_prm_product"))
    private Product product;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_prm_raw_material"))
    private RawMaterial rawMaterial;

    @Column(name = "required_quantity", nullable = false, precision = 19, scale = 4)
    private BigDecimal requiredQuantity;

}
