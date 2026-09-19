package com.umg.examen.service.impl;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.umg.examen.dto.request.LoginRequest;
import com.umg.examen.dto.response.AuthResponse;
import com.umg.examen.dto.response.UserResponse;
import com.umg.examen.entity.User;
import com.umg.examen.mapper.UserMapper;
import com.umg.examen.repository.UserRepository;
import com.umg.examen.security.JwtTokenProvider;
import com.umg.examen.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository,
            UserMapper userMapper
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        String accessToken =
                tokenProvider.generateToken(authentication);

        String refreshToken =
                tokenProvider.generateRefreshToken(
                        request.getUsername()
                );

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuario no encontrado: "
                                        + request.getUsername()
                        )
                );

        AuthResponse response =
                userMapper.toAuthResponse(user, accessToken);

        response.setRefreshToken(refreshToken);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateRefreshToken(refreshToken)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token inválido o expirado"
            );
        }

        String username =
                tokenProvider.getUsernameFromJwt(refreshToken);

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuario no encontrado: " + username
                        )
                );

        AuthResponse response =
                userMapper.toAuthResponse(user, "");

        String newAccessToken =
                tokenProvider.generateTokenFromUsername(
                        username,
                        response.getRoles()
                );

        response.setToken(newAccessToken);
        response.setRefreshToken(refreshToken);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String username) {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Usuario no encontrado: " + username
                        )
                );

        return userMapper.toResponse(user);
    }
}