package com.example.graphicalauth.config;

import com.example.graphicalauth.model.ImageItem;
import com.example.graphicalauth.repository.ImageItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ImageItemRepository imageItemRepository;

    public DatabaseSeeder(ImageItemRepository imageItemRepository) {
        this.imageItemRepository = imageItemRepository;
    }

    @Override
    public void run(String... args) {
        if (imageItemRepository.count() == 0) {
            List<ImageItem> defaultImages = Arrays.asList(
                // Nature (6)
                new ImageItem("Sunset Mountain", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80", "Nature"),
                new ImageItem("Tropical Beach", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80", "Nature"),
                new ImageItem("Pine Forest", "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=80", "Nature"),
                new ImageItem("Waterfall Haven", "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=400&auto=format&fit=crop&q=80", "Nature"),
                new ImageItem("Desert Dunes", "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&auto=format&fit=crop&q=80", "Nature"),
                new ImageItem("Northern Lights", "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&auto=format&fit=crop&q=80", "Nature"),

                // Animals (6)
                new ImageItem("Majestic Tiger", "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&auto=format&fit=crop&q=80", "Animals"),
                new ImageItem("Golden Retriever", "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&auto=format&fit=crop&q=80", "Animals"),
                new ImageItem("Playful Cat", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80", "Animals"),
                new ImageItem("Bald Eagle", "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=400&auto=format&fit=crop&q=80", "Animals"),
                new ImageItem("Panda Bear", "https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?w=400&auto=format&fit=crop&q=80", "Animals"),
                new ImageItem("Dolphin Jump", "https://images.unsplash.com/photo-1570481662006-a3a1374699e8?w=400&auto=format&fit=crop&q=80", "Animals"),

                // Tech & Sci-Fi (6)
                new ImageItem("Sleek Laptop", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80", "Tech"),
                new ImageItem("Cyberpunk Neon", "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80", "Tech"),
                new ImageItem("Virtual Reality", "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&auto=format&fit=crop&q=80", "Tech"),
                new ImageItem("Circuit Board", "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80", "Tech"),
                new ImageItem("Futuristic Robot", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&auto=format&fit=crop&q=80", "Tech"),
                new ImageItem("Space Shuttle", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop&q=80", "Tech"),

                // Food & Beverage (6)
                new ImageItem("Artisanal Pizza", "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80", "Food"),
                new ImageItem("Gourmet Burger", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80", "Food"),
                new ImageItem("Fresh Espresso", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80", "Food"),
                new ImageItem("Berry Pancakes", "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop&q=80", "Food"),
                new ImageItem("Sushi Platter", "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&auto=format&fit=crop&q=80", "Food"),
                new ImageItem("Glazed Donuts", "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80", "Food"),

                // Objects & Hobbies (6)
                new ImageItem("Vintage Camera", "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80", "Objects"),
                new ImageItem("Electric Guitar", "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&auto=format&fit=crop&q=80", "Objects"),
                new ImageItem("Classic Automobile", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80", "Objects"),
                new ImageItem("Grand Piano", "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&auto=format&fit=crop&q=80", "Objects"),
                new ImageItem("Luxury Watch", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80", "Objects"),
                new ImageItem("Hot Air Balloon", "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=400&auto=format&fit=crop&q=80", "Objects"),

                // Architecture & Places (6)
                new ImageItem("Eiffel Tower", "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&auto=format&fit=crop&q=80", "Architecture"),
                new ImageItem("Taj Mahal", "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&auto=format&fit=crop&q=80", "Architecture"),
                new ImageItem("Golden Gate Bridge", "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&auto=format&fit=crop&q=80", "Architecture"),
                new ImageItem("Modern Skyscraper", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80", "Architecture"),
                new ImageItem("Ancient Colosseum", "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&auto=format&fit=crop&q=80", "Architecture"),
                new ImageItem("Kyoto Pagoda", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80", "Architecture")
            );
            imageItemRepository.saveAll(defaultImages);
            System.out.println(">>> DatabaseSeeder: Seeded " + defaultImages.size() + " image items into the library.");
        }
    }
}
