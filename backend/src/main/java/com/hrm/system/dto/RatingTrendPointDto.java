package com.hrm.system.dto;

import java.time.LocalDateTime;

public class RatingTrendPointDto {
    private String period;
    private Double rating;
    private LocalDateTime appraisalDate;

    public RatingTrendPointDto() {}

    public RatingTrendPointDto(String period, Double rating, LocalDateTime appraisalDate) {
        this.period = period;
        this.rating = rating;
        this.appraisalDate = appraisalDate;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public LocalDateTime getAppraisalDate() {
        return appraisalDate;
    }

    public void setAppraisalDate(LocalDateTime appraisalDate) {
        this.appraisalDate = appraisalDate;
    }
}


