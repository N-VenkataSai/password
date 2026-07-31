package com.example.graphicalauth.dto;

public class AuthStepRequest {
    private String sessionId;
    private Long selectedImageId;
    private int currentStep;
    private int gridSize = 9;

    public AuthStepRequest() {}

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Long getSelectedImageId() {
        return selectedImageId;
    }

    public void setSelectedImageId(Long selectedImageId) {
        this.selectedImageId = selectedImageId;
    }

    public int getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(int currentStep) {
        this.currentStep = currentStep;
    }

    public int getGridSize() {
        return gridSize;
    }

    public void setGridSize(int gridSize) {
        this.gridSize = gridSize;
    }
}
