import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "es" | "en";

const translations = {
  es: {
    nav: {
      campaigns: "Sorteos",
      winners: "Ganadores",
      howItWorks: "Como funciona",
      terms: "Terminos y condiciones",
      verifyOtp: "Verificar OTP",
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
      awaitingDraw: "Esperando Sorteo",
      almostFree: "Casi gratis",
      badgeLabels: ["La mejor opcion", "Buenisimo", "No esta nada mal", "Increible", "Imperdible"] as readonly string[],
      viewersWatching: "{count} personas estan viendo este vehiculo",
      dontMissOut: "No te pierdas la oportunidad",
    },
    progress: {
      targetReached: "Meta Alcanzada",
      imminentDraw: "Sorteo Inminente",
      fundingProgress: "Progreso de Venta",
      drawTrigger: "El sorteo se activa al 100%",
      totalCapacity: "Capacidad Total",
    },
    picker: {
      title: "Compra tus tickets",
      subtitle: "Participa en el sorteo de",
      quantityDesc: "Selecciona cuantos tickets deseas. Los numeros se asignan al azar automaticamente.",
      namePlaceholder: "Tu nombre completo",
      phonePlaceholder: "Tu numero de telefono",
      emailPlaceholder: "Tu correo electronico",
      idPlaceholder: "Tu numero de identificacion",
      contactModalTitle: "Datos de contacto",
      verifyInfoDesc: "Ingresa tu telefono, correo e identificacion. Te enviaremos un codigo para verificar.",
      otpPlaceholder: "Codigo de 6 digitos",
      sendingCode: "Enviando...",
      resendCode: "Reenviar codigo",
      verifyTitle: "Verifica tu telefono",
      verifyDesc: "Te enviamos un codigo de 6 digitos al numero {phone}. Ingresalo a continuacion.",
      verifyCode: "Verificar",
      verifying: "Verificando...",
      codeInvalid: "Codigo incorrecto",
      codeInvalidDesc: "El codigo ingresado no es valido o ha expirado. Intenta de nuevo.",
      codeSent: "Codigo enviado",
      codeSentToEmail: "Revisa tu correo para el codigo de verificacion.",
      emailCodeExplanation: "Al continuar, te enviaremos un codigo de 6 digitos a tu correo electronico. Tendras 5 minutos para verificarlo.",
      sendCodeEmail: "Enviar codigo al correo",
      timerExpiredTitle: "El codigo llegara pronto",
      timerExpiredDesc: "Tu codigo llegara en los proximos minutos. Verificalo desde la opcion 'Verificar OTP' en el menu.",
      confirmTitle: "Estas a punto de cambiar tu suerte",
      confirmDesc: "Al confirmar, te enviaremos un correo con las indicaciones y tus tickets. Revisa tu bandeja de entrada.",
      ticketCount: "Cantidad de tickets:",
      randomAssignNote: "Los numeros se asignaran al azar al confirmar.",
      confirmBtn: "Confirmar compra",
      buyButton: "Sera mio",
      buyButtonPlural: "Quiero {count} tickets",
      processing: "Procesando...",
      successTitle: "Compra Confirmada",
      successDesc: "Te enviamos un correo con tus numeros y las instrucciones.",
      yourNumbers: "Tus numeros asignados:",
      paymentWarningTitle: "Realiza el pago en menos de 1 hora",
      paymentWarningDesc: "Si no se confirma el pago dentro de 1 hora, tus tickets seran cancelados y podrian ser asignados a otra persona.",
      closeBtn: "Cerrar",
      toastTitle: "Numeros Asegurados",
      toastDesc: "Compraste {count} numeros para {title}.",
      errorTitle: "Error",
      errorDesc: "No se pudieron comprar los numeros.",
      errorGeneric: "Error al procesar la compra.",
      invalidPhone: "Telefono invalido",
      invalidPhoneDesc: "El telefono debe tener al menos 8 digitos.",
      invalidEmail: "Correo invalido",
      invalidEmailDesc: "Ingresa un correo electronico valido.",
    },
    verifyOtp: {
      title: "Verificar OTP",
      subtitle: "Ingresa el codigo que recibiste por SMS.",
      phoneDesc: "Ingresa el numero de telefono al que enviamos el codigo de verificacion.",
      enterCodeTitle: "Ingresa tu codigo",
      enterCodeDesc: "Escribe el codigo de 6 digitos que enviamos al {phone}.",
      haveCode: "Ya tengo codigo",
      alreadyHaveCode: "Si ya recibiste el codigo SMS, puedes ingresar tu telefono y usar el boton 'Ya tengo codigo' para ir directo a verificarlo.",
      invalidPhone: "Telefono invalido",
      invalidPhoneDesc: "Ingresa un numero de telefono valido.",
      verifiedTitle: "Telefono verificado",
      verifiedDesc: "Tu numero de telefono ha sido verificado exitosamente.",
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
      verifyOtp: "Verify OTP",
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
      awaitingDraw: "Awaiting Draw",
      almostFree: "Almost free",
      badgeLabels: ["Best choice", "Amazing", "Not bad at all", "Incredible", "Can't miss"] as readonly string[],
      viewersWatching: "{count} people are viewing this vehicle",
      dontMissOut: "Don't miss your chance",
    },
    progress: {
      targetReached: "Target Reached",
      imminentDraw: "Imminent Draw",
      fundingProgress: "Sales Progress",
      drawTrigger: "Draw triggers at 100%",
      totalCapacity: "Total Capacity",
    },
    picker: {
      title: "Buy your tickets",
      subtitle: "Enter the draw for",
      quantityDesc: "Choose how many tickets you want. Numbers are assigned randomly.",
      namePlaceholder: "Your full name",
      phonePlaceholder: "Your phone number",
      emailPlaceholder: "Your email address",
      idPlaceholder: "Your ID number",
      contactModalTitle: "Contact information",
      verifyInfoDesc: "Enter your phone, email, and ID. We'll send you a verification code.",
      otpPlaceholder: "6-digit code",
      sendingCode: "Sending...",
      resendCode: "Resend code",
      verifyTitle: "Verify your phone",
      verifyDesc: "We sent a 6-digit code to {phone}. Enter it below.",
      verifyCode: "Verify",
      verifying: "Verifying...",
      codeInvalid: "Invalid code",
      codeInvalidDesc: "The code entered is invalid or has expired. Try again.",
      codeSent: "Code sent",
      codeSentToEmail: "Check your email for the verification code.",
      emailCodeExplanation: "By continuing, we'll send a 6-digit code to your email. You'll have 5 minutes to verify it.",
      sendCodeEmail: "Send code to email",
      timerExpiredTitle: "Your code will arrive soon",
      timerExpiredDesc: "Your code will arrive in the next few minutes. Verify it from the 'Verify OTP' option in the menu.",
      confirmTitle: "You're about to change your luck",
      confirmDesc: "Once confirmed, we'll send you an email with instructions and your tickets. Check your inbox.",
      ticketCount: "Number of tickets:",
      randomAssignNote: "Numbers will be randomly assigned upon confirmation.",
      confirmBtn: "Confirm purchase",
      buyButton: "It will be mine",
      buyButtonPlural: "I want {count} tickets",
      processing: "Processing...",
      successTitle: "Purchase Confirmed",
      successDesc: "We sent you an email with your numbers and instructions.",
      yourNumbers: "Your assigned numbers:",
      paymentWarningTitle: "Complete payment within 1 hour",
      paymentWarningDesc: "If payment is not confirmed within 1 hour, your tickets will be cancelled and may be assigned to someone else.",
      closeBtn: "Close",
      toastTitle: "Numbers Secured",
      toastDesc: "You bought {count} numbers for {title}.",
      errorTitle: "Error",
      errorDesc: "Could not purchase the numbers.",
      errorGeneric: "Error processing the purchase.",
      invalidPhone: "Invalid phone",
      invalidPhoneDesc: "Phone number must have at least 8 digits.",
      invalidEmail: "Invalid email",
      invalidEmailDesc: "Please enter a valid email address.",
    },
    verifyOtp: {
      title: "Verify OTP",
      subtitle: "Enter the code you received via SMS.",
      phoneDesc: "Enter the phone number where we sent the verification code.",
      enterCodeTitle: "Enter your code",
      enterCodeDesc: "Type the 6-digit code we sent to {phone}.",
      haveCode: "I have a code",
      alreadyHaveCode: "If you already received the SMS code, enter your phone and use 'I have a code' to go straight to verification.",
      invalidPhone: "Invalid phone",
      invalidPhoneDesc: "Please enter a valid phone number.",
      verifiedTitle: "Phone verified",
      verifiedDesc: "Your phone number has been verified successfully.",
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
