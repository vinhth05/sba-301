package com.fpt.sba301.slot15.model;

import java.time.LocalDate;

public record NewsV2(
    Long id,
    String title,
    LocalDate publishDate,
    boolean active
) { }
