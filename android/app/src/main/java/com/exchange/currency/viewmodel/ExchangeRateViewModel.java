package com.exchange.currency.viewmodel;

import android.app.Application;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import com.exchange.currency.api.ApiService;
import com.exchange.currency.data.AppDatabase;
import com.exchange.currency.data.ExchangeRateEntity;
import java.util.List;

public class ExchangeRateViewModel extends AndroidViewModel {
    private final AppDatabase database;
    private final ApiService apiService;
    private final MutableLiveData<List<ExchangeRateEntity>> currentRates;
    
    public ExchangeRateViewModel(Application application) {
        super(application);
        database = AppDatabase.getDatabase(application);
        apiService = RetrofitClient.getInstance().create(ApiService.class);
        currentRates = new MutableLiveData<>();
        loadCurrentRates();
    }
    
    public LiveData<List<ExchangeRateEntity>> getCurrentRates() {
        return currentRates;
    }
    
    private void loadCurrentRates() {
        apiService.getCurrentRates().enqueue(new Callback<List<ExchangeRate>>() {
            @Override
            public void onResponse(Call<List<ExchangeRate>> call, Response<List<ExchangeRate>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<ExchangeRateEntity> entities = convertToEntities(response.body());
                    currentRates.setValue(entities);
                    saveRatesToDb(entities);
                }
            }
            
            @Override
            public void onFailure(Call<List<ExchangeRate>> call, Throwable t) {
                // Handle error
                loadRatesFromDb();
            }
        });
    }
    
    private void loadRatesFromDb() {
        new Thread(() -> {
            List<ExchangeRateEntity> rates = database.exchangeRateDao().getAllRates();
            currentRates.postValue(rates);
        }).start();
    }
    
    private void saveRatesToDb(List<ExchangeRateEntity> rates) {
        new Thread(() -> {
            database.exchangeRateDao().insertAll(rates);
        }).start();
    }
    
    private List<ExchangeRateEntity> convertToEntities(List<ExchangeRate> rates) {
        // Convert API model to database entity
        // Implementation details...
        return new ArrayList<>();
    }
}
