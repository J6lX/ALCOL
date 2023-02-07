package com.alcol.problemservice.repository;

import com.alcol.problemservice.entity.ProblemEntity;
import org.springframework.data.repository.CrudRepository;

public interface ProblemRepository extends CrudRepository<ProblemEntity, Long>
{
    ProblemEntity findByProbNo(Long probNo);
}
