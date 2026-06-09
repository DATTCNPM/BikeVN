package com.backend.bikerental.config;

import com.backend.bikerental.entity.Role;
import com.backend.bikerental.entity.User;
import com.backend.bikerental.enums.RoleEnum;
import com.backend.bikerental.repository.RoleRepository;
import com.backend.bikerental.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;
    UserRepository userRepository;
    RoleRepository roleRepository;

    @Bean
    ApplicationRunner applicationRunner()
    {
        return args -> {
            if(roleRepository.findByName(RoleEnum.admin.name()).isEmpty())
            {
                roleRepository.save(
                        Role.builder()
                                .name(RoleEnum.admin.name())
                                .description("Admin role")
                                .build()
                );
            }
            if(userRepository.findByEmail("admin@gmail.com").isEmpty())
            {
                var adminRole = roleRepository.findByName(RoleEnum.admin.name()).orElseThrow();

                User user = User.builder()
                        .name("admin")
                        .email("admin@gmail.com")
                        .passwordHash(passwordEncoder.encode("admin"))
                        .roles(Set.of(adminRole))
                        .branch(null)
                        .build();
                userRepository.save(user);
                System.out.println("ADMIN CREATED!");
            }
        };
    }
}
