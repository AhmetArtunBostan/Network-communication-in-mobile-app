package com.exchange.service;

import com.exchange.model.ExchangeRate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NBPService {
    
    @Value("${nbp.api.url}")
    private String apiUrl;
    
    @Value("${nbp.api.table}")
    private String table;
    
    private final RestTemplate restTemplate;
    
    public NBPService() {
        this.restTemplate = new RestTemplate();
    }
    
    public List<ExchangeRate> getCurrentExchangeRates() {
        String url = apiUrl + "exchangerates/tables/" + table + "/";
        NBPResponse response = restTemplate.getForObject(url, NBPResponse.class);
        return convertToExchangeRates(response);
    }
    
    public List<ExchangeRate> getHistoricalExchangeRates(LocalDate date) {
        String url = apiUrl + "exchangerates/tables/" + table + "/" + date.toString() + "/";
        NBPResponse response = restTemplate.getForObject(url, NBPResponse.class);
        return convertToExchangeRates(response);
    }
    
    private List<ExchangeRate> convertToExchangeRates(NBPResponse response) {
        if (response == null || response.getRates() == null) {
            return List.of();
        }
        
        return Arrays.stream(response.getRates())
                .map(rate -> {
                    ExchangeRate exchangeRate = new ExchangeRate();
                    exchangeRate.setCurrencyCode(rate.getCode());
                    exchangeRate.setRate(rate.getMid());
                    exchangeRate.setEffectiveDate(response.getEffectiveDate());
                    return exchangeRate;
                })
                .collect(Collectors.toList());
    }
    
    // NBP API Response classes
    private static class NBPResponse {
        private String table;
        private String no;
        private LocalDate effectiveDate;
        private Rate[] rates;
        
        public String getTable() { return table; }
        public void setTable(String table) { this.table = table; }
        public String getNo() { return no; }
        public void setNo(String no) { this.no = no; }
        public LocalDate getEffectiveDate() { return effectiveDate; }
        public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
        public Rate[] getRates() { return rates; }
        public void setRates(Rate[] rates) { this.rates = rates; }
    }
    
    private static class Rate {
        private String currency;
        private String code;
        private BigDecimal mid;
        
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public BigDecimal getMid() { return mid; }
        public void setMid(BigDecimal mid) { this.mid = mid; }
    }
}
