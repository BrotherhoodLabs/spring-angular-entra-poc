package com.brotherhoodlabs.springangularentrapoc.controller;

import com.brotherhoodlabs.springangularentrapoc.dto.RegisterRequest;
import com.brotherhoodlabs.springangularentrapoc.entity.User;
import com.brotherhoodlabs.springangularentrapoc.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerLocalUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (RuntimeException e) {
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        
        // Extract claims from Microsoft JWT
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        String sub = jwt.getClaimAsString("sub");
        String tid = jwt.getClaimAsString("tid");

        if (email == null) {
            email = jwt.getClaimAsString("preferred_username");
        }
        if (name == null) {
            name = jwt.getClaimAsString("given_name") + " " + jwt.getClaimAsString("family_name");
        }

        // Upsert user from Microsoft claims
        User user = userService.upsertMicrosoftUser(email, name, sub, tid);

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("displayName", user.getDisplayName());
        response.put("provider", user.getProvider());
        response.put("createdAt", user.getCreatedAt());
        
        // Add Microsoft claims
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", sub);
        claims.put("tid", tid);
        claims.put("name", name);
        claims.put("preferred_username", jwt.getClaimAsString("preferred_username"));
        response.put("claims", claims);

        return ResponseEntity.ok(response);
    }
}
