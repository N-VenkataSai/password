package com.example.graphicalauth.dto;

public class AuthStartRequest {
    private String username;
    private int gridSize = 9; // Default 9 (3x3 grid)

    public AuthStartRequest() {}

    public AuthStartRequest(String username, int gridSize) {
        this.username = username;
        this.gridSize = gridSize;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getGridSize() {
        return gridSize;
    }

    public void setGridSize(int gridSize) {
        this.gridSize = gridSize;
    }
}
