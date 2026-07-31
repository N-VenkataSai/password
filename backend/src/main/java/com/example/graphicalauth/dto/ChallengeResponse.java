package com.example.graphicalauth.dto;

import com.example.graphicalauth.model.ImageItem;
import java.util.List;

public class ChallengeResponse {
    private String sessionId;
    private String username;
    private int currentStep; // 0..4
    private int totalSteps = 5;
    private List<ImageItem> gridImages;
    private boolean finished;
    private boolean success;
    private String message;

    public ChallengeResponse() {}

    public ChallengeResponse(String sessionId, String username, int currentStep, List<ImageItem> gridImages, boolean finished, boolean success, String message) {
        this.sessionId = sessionId;
        this.username = username;
        this.currentStep = currentStep;
        this.gridImages = gridImages;
        this.finished = finished;
        this.success = success;
        this.message = message;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public int getTotalSteps() {
        return totalSteps;
    }

    public void setTotalSteps(int totalSteps) {
        this.totalSteps = totalSteps;
    }

    public List<ImageItem> getGridImages() {
        return gridImages;
    }

    public void setGridImages(List<ImageItem> gridImages) {
        this.gridImages = gridImages;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
