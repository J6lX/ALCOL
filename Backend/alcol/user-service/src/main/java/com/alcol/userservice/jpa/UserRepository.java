package com.alcol.userservice.jpa;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserEntity, String> {
    // select * from user_tb where email=username
    UserEntity findByEmail(String username);
}
