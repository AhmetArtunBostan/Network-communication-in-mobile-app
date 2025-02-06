package com.exchange.currency.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import com.exchange.currency.R;
import com.exchange.currency.databinding.FragmentHomeBinding;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;
    private HomeViewModel viewModel;

    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentHomeBinding.inflate(inflater, container, false);
        viewModel = new ViewModelProvider(this).get(HomeViewModel.class);

        setupObservers();
        setupClickListeners();

        return binding.getRoot();
    }

    private void setupObservers() {
        viewModel.getBalance().observe(getViewLifecycleOwner(), balance -> {
            binding.textBalance.setText(String.format("Balance: %.2f PLN", balance));
        });
    }

    private void setupClickListeners() {
        binding.buttonDeposit.setOnClickListener(v -> {
            // Show deposit dialog
        });

        binding.buttonWithdraw.setOnClickListener(v -> {
            // Show withdraw dialog
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
