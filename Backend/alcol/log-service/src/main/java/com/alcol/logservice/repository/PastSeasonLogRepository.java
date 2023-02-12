package com.alcol.logservice.repository;

import com.alcol.logservice.entity.PastSeasonLogEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface PastSeasonLogRepository extends CrudRepository<PastSeasonLogEntity, Long>
{
    List<PastSeasonLogEntity> findAllByUserIdOrderByPastSeasonLogNoDesc(String userId);
}
