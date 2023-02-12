package com.alcol.userservice.repository;

import com.alcol.userservice.entity.UserEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<UserEntity, String>
{
    // select * from user_tb where userId=userId
    UserEntity findByUserId(String userId);
    // select * from user_tb where email=username
    UserEntity findByEmail(String username);
    // select * from user_tb where nickname=nickname
    UserEntity findByNickname(String nickname);
    // select * rom user_tb;
    List<UserEntity> findAll();
}
