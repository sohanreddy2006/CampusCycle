package com.campuscycle.entity.embedded;

import java.util.ArrayList;
import java.util.List;

public class Item {

    private String name;
    private String slug;
    private List<String> defaultTags = new ArrayList<>();

    public Item() {
    }

    public Item(String name, String slug, List<String> defaultTags) {
        this.name = name;
        this.slug = slug;
        this.defaultTags = defaultTags;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public List<String> getDefaultTags() {
        return defaultTags;
    }

    public void setDefaultTags(List<String> defaultTags) {
        this.defaultTags = defaultTags;
    }
}
