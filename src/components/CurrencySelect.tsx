
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate compared to USD (1 USD = rate)
}

interface CurrencySelectProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.78 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150.14 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.51 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.37 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 },
];

const CurrencySelect: React.FC<CurrencySelectProps> = ({ selectedCurrency, onCurrencyChange }) => {
  return (
    <Select
      value={selectedCurrency.code}
      onValueChange={(value) => {
        const currency = currencies.find(c => c.code === value);
        if (currency) onCurrencyChange(currency);
      }}
    >
      <SelectTrigger className="w-[110px]">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelect;
