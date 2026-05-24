package com.autocar.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class LoginRequest {
        @Email @NotBlank
        private String email;
        @NotBlank @Size(min = 6)
        private String senha;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank @Size(min = 2, max = 100)
        private String nome;
        @Email @NotBlank
        private String email;
        @NotBlank @Size(min = 6)
        private String senha;
        private String telefone;
        private String cpf;
        private String endereco;
        private String cidade;
        private String estado;
        private String cep;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String nome;
        private String email;
        private String role;

        public AuthResponse(String token, Long userId, String nome, String email, String role) {
            this.token = token;
            this.userId = userId;
            this.nome = nome;
            this.email = email;
            this.role = role;
        }
    }

    @Data
    public static class UpdateRequest {
        private String nome;
        private String telefone;
        private String endereco;
        private String cidade;
        private String estado;
        private String cep;
        private String senhaAtual;
        private String novaSenha;
    }
}
