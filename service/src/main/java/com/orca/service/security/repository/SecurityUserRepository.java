package com.orca.service.security.repository;

import com.orca.service.security.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecurityUserRepository extends JpaRepository<User, Integer> {

    /**
     * Insecure method, in terms of group membership, to access user details
     * Should only be used in internal operations
     * @param username name of the user
     * @return User
     */
    User findByUsername(String username);


}
