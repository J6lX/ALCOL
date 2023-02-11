package com.alcol.problemservice.repository;

import com.alcol.problemservice.entity.ProblemCategoryConnectEntity;
import com.alcol.problemservice.entity.ProblemCategoryEntity;
import com.alcol.problemservice.entity.ProblemEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ProblemRepository extends CrudRepository<ProblemEntity, Long>
{
    ProblemEntity findByProbNo(Long probNo);
}