package com.alcol.logservice.service;

import com.alcol.logservice.TestDto;

import java.util.List;

public interface LogService
{
    List<TestDto> getLevelAndTier(String userId);
}
