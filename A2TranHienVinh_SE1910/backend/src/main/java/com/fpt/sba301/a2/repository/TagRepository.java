package com.fpt.sba301.a2.repository;

import com.fpt.sba301.a2.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
    List<Tag> findByTagNameContainingIgnoreCase(String name);

    @Query("SELECT COALESCE(MAX(t.tagID), 0) FROM Tag t")
    Integer findMaxTagId();
}
