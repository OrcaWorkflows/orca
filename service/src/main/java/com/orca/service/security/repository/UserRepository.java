package com.orca.service.security.repository;

import com.orca.service.security.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository("appUserRepository")
public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    User findUserByUsername(String username);

    @Transactional
    void deleteUserByUsername(String username);

    <S extends User> S saveAndFlush(S s);

    @Override
    List<User> findAll();
}