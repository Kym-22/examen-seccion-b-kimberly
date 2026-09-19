package com.umg.examen.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "Respuesta de autenticación con Token JWT")
public class AuthResponse {

    @Schema(description = "Token de acceso JWT")
    private String token;

    @Schema(description = "Tipo de token", example = "Bearer")
    private String type = "Bearer";

    @Schema(description = "Nombre de usuario", example = "admin")
    private String username;

    @Schema(description = "Nombre completo del usuario", example = "Administrador del Sistema")
    private String fullName;

    @Schema(description = "Correo electrónico", example = "admin@umg.edu.gt")
    private String email;

    @Schema(description = "Lista de roles asignados", example = "[\"ROLE_ADMIN\"]")
    private List<String> roles;

    public AuthResponse() {}

    public AuthResponse(String token, String type, String username, String fullName, String email, List<String> roles) {
        this.token = token;
        this.type = type != null ? type : "Bearer";
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
