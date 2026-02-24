package com.projedata.autoflex.web.controller;

import com.projedata.autoflex.domain.dto.ProductionSuggestionDTO;
import com.projedata.autoflex.domain.service.ProductionSuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/production-suggestions")
@RequiredArgsConstructor
public class ProductionSuggestionController {

    private final ProductionSuggestionService service;

    @GetMapping
    public List<ProductionSuggestionDTO> calculate() {
        return service.calculate();
    }
}