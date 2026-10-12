package com.campuscycle.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RequestStatus {
    ACTIVE("active"),
    MATCHED("matched"),
    FULFILLED("fulfilled"),
    EXPIRED("expired"),
    CANCELLED("cancelled");

    private final String value;

    RequestStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static RequestStatus fromValue(String value) {
        for (RequestStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid request status: " + value);
    }
}
