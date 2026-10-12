package com.campuscycle.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ListingCondition {
    NEW("new"),
    LIKE_NEW("like_new"),
    GOOD("good"),
    FAIR("fair"),
    POOR("poor");

    private final String value;

    ListingCondition(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ListingCondition fromValue(String value) {
        for (ListingCondition condition : values()) {
            if (condition.value.equalsIgnoreCase(value)) {
                return condition;
            }
        }
        throw new IllegalArgumentException("Invalid condition: " + value);
    }
}
