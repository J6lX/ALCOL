package com.alcol.logservice;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TestDto
{
    private String level;
    private String speedTier;
    private String optimizationTier;
}
