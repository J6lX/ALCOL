package com.alcol.userservice.repository;

import com.alcol.userservice.entity.UserTierEntity;
import org.springframework.data.repository.CrudRepository;

public interface UserTierRepository extends CrudRepository<UserTierEntity, String>
{
    //    # 사용자 현재 티어 가져오기
//    select *
//    from user_tier_tb
//    where min_mmr <= 30 and max_mmr >= 30;
    UserTierEntity findByMinMmrLessThanEqualAndMaxMmrGreaterThanEqual(int mmr1, int mmr2);
}
