package com.alcol.logservice.service;

import java.util.List;

public interface LogService
{
    List<String> getLevelAndTier(String userId);
}
