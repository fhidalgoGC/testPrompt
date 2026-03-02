import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "es" | "en";

const translations = {
  es: {
    nav: {
      campaigns: "Sorteos",
      winners: "Ganadores",
      howItWorks: "Como funciona",
      terms: "Terminos y condiciones",
      login: "Iniciar sesion",
    },
    hero: {
      badge: "Cambia tu suerte",
      title1: "Gana el",
      titleHighlight: "vehiculo",
      title2: "de tus suenos.",
      subtitle: "Sorteos exclusivos de los vehiculos mas deseados del mundo. El sorteo se activa en el momento exacto en que se venden el 100% de los numeros.",
    },
    raffle: {
      priorityCampaign: "Sorteo Principal",
      activeAllocations: "Sorteos Activos",
      searchAssets: "Buscar vehiculos...",
      verifiedAsset: "Vehiculo Verificado",
      secureEntry: "Sera mio",
      allocationFull: "Numeros Agotados",
      activeCampaign: "Sorteo Activo",
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
      description: "Cada sorteo opera con una capacidad estricta. El sorteo permanece completamente inactivo hasta que el 100% de los numeros se vendan. Todos los participantes tienen la misma probabilidad de ganar por cada numero comprado.",
    },
    terms: {
      title: "Terminos y Condiciones",
      lastUpdated: "Ultima actualizacion",
      sections: [
        {
          heading: "1. Aceptacion de los Terminos",
          body: "Al acceder y utilizar esta plataforma, usted acepta estos terminos y condiciones en su totalidad. Si no esta de acuerdo con alguna parte de estos terminos, no debera utilizar nuestros servicios.",
        },
        {
          heading: "2. Descripcion del Servicio",
          body: "ApexDraw es una plataforma de sorteos de vehiculos premium. Cada sorteo cuenta con una capacidad fija de 9,999 numeros. El sorteo se activa unicamente cuando el 100% de los numeros han sido adquiridos.",
        },
        {
          heading: "3. Participacion",
          body: "Para participar, el usuario debe seleccionar uno o mas numeros disponibles y completar el proceso de adquisicion. Cada numero adquirido representa una oportunidad igual de ser seleccionado en el sorteo.",
        },
        {
          heading: "4. Proceso de Sorteo",
          body: "El sorteo se realiza de manera aleatoria y transparente una vez que todos los numeros han sido adquiridos. El resultado sera comunicado a todos los participantes por correo electronico.",
        },
        {
          heading: "5. Entrega del Premio",
          body: "El ganador sera contactado dentro de las 48 horas siguientes al sorteo. La entrega del vehiculo se coordinara directamente con el ganador, incluyendo toda la documentacion legal necesaria.",
        },
        {
          heading: "6. Politica de Reembolsos",
          body: "Una vez adquirido un numero, no se aceptan devoluciones ni reembolsos. Los numeros adquiridos son intransferibles.",
        },
        {
          heading: "7. Privacidad",
          body: "La informacion personal proporcionada sera utilizada unicamente para la gestion del sorteo y la comunicacion con los participantes. No compartimos informacion con terceros.",
        },
        {
          heading: "8. Modificaciones",
          body: "Nos reservamos el derecho de modificar estos terminos en cualquier momento. Los cambios seran notificados a traves de la plataforma.",
        },
      ],
    },
    langSwitch: "EN",
  },
  en: {
    nav: {
      campaigns: "Draws",
      winners: "Winners",
      howItWorks: "How it works",
      terms: "Terms & Conditions",
      login: "Log in",
    },
    hero: {
      badge: "Change your luck",
      title1: "Win the",
      titleHighlight: "vehicle",
      title2: "of your dreams.",
      subtitle: "Exclusive draws for the world's most sought-after vehicles. The draw activates the exact moment 100% of the numbers are sold.",
    },
    raffle: {
      priorityCampaign: "Priority Campaign",
      activeAllocations: "Active Campaigns",
      searchAssets: "Search vehicles...",
      verifiedAsset: "Verified Vehicle",
      secureEntry: "It will be mine",
      allocationFull: "Sold Out",
      activeCampaign: "Active Campaign",
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
      description: "Every campaign operates on a strict capacity constraint. The draw algorithm remains completely dormant until 100% of the allocation is secured. All participants have mathematically equal probability of selection per entry.",
    },
    terms: {
      title: "Terms & Conditions",
      lastUpdated: "Last updated",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          body: "By accessing and using this platform, you agree to these terms and conditions in their entirety. If you do not agree with any part of these terms, you should not use our services.",
        },
        {
          heading: "2. Service Description",
          body: "ApexDraw is a premium vehicle draw platform. Each campaign has a fixed capacity of 9,999 numbers. The draw activates only when 100% of the numbers have been acquired.",
        },
        {
          heading: "3. Participation",
          body: "To participate, users must select one or more available numbers and complete the acquisition process. Each acquired number represents an equal chance of being selected in the draw.",
        },
        {
          heading: "4. Draw Process",
          body: "The draw is conducted randomly and transparently once all numbers have been acquired. The result will be communicated to all participants via email.",
        },
        {
          heading: "5. Prize Delivery",
          body: "The winner will be contacted within 48 hours of the draw. Vehicle delivery will be coordinated directly with the winner, including all necessary legal documentation.",
        },
        {
          heading: "6. Refund Policy",
          body: "Once a number has been acquired, no returns or refunds are accepted. Acquired numbers are non-transferable.",
        },
        {
          heading: "7. Privacy",
          body: "Personal information provided will be used solely for campaign management and participant communication. We do not share information with third parties.",
        },
        {
          heading: "8. Modifications",
          body: "We reserve the right to modify these terms at any time. Changes will be notified through the platform.",
        },
      ],
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
