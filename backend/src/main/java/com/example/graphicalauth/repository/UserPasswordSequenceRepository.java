package com.example.graphicalauth.repository;

import com.example.graphicalauth.model.UserPasswordSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserPasswordSequenceRepository extends JpaRepository<UserPasswordSequence, Long> {
    List<UserPasswordSequence> findByUserIdOrderBySequenceOrderAsc(Long userId);
}
