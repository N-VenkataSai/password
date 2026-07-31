package com.example.graphicalauth.controller;

import com.example.graphicalauth.dto.RegisterRequest;
import com.example.graphicalauth.model.ImageItem;
import com.example.graphicalauth.model.User;
import com.example.graphicalauth.model.UserPasswordSequence;
import com.example.graphicalauth.repository.ImageItemRepository;
import com.example.graphicalauth.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final ImageItemRepository imageItemRepository;

    public UserController(UserRepository userRepository, ImageItemRepository imageItemRepository) {
        this.userRepository = userRepository;
        this.imageItemRepository = imageItemRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/check/{username}")
    public ResponseEntity<Map<String, Boolean>> checkUsername(@PathVariable String username) {
        boolean exists = userRepository.existsByUsername(username);
        Map<String, Boolean> res = new HashMap<>();
        res.put("available", !exists);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is required"));
        }

        String username = request.getUsername().trim();
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }

        if (request.getImageIds() == null || request.getImageIds().size() != 5) {
            return ResponseEntity.badRequest().body(Map.of("message", "Exactly 5 images must be selected in sequence"));
        }

        User user = new User(username);
        List<UserPasswordSequence> sequenceList = new ArrayList<>();

        for (int i = 0; i < request.getImageIds().size(); i++) {
            Long imgId = request.getImageIds().get(i);
            Optional<ImageItem> imgOpt = imageItemRepository.findById(imgId);
            if (imgOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid image ID: " + imgId));
            }
            UserPasswordSequence seqItem = new UserPasswordSequence(user, imgOpt.get(), i);
            sequenceList.add(seqItem);
        }

        user.setPasswordSequence(sequenceList);
        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "User registered successfully",
            "userId", savedUser.getId(),
            "username", savedUser.getUsername()
        ));
    }
}
