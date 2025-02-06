package com.exchange.currency.ui.rates;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;
import com.exchange.currency.data.ExchangeRateEntity;
import com.exchange.currency.databinding.ItemExchangeRateBinding;

public class ExchangeRatesAdapter extends ListAdapter<ExchangeRateEntity, ExchangeRatesAdapter.ViewHolder> {

    protected ExchangeRatesAdapter() {
        super(new DiffUtil.ItemCallback<ExchangeRateEntity>() {
            @Override
            public boolean areItemsTheSame(@NonNull ExchangeRateEntity oldItem, @NonNull ExchangeRateEntity newItem) {
                return oldItem.getId() == newItem.getId();
            }

            @Override
            public boolean areContentsTheSame(@NonNull ExchangeRateEntity oldItem, @NonNull ExchangeRateEntity newItem) {
                return oldItem.getRate().equals(newItem.getRate()) &&
                       oldItem.getCurrencyCode().equals(newItem.getCurrencyCode());
            }
        });
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemExchangeRateBinding binding = ItemExchangeRateBinding.inflate(
            LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ExchangeRateEntity rate = getItem(position);
        holder.bind(rate);
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        private final ItemExchangeRateBinding binding;

        ViewHolder(ItemExchangeRateBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(ExchangeRateEntity rate) {
            binding.textCurrencyCode.setText(rate.getCurrencyCode());
            binding.textRate.setText(String.format("%.4f PLN", rate.getRate()));
        }
    }
}
