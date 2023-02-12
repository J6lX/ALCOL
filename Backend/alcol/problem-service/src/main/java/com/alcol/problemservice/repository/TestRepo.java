package com.alcol.problemservice.repository;

import com.alcol.problemservice.entity.ProblemEntity;
import com.alcol.problemservice.entity.ProblemTierEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRepo extends JpaRepository{
    List<ProblemEntity> findAllByTier(String tier);
}
