export const environment = {
  rifaId: "LECHG01-",
  apiBaseUrl: "https://api.maredorazio.com/dev",
  seeds: {
    min: 4,
    step: 4,
    max: 96,
    quickAmounts: [4, 8, 12, 24, 48, 96],
  },
  methodsPayments: [
    {
      id: "pagomovil",
      name: "Pago Móvil",
      logo: new URL("../assets/logos/pago-movil.png", import.meta.url).href,
      coinId: "ves",
      details: [
        { label: "Cédula", value: "20242594" },
        { label: "Celular", value: "0422-6333703" },
        { label: "Banco", value: "Banco de Venezuela 0102" },
      ],
    },
    {
      id: "transferSpei",
      name: "Transferencia SPEI",
      logo: new URL("../assets/logos/spei.jpg", import.meta.url).href,
      coinId: "mxn",
      details: [
        { label: "Banco", value: "MercadoPago" },
        { label: "CLABE", value: "722969010417786326" },
      ],
    },
    {
      id: "transferBancolombia",
      name: "Bancolombia (Transferencia)",
      logo: new URL("../assets/logos/transferencia.png", import.meta.url).href,
      coinId: "cop",
      details: [
        { label: "Banco", value: "Bancolombia" },
        { label: "Cuenta", value: "00981065221" },
        { label: "Tipo", value: "Cta de ahorros" },
        { label: "Titular", value: "Aron Hidalgo" },
      ],
    },
    {
      id: "binancePay",
      name: "Binance Pay",
      logo: new URL("../assets/logos/binance.png", import.meta.url).href,
      coinId: "usd",
      details: [
        { label: "Binance ID", value: "91914887" },
      ],
    },
    {
      id: "zelle",
      name: "Zelle",
      logo: new URL("../assets/logos/zelle.png", import.meta.url).href,
      coinId: "usd",
      details: [
        { label: "Email", value: "hifreddytech@gmail.com" },
      ],
    },
  ],
};
