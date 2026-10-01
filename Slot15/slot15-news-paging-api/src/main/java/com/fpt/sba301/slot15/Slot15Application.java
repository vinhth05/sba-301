package com.fpt.sba301.slot15;

import com.fpt.sba301.slot15.model.News;
import com.fpt.sba301.slot15.repository.NewsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class Slot15Application {

    public static void main(String[] args) {
        SpringApplication.run(Slot15Application.class, args);
    }

    @Bean
    CommandLineRunner seed(NewsRepository repo) {
        return args -> {
            for (int i = 1; i <= 35; i++) {
                News n = new News();
                n.setTitle("News Article #" + i + " - Spring Boot Updates");
                n.setPublishDate(LocalDate.now().minusDays(i));
                n.setActive(i % 4 != 0);
                repo.save(n);
            }
        };
    }
}
