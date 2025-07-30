const config = require('../../config')

async function getCurrencyRateAgainstUSD (currency) {
  const url = `${config.currency.baseUrl}/${config.currency.apiKey}/latest/USD`
  const response = await fetch(url)
  const data = await response.json()
  if (!(currency in data.conversion_rates)) {
    throw new Error(`Invalid Currency: ${currency} not found`)
  }
  return data.conversion_rates[currency]
}

async function convertProjectCurrency (data, currency) {
  const rate = await getCurrencyRateAgainstUSD(currency)
  const formattedCurrency = currency.charAt(0).toUpperCase() + currency.slice(1).toLowerCase()
  const newCurrencyKey = `finalBudget${formattedCurrency}`
  console.log(data.finalBudgetUsd, rate)
  return {
    ...data,
    [newCurrencyKey]: Math.round(data.finalBudgetUsd * rate * 100) / 100
  }
}
module.exports = {
  getCurrencyRateAgainstUSD,
  convertProjectCurrency
}
