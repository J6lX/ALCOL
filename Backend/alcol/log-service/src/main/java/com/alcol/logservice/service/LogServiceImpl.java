package com.alcol.logservice.service;

import com.alcol.logservice.entity.ProbTrialLogEntity;
import com.alcol.logservice.entity.UserLevelEntity;
import com.alcol.logservice.repository.ProbTrialLogRepository;
import com.alcol.logservice.repository.UserLevelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogServiceImpl implements LogService
{
    private final ProbTrialLogRepository probTrialLogRepository;
    private final UserLevelRepository userLevelRepository;

    public LogServiceImpl(
            ProbTrialLogRepository probTrialLogRepository,
            UserLevelRepository userLevelRepository
    )
    {
        this.probTrialLogRepository = probTrialLogRepository;
        this.userLevelRepository = userLevelRepository;
    }

    @Override
    public List<String> getLevelAndNickname(String userId)
    {
        ProbTrialLogEntity probTrialLogEntity =
                probTrialLogRepository.findTopByUserIdOrderByProbTrialLogNoDesc(userId);
        int curExp = probTrialLogEntity.getCurExp();

        UserLevelEntity userLevelEntity =
                userLevelRepository.findTopBySumExpLessThanOrderByLevelDesc(curExp);
        int level = userLevelEntity.getLevel();

        return null;
    }
}
