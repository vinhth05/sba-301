package com.fpt.sba301.slot15.repository;

import com.fpt.sba301.slot15.model.News;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    Slice<News> findByActive(boolean active, Pageable pageable);
}
