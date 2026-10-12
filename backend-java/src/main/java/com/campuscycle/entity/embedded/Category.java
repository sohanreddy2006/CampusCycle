package com.campuscycle.entity.embedded;

import java.util.ArrayList;
import java.util.List;

public class Category {

    private String name;
    private String slug;
    private List<Item> items = new ArrayList<>();

    public Category() {
    }

    public Category(String name, String slug, List<Item> items) {
        this.name = name;
        this.slug = slug;
        this.items = items;
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

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
}
