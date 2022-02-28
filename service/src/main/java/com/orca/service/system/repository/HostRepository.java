package com.orca.service.system.repository;

import com.orca.service.system.model.Host;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostRepository extends JpaRepository<Host, Integer> {
    Optional<Host> findByHost(String host);
}
