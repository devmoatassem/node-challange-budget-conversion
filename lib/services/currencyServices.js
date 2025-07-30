const config = require('../../config')

async function convertProjectCurrency (data, currency, keysToConvert) {
  const rate = await getCurrencyRateAgainstUSD(currency)
  const formattedCurrency =
    currency.charAt(0).toUpperCase() + currency.slice(1).toLowerCase()

  const convertedFields = {}
  for (const key of keysToConvert) {
    if (typeof data[key] !== 'number') continue

    const newKey = `${key.replace(/Usd$/i, '')}${formattedCurrency}`
    convertedFields[newKey] = Math.round(data[key] * rate * 100) / 100
  }

  return {
    ...data,
    ...convertedFields
  }
}

async function getCurrencyRateAgainstUSD (currency) {
  const url = `${config.currency.baseUrl}/${config.currency.apiKey}/latest/USD`
  const response = await fetch(url)
  const data = await response.json()

  if (!(currency in data.conversion_rates)) {
    throw new Error(`Invalid Currency: ${currency} not found`)
  }

  return data.conversion_rates[currency]
}

module.exports = {
  getCurrencyRateAgainstUSD,
  convertProjectCurrency
}
