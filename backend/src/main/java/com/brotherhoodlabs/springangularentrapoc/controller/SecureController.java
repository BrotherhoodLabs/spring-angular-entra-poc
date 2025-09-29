package com.brotherhoodlabs.springangularentrapoc.controller;

import com.brotherhoodlabs.springangularentrapoc.entity.User;
import com.brotherhoodlabs.springangularentrapoc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class SecureController {

    @Autowired
    private UserService userService;

    @GetMapping("/secure-data")
    public ResponseEntity<Map<String, Object>> getSecureData(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt)) {
            return ResponseEntity.status(401).build();
        }

        Jwt jwt = (Jwt) authentication.getPrincipal();
        String email = jwt.getClaimAsString("email");
        
        if (email == null) {
            email = jwt.getClaimAsString("preferred_username");
        }

        User user = userService.findByEmail(email).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "This is secure data");
        response.put("timestamp", LocalDateTime.now());
        
        if (user != null) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("displayName", user.getDisplayName());
            userInfo.put("provider", user.getProvider());
            response.put("user", userInfo);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("secret", "This data is only accessible to authenticated users");
        data.put("permissions", new String[]{"read"});
        data.put("expiresAt", LocalDateTime.now().plusDays(1));
        response.put("data", data);

        return ResponseEntity.ok(response);
    }
}
