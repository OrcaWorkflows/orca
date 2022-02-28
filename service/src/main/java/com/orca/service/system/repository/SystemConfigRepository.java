package com.orca.service.system.repository;

import com.orca.service.system.model.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Integer> {
    List<SystemConfig> findAllByUserId(Integer userId);
}
