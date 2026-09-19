package com.umg.examen.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.umg.examen.dto.request.LoginRequest;
import com.umg.examen.dto.request.RefreshTokenRequest;
import com.umg.examen.dto.response.ApiResponse;
import com.umg.examen.dto.response.AuthResponse;
import com.umg.examen.dto.response.UserResponse;
import com.umg.examen.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(
        name = "Autenticación",
        description = "Endpoints para inicio, renovación y cierre de sesión"
)
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica al usuario y retorna los tokens JWT"
    )
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse authResponse = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Inicio de sesión exitoso",
                        authResponse
                )
        );
    }

    @PostMapping("/refresh")
    @Operation(
            summary = "Renovar token",
            description = "Genera un nuevo token de acceso mediante el Refresh Token"
    )
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        AuthResponse authResponse =
                authService.refreshToken(request.getRefreshToken());

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Token renovado exitosamente",
                        authResponse
                )
        );
    }

    @PostMapping("/logout")
    @Operation(
            summary = "Cerrar sesión",
            description = "Sincroniza el cierre de sesión del frontend con el backend"
    )
    public ResponseEntity<ApiResponse<Void>> logout() {
        System.out.println(
                "[AUTH] Solicitud de cierre de sesión recibida por el backend."
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Sesión cerrada exitosamente",
                        null
                )
        );
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(
            summary = "Obtener usuario actual",
            description = "Retorna los datos del usuario autenticado mediante el token JWT"
    )
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(401)
                    .body(ApiResponse.error("No autenticado"));
        }

        UserResponse user =
                authService.getCurrentUser(authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Perfil de usuario obtenido",
                        user
                )
        );
    }
}