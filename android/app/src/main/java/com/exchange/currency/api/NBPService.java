package com.exchange.currency.api;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Path;

public interface NBPService {
    @GET("exchangerates/rates/a/{currency}/")
    Call<ExchangeRateResponse> getExchangeRate(@Path("currency") String currency);
}
