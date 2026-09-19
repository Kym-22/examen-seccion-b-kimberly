package com.umg.examen.security;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

    private static final Logger log =
            LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms:60000}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration-ms:604800000}")
    private long refreshExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal =
                (UserDetails) authentication.getPrincipal();

        List<String> roles = userPrincipal.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return generateTokenFromUsername(
                userPrincipal.getUsername(),
                roles
        );
    }

    public String generateTokenFromUsername(
            String username,
            List<String> roles
    ) {
        Date now = new Date();
        Date expiryDate =
                new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .claim("tokenType", "access")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(String username) {
        Date now = new Date();
        Date expiryDate =
                new Date(now.getTime() + refreshExpirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("tokenType", "refresh")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromJwt(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            getClaims(authToken);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("Firma JWT inválida: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Token JWT expirado: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Token JWT no soportado: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error(
                    "La cadena de claims JWT está vacía: {}",
                    e.getMessage()
            );
        }

        return false;
    }

    public boolean validateRefreshToken(String token) {
        try {
            Claims claims = getClaims(token);
            String tokenType =
                    claims.get("tokenType", String.class);

            return "refresh".equals(tokenType);
        } catch (JwtException | IllegalArgumentException e) {
            log.error(
                    "Refresh token inválido o expirado: {}",
                    e.getMessage()
            );
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}