package com.example.graphicalauth.controller;

import com.example.graphicalauth.model.ImageItem;
import com.example.graphicalauth.repository.ImageItemRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {

    private final ImageItemRepository imageItemRepository;

    public ImageController(ImageItemRepository imageItemRepository) {
        this.imageItemRepository = imageItemRepository;
    }

    @GetMapping
    public ResponseEntity<List<ImageItem>> getAllImages() {
        return ResponseEntity.ok(imageItemRepository.findAll());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ImageItem>> getImagesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(imageItemRepository.findByCategory(category));
    }

    @PostMapping
    public ResponseEntity<?> addImage(@RequestBody ImageItem imageItem) {
        if (imageItem.getName() == null || imageItem.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Image name is required"));
        }
        if (imageItem.getUrl() == null || imageItem.getUrl().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Image URL is required"));
        }
        if (imageItem.getCategory() == null || imageItem.getCategory().trim().isEmpty()) {
            imageItem.setCategory("Uncategorized");
        }

        ImageItem saved = imageItemRepository.save(imageItem);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id) {
        Optional<ImageItem> opt = imageItemRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        imageItemRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Image removed successfully"));
    }
}
