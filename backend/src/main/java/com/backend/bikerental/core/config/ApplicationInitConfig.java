package com.backend.bikerental.core.config;

import com.backend.bikerental.module.user.Role;
import com.backend.bikerental.module.user.User;
import com.backend.bikerental.module.user.enums.RoleEnum;
import com.backend.bikerental.module.user.RoleRepository;
import com.backend.bikerental.module.user.UserRepository;
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
