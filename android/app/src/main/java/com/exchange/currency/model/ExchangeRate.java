package com.exchange.currency.model;

import com.google.gson.annotations.SerializedName;

public class ExchangeRate {
    @SerializedName("currency")
    private String currency;
    
    @SerializedName("code")
    private String code;
    
    @SerializedName("mid")
    private double rate;

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public double getRate() {
        return rate;
    }

    public void setRate(double rate) {
        this.rate = rate;
    }
}
