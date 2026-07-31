package com.example.graphicalauth.controller;

import com.example.graphicalauth.dto.AuthStartRequest;
import com.example.graphicalauth.dto.AuthStepRequest;
import com.example.graphicalauth.dto.ChallengeResponse;
import com.example.graphicalauth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/start")
    public ResponseEntity<ChallengeResponse> startAuth(@RequestBody AuthStartRequest request) {
        int gridSize = request.getGridSize() > 0 ? request.getGridSize() : 9;
        ChallengeResponse challenge = authService.startChallenge(request.getUsername(), gridSize);
        return ResponseEntity.ok(challenge);
    }

    @PostMapping("/verify-step")
    public ResponseEntity<ChallengeResponse> verifyStep(@RequestBody AuthStepRequest request) {
        int gridSize = request.getGridSize() > 0 ? request.getGridSize() : 9;
        ChallengeResponse response = authService.verifyStep(
                request.getSessionId(),
                request.getSelectedImageId(),
                request.getCurrentStep(),
                gridSize
        );
        return ResponseEntity.ok(response);
    }
}
