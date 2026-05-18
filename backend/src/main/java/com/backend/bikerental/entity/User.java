package com.backend.bikerental.entity;

import com.backend.bikerental.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(length = 36)
    private String id;

    private String name;

    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    private String phone;

    @Column(name = "cccd_number")
    private String cccdNumber;

    // TODO: Role relationship 
    /*
    @ManyToMany
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_name")
    )
    Set<Role> roles;
    */
}