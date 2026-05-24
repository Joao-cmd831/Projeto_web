package com.autocar.controller;

import com.autocar.dto.AuthDTO.UpdateRequest;
import com.autocar.model.Usuario;
import com.autocar.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;

    @GetMapping("/perfil")
    public ResponseEntity<Usuario> perfil(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/perfil")
    public ResponseEntity<?> atualizar(@AuthenticationPrincipal Usuario usuario,
                                       @RequestBody UpdateRequest req) {
        if (req.getNome() != null)      usuario.setNome(req.getNome());
        if (req.getTelefone() != null)  usuario.setTelefone(req.getTelefone());
        if (req.getEndereco() != null)  usuario.setEndereco(req.getEndereco());
        if (req.getCidade() != null)    usuario.setCidade(req.getCidade());
        if (req.getEstado() != null)    usuario.setEstado(req.getEstado());
        if (req.getCep() != null)       usuario.setCep(req.getCep());

        if (req.getNovaSenha() != null && !req.getNovaSenha().isBlank()) {
            if (!encoder.matches(req.getSenhaAtual(), usuario.getSenha()))
                return ResponseEntity.badRequest().body(Map.of("error", "Senha atual incorreta"));
            usuario.setSenha(encoder.encode(req.getNovaSenha()));
        }

        usuarioRepo.save(usuario);
        return ResponseEntity.ok(Map.of("message", "Perfil atualizado com sucesso"));
    }
}
