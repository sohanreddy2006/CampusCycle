package com.campuscycle.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ListingType {
    SELL("sell"),
    RENT("rent"),
    LEND("lend"),
    DONATE("donate");

    private final String value;

    ListingType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ListingType fromValue(String value) {
        for (ListingType type : values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid listing type: " + value);
    }
}
