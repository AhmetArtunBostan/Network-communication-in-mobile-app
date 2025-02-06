package com.exchange.currency.ui.rates;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import com.exchange.currency.databinding.FragmentExchangeRatesBinding;
import com.exchange.currency.viewmodel.ExchangeRateViewModel;

public class ExchangeRatesFragment extends Fragment {

    private FragmentExchangeRatesBinding binding;
    private ExchangeRateViewModel viewModel;
    private ExchangeRatesAdapter adapter;

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentExchangeRatesBinding.inflate(inflater, container, false);
        viewModel = new ViewModelProvider(this).get(ExchangeRateViewModel.class);
        
        setupRecyclerView();
        setupObservers();
        setupSwipeRefresh();
        
        return binding.getRoot();
    }

    private void setupRecyclerView() {
        adapter = new ExchangeRatesAdapter();
        binding.recyclerRates.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerRates.setAdapter(adapter);
    }

    private void setupObservers() {
        viewModel.getCurrentRates().observe(getViewLifecycleOwner(), rates -> {
            adapter.submitList(rates);
            binding.swipeRefresh.setRefreshing(false);
        });
    }

    private void setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            viewModel.refreshRates();
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
