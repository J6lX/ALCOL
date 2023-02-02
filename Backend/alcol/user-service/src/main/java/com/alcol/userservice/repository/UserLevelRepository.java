package com.alcol.userservice.repository;

import com.alcol.userservice.entity.UserLevelEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserLevelRepository extends CrudRepository<UserLevelEntity, Integer>
{
    //    # 사용자 현재 레벨 가져오기
//    select *
//    from user_level_tb
//    where sum_exp <= 38
//    order by level desc
//    limit 1;
    UserLevelEntity findTopBySumExpLessThanEqualOrderByLevelDesc(int curExp);
}
