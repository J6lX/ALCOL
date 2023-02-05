package com.alcol.logservice.service;

import com.alcol.logservice.dto.LogDto;

public interface LogService
{
    LogDto.UserPlayDto getLevelAndTier(String userId);
}
