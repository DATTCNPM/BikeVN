package com.backend.bikerental.entity;

import com.backend.bikerental.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    String id;

    String name;

    String email;

    @Column(name = "password_hash")
    String passwordHash;

    String phone;

    @Column(name = "cccd_number")
    String cccdNumber;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    Set<Role> roles = new HashSet<>();

}