package com.exchange.currency.api;

import com.exchange.currency.model.ExchangeRate;
import com.exchange.currency.model.LoginRequest;
import com.exchange.currency.model.LoginResponse;
import com.exchange.currency.model.RegisterRequest;
import com.exchange.currency.model.Transaction;
import com.exchange.currency.model.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @POST("auth/login")
    Call<LoginResponse> login(@Body LoginRequest loginRequest);

    @POST("auth/register")
    Call<User> register(@Body RegisterRequest registerRequest);

    @GET("rates/current")
    Call<List<ExchangeRate>> getCurrentRates();

    @GET("rates/historical/{date}")
    Call<List<ExchangeRate>> getHistoricalRates(@Path("date") String date);

    @GET("transactions")
    Call<List<Transaction>> getTransactions();

    @POST("transactions")
    Call<Transaction> createTransaction(@Body Transaction transaction);

    @GET("account/balance")
    Call<Map<String, BigDecimal>> getBalance();

    @POST("account/fund")
    Call<Void> fundAccount(@Body Map<String, BigDecimal> fundRequest);
}
