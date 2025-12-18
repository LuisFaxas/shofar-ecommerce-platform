import { InitialData, LanguageCode } from "@vendure/core";

export const initialData: InitialData = {
  defaultLanguage: LanguageCode.en,
  defaultZone: "US",
  collections: [],
  taxRates: [
    { name: "Standard Tax", percentage: 20 },
    { name: "Reduced Tax", percentage: 10 },
    { name: "Zero Tax", percentage: 0 },
  ],
  shippingMethods: [
    { name: "Standard Shipping", price: 500 },
    { name: "Express Shipping", price: 1000 },
  ],
  countries: [
    { name: "United States", code: "US", zone: "US" },
    { name: "Canada", code: "CA", zone: "US" },
    { name: "United Kingdom", code: "GB", zone: "Europe" },
    { name: "Germany", code: "DE", zone: "Europe" },
    { name: "France", code: "FR", zone: "Europe" },
  ],
  paymentMethods: [
    {
      name: "Standard Payment",
      handler: {
        code: "dummy-payment-handler",
        arguments: [{ name: "automaticSettle", value: "false" }],
      },
    },
  ],
};
