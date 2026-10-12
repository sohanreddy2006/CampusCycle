package com.campuscycle.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ListingStatus {
    AVAILABLE("available"),
    RESERVED("reserved"),
    SOLD("sold"),
    RENTED("rented"),
    BORROWED("borrowed"),
    DONATED("donated"),
    UNAVAILABLE("unavailable");

    private final String value;

    ListingStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ListingStatus fromValue(String value) {
        for (ListingStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid listing status: " + value);
    }
}
