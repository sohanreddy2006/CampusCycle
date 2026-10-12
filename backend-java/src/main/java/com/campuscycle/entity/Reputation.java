package com.campuscycle.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Reputation {

    private double rating = 0;
    private int totalRatings = 0;
    private int completedExchanges = 0;
    private int listings = 0;

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(int totalRatings) {
        this.totalRatings = totalRatings;
    }

    public int getCompletedExchanges() {
        return completedExchanges;
    }

    public void setCompletedExchanges(int completedExchanges) {
        this.completedExchanges = completedExchanges;
    }

    public int getListings() {
        return listings;
    }

    public void setListings(int listings) {
        this.listings = listings;
    }
}
