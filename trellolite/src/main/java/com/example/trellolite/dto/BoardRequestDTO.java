package com.example.trellolite.dto;

import jakarta.validation.constraints.NotBlank;

public class BoardRequestDTO {
    @NotBlank(message = "Board name is required")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
