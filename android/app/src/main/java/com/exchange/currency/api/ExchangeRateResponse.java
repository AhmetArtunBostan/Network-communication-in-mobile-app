package com.exchange.currency.api;

import com.google.gson.annotations.SerializedName;
import java.util.List;

public class ExchangeRateResponse {
    @SerializedName("currency")
    private String currency;
    
    @SerializedName("code")
    private String code;
    
    @SerializedName("rates")
    private List<Rate> rates;

    public static class Rate {
        @SerializedName("no")
        private String number;
        
        @SerializedName("effectiveDate")
        private String effectiveDate;
        
        @SerializedName("mid")
        private double mid;

        public double getMid() {
            return mid;
        }
    }

    public List<Rate> getRates() {
        return rates;
    }
}
