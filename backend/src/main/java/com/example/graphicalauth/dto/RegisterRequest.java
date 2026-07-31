package com.example.graphicalauth.dto;

import java.util.List;

public class RegisterRequest {
    private String username;
    private List<Long> imageIds;

    public RegisterRequest() {}

    public RegisterRequest(String username, List<Long> imageIds) {
        this.username = username;
        this.imageIds = imageIds;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Long> getImageIds() {
        return imageIds;
    }

    public void setImageIds(List<Long> imageIds) {
        this.imageIds = imageIds;
    }
}
