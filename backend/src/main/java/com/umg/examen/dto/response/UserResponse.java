package com.umg.examen.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "Datos de respuesta de un usuario")
public class UserResponse {

    @Schema(description = "ID del usuario", example = "1")
    private Long id;

    @Schema(description = "Nombre de usuario", example = "admin")
    private String username;

    @Schema(description = "Nombre completo", example = "Administrador del Sistema")
    private String fullName;

    @Schema(description = "Correo electrónico", example = "admin@umg.edu.gt")
    private String email;

    @Schema(description = "Estado de la cuenta", example = "true")
    private Boolean enabled;

    @Schema(description = "Roles del usuario")
    private List<String> roles;

    @Schema(description = "Fecha de registro")
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String username, String fullName, String email, Boolean enabled, List<String> roles, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.enabled = enabled;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
