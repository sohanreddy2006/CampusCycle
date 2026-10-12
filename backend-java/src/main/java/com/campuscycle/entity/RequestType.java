package com.campuscycle.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RequestType {
    BUY("buy"),
    RENT("rent"),
    BORROW("borrow");

    private final String value;

    RequestType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static RequestType fromValue(String value) {
        for (RequestType type : values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid request type: " + value);
    }
}
