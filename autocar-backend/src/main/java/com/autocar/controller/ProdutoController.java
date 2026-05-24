package com.autocar.controller;

import com.autocar.model.Produto;
import com.autocar.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoRepository produtoRepo;

    @GetMapping
    public List<Produto> listar() {
        return produtoRepo.findByAtivoTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return produtoRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Produto> buscar(@RequestParam String q) {
        return produtoRepo.buscar(q);
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Produto> porCategoria(@PathVariable Long categoriaId) {
        return produtoRepo.findByCategoriaIdAndAtivoTrue(categoriaId);
    }
}
