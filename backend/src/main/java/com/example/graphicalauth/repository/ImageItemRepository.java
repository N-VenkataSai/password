package com.example.graphicalauth.repository;

import com.example.graphicalauth.model.ImageItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageItemRepository extends JpaRepository<ImageItem, Long> {
    List<ImageItem> findByCategory(String category);
}
