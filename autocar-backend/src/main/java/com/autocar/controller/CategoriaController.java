package com.autocar.controller;

import com.autocar.model.Categoria;
import com.autocar.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaRepository categoriaRepo;

    @GetMapping
    public List<Categoria> listar() {
        return categoriaRepo.findAll();
    }
}
