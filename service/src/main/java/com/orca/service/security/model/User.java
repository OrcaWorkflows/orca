package com.orca.service.security.model;

import com.orca.service.security.dto.UserResponseDTO;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.*;


@Entity
@Getter
@Setter
@Table(name = "user", schema = "public")
@Log4j2
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Size(min = 4, max = 191, message = "Minimum username length: 4 characters")
    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true, nullable = false)
    @Size(max = 100)
    private String email;
    @Size(min = 8, max = 191, message = "Minimum password length: 8 characters")
    private String password;
    @Column(name = "organization_name")
    private String organizationName;
    @Column(name = "updated_at")
    private Date updatedAt;
    @Column(name = "created_at")
    private Date createdAt;

    public UserResponseDTO toDTO() {
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO.setEmail(getEmail());
        userResponseDTO.setUsername(getUsername());
        userResponseDTO.setCreatedAt(getCreatedAt());
        userResponseDTO.setUpdatedAt(getUpdatedAt());
        userResponseDTO.setOrganizationName(getOrganizationName());
        return userResponseDTO;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (!(obj instanceof User)) return false;
        User other = (User) obj;
        return Objects.equals(this.username, other.getUsername()) && Objects.equals(this.email, other.getEmail());

    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }

}