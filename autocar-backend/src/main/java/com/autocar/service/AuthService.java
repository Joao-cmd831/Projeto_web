package com.autocar.service;

import com.autocar.dto.AuthDTO.*;
import com.autocar.model.Usuario;
import com.autocar.repository.UsuarioRepository;
import com.autocar.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest req) {
        Usuario u = usuarioRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!encoder.matches(req.getSenha(), u.getSenha()))
            throw new RuntimeException("Email ou senha inválidos");

        if (!u.getAtivo())
            throw new RuntimeException("Conta desativada");

        String token = jwtUtil.generateToken(u.getEmail(), u.getId(), u.getRole().name());
        return new AuthResponse(token, u.getId(), u.getNome(), u.getEmail(), u.getRole().name());
    }

    public AuthResponse register(RegisterRequest req) {
        if (usuarioRepo.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email já cadastrado");

        if (req.getCpf() != null && !req.getCpf().isBlank() && usuarioRepo.existsByCpf(req.getCpf()))
            throw new RuntimeException("CPF já cadastrado");

        Usuario u = Usuario.builder()
                .nome(req.getNome())
                .email(req.getEmail())
                .senha(encoder.encode(req.getSenha()))
                .telefone(req.getTelefone())
                .cpf(req.getCpf())
                .endereco(req.getEndereco())
                .cidade(req.getCidade())
                .estado(req.getEstado())
                .cep(req.getCep())
                .build();

        usuarioRepo.save(u);
        String token = jwtUtil.generateToken(u.getEmail(), u.getId(), u.getRole().name());
        return new AuthResponse(token, u.getId(), u.getNome(), u.getEmail(), u.getRole().name());
    }
}
