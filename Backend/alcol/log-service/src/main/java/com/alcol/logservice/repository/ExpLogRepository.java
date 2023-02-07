package com.alcol.logservice.repository;

import com.alcol.logservice.entity.ExpLogEntity;
import org.springframework.data.repository.CrudRepository;

public interface ExpLogRepository extends CrudRepository<ExpLogEntity, Long>
{
    //    # 사용자 현재 경험치 가져오기
//    select *
//    from exp_log_tb
//    where user_id=?
//    order by exp_log_no desc
//    limit 1;
    ExpLogEntity findTopByUserIdOrderByExpLogNoDesc(String userId);
}
