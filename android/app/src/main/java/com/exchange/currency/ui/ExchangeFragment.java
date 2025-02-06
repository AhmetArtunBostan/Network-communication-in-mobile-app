package com.exchange.currency.ui;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.exchange.currency.R;
import com.exchange.currency.api.ExchangeRateResponse;
import com.exchange.currency.api.RetrofitClient;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ExchangeFragment extends Fragment {
    private TextInputEditText amountInput;
    private Spinner fromCurrencySpinner;
    private Spinner toCurrencySpinner;
    private MaterialButton exchangeButton;
    private TextView resultText;

    private String[] currencies = {"USD", "EUR", "PLN"};

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_exchange, container, false);

        amountInput = view.findViewById(R.id.amountInput);
        fromCurrencySpinner = view.findViewById(R.id.fromCurrencySpinner);
        toCurrencySpinner = view.findViewById(R.id.toCurrencySpinner);
        exchangeButton = view.findViewById(R.id.exchangeButton);
        resultText = view.findViewById(R.id.resultText);

        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(),
                android.R.layout.simple_spinner_item, currencies);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);

        fromCurrencySpinner.setAdapter(adapter);
        toCurrencySpinner.setAdapter(adapter);

        exchangeButton.setOnClickListener(v -> performExchange());

        return view;
    }

    private void performExchange() {
        try {
            double amount = Double.parseDouble(amountInput.getText().toString());
            String fromCurrency = currencies[fromCurrencySpinner.getSelectedItemPosition()];
            String toCurrency = currencies[toCurrencySpinner.getSelectedItemPosition()];

            if (fromCurrency.equals(toCurrency)) {
                resultText.setText(String.format("%.2f %s = %.2f %s", 
                    amount, fromCurrency, amount, toCurrency));
                return;
            }

            // Get exchange rate from NBP API
            RetrofitClient.getNBPService().getExchangeRate(fromCurrency.toLowerCase())
                .enqueue(new Callback<ExchangeRateResponse>() {
                    @Override
                    public void onResponse(Call<ExchangeRateResponse> call, Response<ExchangeRateResponse> response) {
                        if (response.isSuccessful() && response.body() != null && !response.body().getRates().isEmpty()) {
                            double fromRate = response.body().getRates().get(0).getMid();
                            
                            // Get second exchange rate
                            RetrofitClient.getNBPService().getExchangeRate(toCurrency.toLowerCase())
                                .enqueue(new Callback<ExchangeRateResponse>() {
                                    @Override
                                    public void onResponse(Call<ExchangeRateResponse> call, Response<ExchangeRateResponse> response) {
                                        if (response.isSuccessful() && response.body() != null && !response.body().getRates().isEmpty()) {
                                            double toRate = response.body().getRates().get(0).getMid();
                                            double result = amount * (toRate / fromRate);
                                            
                                            resultText.setText(String.format("%.2f %s = %.2f %s", 
                                                amount, fromCurrency, result, toCurrency));
                                        } else {
                                            showError();
                                        }
                                    }

                                    @Override
                                    public void onFailure(Call<ExchangeRateResponse> call, Throwable t) {
                                        showError();
                                    }
                                });
                        } else {
                            showError();
                        }
                    }

                    @Override
                    public void onFailure(Call<ExchangeRateResponse> call, Throwable t) {
                        showError();
                    }
                });
        } catch (NumberFormatException e) {
            Toast.makeText(requireContext(), "Please enter a valid amount", Toast.LENGTH_SHORT).show();
        }
    }

    private void showError() {
        Toast.makeText(requireContext(), "Error fetching exchange rates", Toast.LENGTH_SHORT).show();
    }
}
