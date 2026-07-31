package com.example.graphicalauth.service;

import com.example.graphicalauth.dto.ChallengeResponse;
import com.example.graphicalauth.model.ImageItem;
import com.example.graphicalauth.model.User;
import com.example.graphicalauth.model.UserPasswordSequence;
import com.example.graphicalauth.repository.ImageItemRepository;
import com.example.graphicalauth.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ImageItemRepository imageItemRepository;

    // In-memory session store
    private final Map<String, AuthSession> activeSessions = new ConcurrentHashMap<>();

    public AuthService(UserRepository userRepository, ImageItemRepository imageItemRepository) {
        this.userRepository = userRepository;
        this.imageItemRepository = imageItemRepository;
    }

    public static class AuthSession {
        private String sessionId;
        private User user;
        private int currentStep;
        private List<UserPasswordSequence> sequence;

        public AuthSession(String sessionId, User user, List<UserPasswordSequence> sequence) {
            this.sessionId = sessionId;
            this.user = user;
            this.sequence = sequence;
            this.currentStep = 0;
        }

        public String getSessionId() { return sessionId; }
        public User getUser() { return user; }
        public int getCurrentStep() { return currentStep; }
        public void setCurrentStep(int currentStep) { this.currentStep = currentStep; }
        public List<UserPasswordSequence> getSequence() { return sequence; }
    }

    public ChallengeResponse startChallenge(String username, int gridSize) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return new ChallengeResponse(null, username, 0, Collections.emptyList(), true, false, "User not found");
        }

        User user = userOpt.get();
        List<UserPasswordSequence> sequence = user.getPasswordSequence();
        if (sequence == null || sequence.size() < 5) {
            return new ChallengeResponse(null, username, 0, Collections.emptyList(), true, false, "User does not have a 5-image password sequence configured.");
        }

        String sessionId = UUID.randomUUID().toString();
        AuthSession session = new AuthSession(sessionId, user, sequence);
        activeSessions.put(sessionId, session);

        return generateChallengeForStep(session, 0, gridSize);
    }

    public ChallengeResponse verifyStep(String sessionId, Long selectedImageId, int step, int gridSize) {
        AuthSession session = activeSessions.get(sessionId);
        if (session == null) {
            return new ChallengeResponse(sessionId, null, step, Collections.emptyList(), true, false, "Invalid or expired authentication session");
        }

        List<UserPasswordSequence> sequence = session.getSequence();
        if (step < 0 || step >= sequence.size()) {
            activeSessions.remove(sessionId);
            return new ChallengeResponse(sessionId, session.getUser().getUsername(), step, Collections.emptyList(), true, false, "Authentication Failed: Step out of bounds");
        }

        Long expectedImageId = sequence.get(step).getImageItem().getId();

        if (!expectedImageId.equals(selectedImageId)) {
            // Incorrect image selected -> Authentication Failed immediately!
            activeSessions.remove(sessionId);
            return new ChallengeResponse(sessionId, session.getUser().getUsername(), step, Collections.emptyList(), true, false, "Authentication Failed: Incorrect image selected.");
        }

        int nextStep = step + 1;
        if (nextStep >= 5) {
            // All 5 steps completed successfully!
            activeSessions.remove(sessionId);
            return new ChallengeResponse(sessionId, session.getUser().getUsername(), 5, Collections.emptyList(), true, true, "Login Successful! Graphical password sequence verified.");
        }

        // Advance to next step
        session.setCurrentStep(nextStep);
        return generateChallengeForStep(session, nextStep, gridSize);
    }

    private ChallengeResponse generateChallengeForStep(AuthSession session, int step, int gridSize) {
        ImageItem targetImage = session.getSequence().get(step).getImageItem();

        // Fetch all available images
        List<ImageItem> allImages = imageItemRepository.findAll();

        // Filter out target image to get candidate decoys
        List<ImageItem> candidateDecoys = allImages.stream()
                .filter(img -> !img.getId().equals(targetImage.getId()))
                .collect(Collectors.toList());

        Collections.shuffle(candidateDecoys);

        int decoyCount = Math.max(8, gridSize - 1);
        List<ImageItem> selectedDecoys = candidateDecoys.stream()
                .limit(decoyCount)
                .collect(Collectors.toList());

        List<ImageItem> challengeGrid = new ArrayList<>(selectedDecoys);
        challengeGrid.add(targetImage);
        Collections.shuffle(challengeGrid);

        String message = String.format("Step %d of 5: Challenge loaded.", step + 1);
        return new ChallengeResponse(session.getSessionId(), session.getUser().getUsername(), step, challengeGrid, false, true, message);
    }
}
