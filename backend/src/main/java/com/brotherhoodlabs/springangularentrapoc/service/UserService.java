package com.brotherhoodlabs.springangularentrapoc.service;

import com.brotherhoodlabs.springangularentrapoc.dto.RegisterRequest;
import com.brotherhoodlabs.springangularentrapoc.entity.User;
import com.brotherhoodlabs.springangularentrapoc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerLocalUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName());
        user.setProvider(User.Provider.LOCAL);

        return userRepository.save(user);
    }

    public User upsertMicrosoftUser(String email, String displayName, String sub, String tid) {
        Optional<User> existingUser = userRepository.findByEmailAndProvider(email, User.Provider.MICROSOFT);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setDisplayName(displayName);
            return userRepository.save(user);
        } else {
            User user = new User();
            user.setEmail(email);
            user.setDisplayName(displayName);
            user.setProvider(User.Provider.MICROSOFT);
            return userRepository.save(user);
        }
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByEmailAndProvider(String email, User.Provider provider) {
        return userRepository.findByEmailAndProvider(email, provider);
    }
}
