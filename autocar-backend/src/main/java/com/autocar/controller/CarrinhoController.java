package com.autocar.controller;

import com.autocar.dto.CarrinhoDTO;
import com.autocar.model.Carrinho;
import com.autocar.model.CarrinhoItem;
import com.autocar.model.Produto;
import com.autocar.model.Usuario;
import com.autocar.repository.CarrinhoRepository;
import com.autocar.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/carrinho")
@RequiredArgsConstructor
public class CarrinhoController {

    private final CarrinhoRepository carrinhoRepo;
    private final ProdutoRepository produtoRepo;

    private Carrinho getOrCreate(Usuario usuario) {
        return carrinhoRepo.findByUsuarioId(usuario.getId())
                .orElseGet(() -> carrinhoRepo.save(
                        Carrinho.builder().usuario(usuario).build()
                ));
    }

    @GetMapping
    public ResponseEntity<CarrinhoDTO> listar(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(CarrinhoDTO.from(getOrCreate(usuario)));
    }

    @PostMapping("/adicionar/{produtoId}")
    public ResponseEntity<?> adicionar(@AuthenticationPrincipal Usuario usuario,
                                       @PathVariable Long produtoId,
                                       @RequestParam(defaultValue = "1") Integer quantidade) {
        Produto produto = produtoRepo.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        Carrinho carrinho = getOrCreate(usuario);
        carrinho.getItens().stream()
                .filter(i -> i.getProduto().getId().equals(produtoId))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantidade(item.getQuantidade() + quantidade),
                        () -> carrinho.getItens().add(CarrinhoItem.builder()
                                .carrinho(carrinho).produto(produto).quantidade(quantidade).build())
                );
        carrinhoRepo.save(carrinho);
        return ResponseEntity.ok(Map.of("message", "Produto adicionado ao carrinho"));
    }

    @DeleteMapping("/remover/{produtoId}")
    public ResponseEntity<?> remover(@AuthenticationPrincipal Usuario usuario,
                                     @PathVariable Long produtoId) {
        Carrinho carrinho = getOrCreate(usuario);
        carrinho.getItens().removeIf(i -> i.getProduto().getId().equals(produtoId));
        carrinhoRepo.save(carrinho);
        return ResponseEntity.ok(Map.of("message", "Item removido"));
    }

    @DeleteMapping("/limpar")
    public ResponseEntity<?> limpar(@AuthenticationPrincipal Usuario usuario) {
        Carrinho carrinho = getOrCreate(usuario);
        carrinho.getItens().clear();
        carrinhoRepo.save(carrinho);
        return ResponseEntity.ok(Map.of("message", "Carrinho limpo"));
    }

    @PutMapping("/atualizar/{produtoId}")
    public ResponseEntity<?> atualizar(@AuthenticationPrincipal Usuario usuario,
                                       @PathVariable Long produtoId,
                                       @RequestParam Integer quantidade) {
        Carrinho carrinho = getOrCreate(usuario);
        carrinho.getItens().stream()
                .filter(i -> i.getProduto().getId().equals(produtoId))
                .findFirst()
                .ifPresent(item -> {
                    if (quantidade <= 0) carrinho.getItens().remove(item);
                    else item.setQuantidade(quantidade);
                });
        carrinhoRepo.save(carrinho);
        return ResponseEntity.ok(Map.of("message", "Carrinho atualizado"));
    }
}
