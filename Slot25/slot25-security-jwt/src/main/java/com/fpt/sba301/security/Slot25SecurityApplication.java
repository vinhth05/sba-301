package com.fpt.sba301.security;

import com.fpt.sba301.security.entity.AppUser;
import com.fpt.sba301.security.entity.Orchid;
import com.fpt.sba301.security.repository.AppUserRepository;
import com.fpt.sba301.security.repository.OrchidRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class Slot25SecurityApplication {

    public static void main(String[] args) {
        SpringApplication.run(Slot25SecurityApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(AppUserRepository userRepository,
                              OrchidRepository orchidRepository,
                              PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed default admin user if not exists
            if (!userRepository.existsByEmail("admin@example.com")) {
                AppUser admin = new AppUser();
                admin.setEmail("admin@example.com");
                admin.setPassword(passwordEncoder.encode("Admin@123456"));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
            }

            // Seed default normal user if not exists
            if (!userRepository.existsByEmail("user@example.com")) {
                AppUser user = new AppUser();
                user.setEmail("user@example.com");
                user.setPassword(passwordEncoder.encode("User@123456"));
                user.setRole("USER");
                user.setEnabled(true);
                userRepository.save(user);
            }

            // Seed initial orchids if table is empty
            if (orchidRepository.count() == 0) {
                Orchid o1 = new Orchid();
                o1.setOrchidName("Phalaenopsis Purple Star");
                o1.setIsNatural(true);
                o1.setIsAttractive(true);
                o1.setOrchidDescription("Vibrant purple orchid with delicate petals and long blooming cycle.");
                o1.setOrchidURL("https://images.unsplash.com/photo-1525310072745-f49212b5ac6d");
                orchidRepository.save(o1);

                Orchid o2 = new Orchid();
                o2.setOrchidName("Dendrobium White Cloud");
                o2.setIsNatural(true);
                o2.setIsAttractive(true);
                o2.setOrchidDescription("Pure white spray dendrobium native to tropical rainforests.");
                o2.setOrchidURL("https://images.unsplash.com/photo-1508615039623-a25605d2b022");
                orchidRepository.save(o2);

                Orchid o3 = new Orchid();
                o3.setOrchidName("Cattleya Golden Sun");
                o3.setIsNatural(false);
                o3.setIsAttractive(true);
                o3.setOrchidDescription("Hybrid yellow cattleya with fragrant large floral head.");
                o3.setOrchidURL("https://images.unsplash.com/photo-1563245372-f21724e3856d");
                orchidRepository.save(o3);
            }
        };
    }
}
