package com.campuscycle.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReservationStatus {
    ACTIVE("active"),
    EXPIRED("expired"),
    COMPLETED("completed");

    private final String value;

    ReservationStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ReservationStatus fromValue(String value) {
        for (ReservationStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid reservation status: " + value);
    }
}
