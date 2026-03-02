import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "es" | "en";

const translations = {
  es: {
    nav: {
      raffles: "Rifas",
      winners: "Ganadores",
      howItWorks: "Como funciona",
    },
    hero: {
      badge: "Cambia tu suerte",
      title1: "Gana el",
      titleHighlight: "vehiculo",
      title2: "de tus suenos.",
      subtitle: "Rifas exclusivas de los vehiculos mas deseados del mundo. El sorteo se activa en el momento exacto en que se venden el 100% de los numeros.",
    },
    raffle: {
      priorityCampaign: "Rifa Principal",
      activeAllocations: "Rifas Activas",
      searchAssets: "Buscar vehiculos...",
      verifiedAsset: "Vehiculo Verificado",
      secureEntry: "Sera mio",
      allocationFull: "Numeros Agotados",
      activeCampaign: "Rifa Activa",
      awaitingDraw: "Esperando Sorteo",
    },
    progress: {
      targetReached: "Meta Alcanzada",
      imminentDraw: "Sorteo Inminente",
      fundingProgress: "Progreso de Venta",
      drawTrigger: "El sorteo se activa al 100%",
      totalCapacity: "Capacidad Total",
    },
    picker: {
      title: "Escoge tus numeros",
      subtitle: "Selecciona los numeros para",
      searchPlaceholder: "Buscar numero...",
      go: "Ir",
      available: "disponible",
      availableShort: "disp.",
      legendAvailable: "Disponible",
      legendSelected: "Tu seleccion",
      legendSold: "Vendido",
      selected: "Seleccionados:",
      namePlaceholder: "Tu nombre completo",
      invalidNumber: "Numero invalido",
      invalidNumberDesc: "Ingresa un numero entre 1 y",
      notAvailable: "No disponible",
      notAvailableDesc: "El numero {num} ya fue vendido.",
      confirmTitle: "Estas a punto de cambiar tu suerte",
      confirmDesc: "Al confirmar, te enviaremos un correo con las indicaciones y tus tickets. Revisa tu bandeja de entrada.",
      buyButton: "Sera mio",
      buyButtonPlural: "Seran mios",
      processing: "Procesando...",
      successTitle: "Compra Confirmada",
      successDesc: "Te enviamos un correo con tus numeros y las instrucciones.",
      toastTitle: "Numeros Asegurados",
      toastDesc: "Compraste {count} numeros para {title}.",
      errorTitle: "Error",
      errorDesc: "No se pudieron comprar los numeros.",
      errorGeneric: "Error al procesar la compra.",
    },
    footer: {
      title: "Transparencia Total",
      description: "Cada rifa opera con una capacidad estricta. El sorteo permanece completamente inactivo hasta que el 100% de los numeros se vendan. Todos los participantes tienen la misma probabilidad de ganar por cada numero comprado.",
    },
    langSwitch: "EN",
  },
  en: {
    nav: {
      raffles: "Raffles",
      winners: "Winners",
      howItWorks: "How it works",
    },
    hero: {
      badge: "Change your luck",
      title1: "Win the",
      titleHighlight: "vehicle",
      title2: "of your dreams.",
      subtitle: "Exclusive raffles for the world's most sought-after vehicles. The draw activates the exact moment 100% of the numbers are sold.",
    },
    raffle: {
      priorityCampaign: "Priority Campaign",
      activeAllocations: "Active Raffles",
      searchAssets: "Search vehicles...",
      verifiedAsset: "Verified Vehicle",
      secureEntry: "It will be mine",
      allocationFull: "Sold Out",
      activeCampaign: "Active Raffle",
      awaitingDraw: "Awaiting Draw",
    },
    progress: {
      targetReached: "Target Reached",
      imminentDraw: "Imminent Draw",
      fundingProgress: "Sales Progress",
      drawTrigger: "Draw triggers at 100%",
      totalCapacity: "Total Capacity",
    },
    picker: {
      title: "Pick your numbers",
      subtitle: "Select the numbers for",
      searchPlaceholder: "Search number...",
      go: "Go",
      available: "available",
      availableShort: "avail.",
      legendAvailable: "Available",
      legendSelected: "Your selection",
      legendSold: "Sold",
      selected: "Selected:",
      namePlaceholder: "Your full name",
      invalidNumber: "Invalid number",
      invalidNumberDesc: "Enter a number between 1 and",
      notAvailable: "Not available",
      notAvailableDesc: "Number {num} is already sold.",
      confirmTitle: "You're about to change your luck",
      confirmDesc: "Once confirmed, we'll send you an email with instructions and your tickets. Check your inbox.",
      buyButton: "It will be mine",
      buyButtonPlural: "They will be mine",
      processing: "Processing...",
      successTitle: "Purchase Confirmed",
      successDesc: "We sent you an email with your numbers and instructions.",
      toastTitle: "Numbers Secured",
      toastDesc: "You bought {count} numbers for {title}.",
      errorTitle: "Error",
      errorDesc: "Could not purchase the numbers.",
      errorGeneric: "Error processing the purchase.",
    },
    footer: {
      title: "Full Transparency",
      description: "Every raffle operates on a strict capacity constraint. The draw algorithm remains completely dormant until 100% of the allocation is secured. All participants have mathematically equal probability of selection per entry.",
    },
    langSwitch: "ES",
  },
} as const;

type Translations = typeof translations.es;

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return (saved === "en" || saved === "es") ? saved : "es";
  });

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
