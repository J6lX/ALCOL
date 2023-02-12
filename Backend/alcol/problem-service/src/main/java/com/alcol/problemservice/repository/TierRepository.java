package com.alcol.problemservice.repository;

import com.alcol.problemservice.entity.ProblemTierEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TierRepository extends JpaRepository<ProblemTierEntity, Long>
{
    ProblemTierEntity findByTier(String tier);
}
