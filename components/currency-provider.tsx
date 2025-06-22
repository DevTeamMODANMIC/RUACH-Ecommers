"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface CurrencyContextType {
  currency: string
  symbol: string
  exchangeRate: number
  setCurrency: (currency: string, symbol: string, rate: number) => void
  convertPrice: (gbpPrice: number) => number
  formatPrice: (gbpPrice: number) => string
  formatCurrency: (amount: number) => string
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState("GBP")
  const [symbol, setSymbol] = useState("£")
  const [exchangeRate, setExchangeRate] = useState(1)

  const setCurrency = (newCurrency: string, newSymbol: string, newRate: number) => {
    setCurrencyState(newCurrency)
    setSymbol(newSymbol)
    setExchangeRate(newRate)

    // Store in localStorage for persistence
    localStorage.setItem(
      "selectedCurrency",
      JSON.stringify({
        currency: newCurrency,
        symbol: newSymbol,
        exchangeRate: newRate,
      }),
    )
  }

  const convertPrice = (gbpPrice: number): number => {
    return gbpPrice * exchangeRate
  }

  const formatPrice = (gbpPrice: number): string => {
    const convertedPrice = convertPrice(gbpPrice)

    // Format based on currency
    if (currency === "NGN" || currency === "INR" || currency === "JMD") {
      return `${symbol}${Math.round(convertedPrice).toLocaleString()}`
    } else if (currency === "GHS") {
      return `${symbol}${convertedPrice.toFixed(2)}`
    } else {
      return `${symbol}${convertedPrice.toFixed(2)}`
    }
  }

  // Format a price directly in the current currency (no conversion)
  const formatCurrency = (amount: number): string => {
    // Format based on currency
    if (currency === "NGN" || currency === "INR" || currency === "JMD") {
      return `${symbol}${Math.round(amount).toLocaleString()}`
    } else {
      return `${symbol}${amount.toFixed(2)}`
    }
  }

  // Load saved currency on mount
  useEffect(() => {
    const saved = localStorage.getItem("selectedCurrency")
    if (saved) {
      const { currency: savedCurrency, symbol: savedSymbol, exchangeRate: savedRate } = JSON.parse(saved)
      setCurrencyState(savedCurrency)
      setSymbol(savedSymbol)
      setExchangeRate(savedRate)
    }
  }, [])

  // Sync currency with country changes
  useEffect(() => {
    const handleCountryChange = (event: CustomEvent) => {
      const country = event.detail
      setCurrencyState(country.currency)
      setSymbol(country.symbol)
      setExchangeRate(country.exchangeRate)
    }

    window.addEventListener("countryChanged", handleCountryChange as EventListener)
    return () => window.removeEventListener("countryChanged", handleCountryChange as EventListener)
  }, [])

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        symbol,
        exchangeRate,
        setCurrency,
        convertPrice,
        formatPrice,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
