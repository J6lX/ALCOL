package com.alcol.logservice.repository;

import com.alcol.logservice.entity.ProbTrialLogEntity;
import org.springframework.data.repository.CrudRepository;

public interface ProbTrialLogRepository extends CrudRepository<ProbTrialLogEntity, Long>
{
    //    # 사용자 현재 경험치 가져오기
//    select *
//    from prob_trial_log_tb
//    where user_id='8ce6ab3a-f437-4f74-a031-e90dd1c00f53'
//    order by prob_trial_log_no desc
//    limit 1;
    ProbTrialLogEntity findTopByUserIdOrderByProbTrialLogNoDesc(String userId);
}
