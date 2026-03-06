import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "es" | "en";

const translations = {
  es: {
    nav: {
      campaigns: "Sueños",
      winners: "Sueños cumplidos",
      howItWorks: "Como funciona",
      terms: "Terminos y condiciones",
      verifyOtp: "Verificar OTP",
      login: "Iniciar sesion",
      redeemSeeds: "Aplicar semillas",
    },
    hero: {
      badge: "Cambia tu destino",
      title1: "Consigue tus",
      titleHighlight: "semillas",
      titleEmoji: "🌾",
      title2: "gana tus lechugas",
      title2Emoji: "$$$",
      title2End: "y empieza a cumplir tus sueños",
      subtitle: "Oportunidades exclusivas de vivir tus sueños mas deseados. Tu sueño se activa en el momento exacto en que se venden el 100% de las semillas.",
    },
    raffle: {
      priorityCampaign: "Sueño Principal",
      activeAllocations: "Sueños Activos",
      searchAssets: "Buscar vehiculos...",
      verifiedAsset: "Vehiculo Verificado",
      secureEntry: "Sera mio",
      allocationFull: "Numeros Agotados",
      awaitingDraw: "Sueño en camino",
      almostFree: "Casi gratis",
      badgeLabels: ["La mejor opcion", "Buenisimo", "No esta nada mal", "Increible", "Imperdible"] as readonly string[],
      viewersWatching: "Personas estan viendo este item",
      dontMissOut: "No te pierdas la oportunidad",
    },
    progress: {
      targetReached: "Meta Alcanzada",
      imminentDraw: "Sueño Inminente",
      fundingProgress: "Semillas Disponibles",
      drawTrigger: "Al completar el 100% se inicia el proceso.",
      drawUrgent: "Espera un poco, ya casi es tuyo",
      totalCapacity: "Capacidad Total",
    },
    picker: {
      title: "Compra tus semillas",
      subtitle: "Participa por el sueño de",
      selectCountry: "Selecciona tu pais",
      selectCountryDesc: "Elige tu pais para ver los precios disponibles.",
      quantityDesc: "Cada semilla tiene un numero aleatorio y seran enviados a tu correo despues de comprar.",
      pricePerSeed: "Precio por semilla:",
      paymentMethods: "Forma de pago",
      paymentMethodsDesc: "Selecciona tu metodo de pago y realiza la transferencia.",
      totalToPay: "Total a pagar:",
      copySuccess: "Copiado",
      continueAfterPayment: "Ya realice el pago",
      continueButton: "Continuar",
      uploadProof: "Cargar comprobante de pago",
      uploadProofDesc: "",
      uploadDragDrop: "Toca para seleccionar archivo",
      uploadFormats: "JPG, PNG o PDF (max 10MB)",
      uploading: "Subiendo...",
      uploadSuccess: "Comprobante cargado",
      uploadError: "Error al subir el archivo",
      uploadedFile: "Archivo cargado:",
      changeFile: "Cambiar archivo",
      namePlaceholder: "Tu nombre completo",
      phonePlaceholder: "Tu numero de telefono",
      emailPlaceholder: "Tu correo electronico",
      idPlaceholder: "Tu numero de identificacion",
      contactModalTitle: "Datos de contacto",
      verifyInfoDesc: "Tus semillas compradas seran enviadas a tu correo una vez verificado el pago. Este proceso puede tardar unos minutos o un maximo de 24 horas.",
      idPlaceholderVE: "Tu cedula (V-12345678)",
      idPlaceholderMX: "Tu CURP o INE",
      idPlaceholderCO: "Tu cedula de ciudadania",
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
      confirmTitle: "Estas a punto de cambiar tu destino",
      confirmDesc: "Al confirmar, te enviaremos un correo con las indicaciones y tus semillas. Revisa tu bandeja de entrada.",
      ticketCount: "Cantidad de semillas:",
      randomAssignNote: "Cada semilla es un numero que se seleccionara de forma aleatoria.",
      confirmBtn: "Confirmar datos",
      buyButton: "Sera mio",
      buyButtonPlural: "Quiero {count} semillas",
      processing: "Procesando...",
      successTitle: "Compra Confirmada",
      successDesc: "Tu compra ha sido registrada. Recibiras tus semillas en tu correo una vez verificado el pago. La verificacion puede tardar unos minutos o un maximo de 24 horas.",
      transactionLabel: "Numero de transaccion",
      saveTransactionNote: "Guarda este numero como comprobante de tu compra.",
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
    coupon: {
      title: "Aplicar semillas",
      subtitle: "Ingresa tu codigo para recibir creditos",
      codePlaceholder: "Ingresa tu codigo",
      emailPlaceholder: "Tu correo electronico",
      applyBtn: "Aplicar",
      applying: "Aplicando...",
      successTitle: "Semillas agregadas",
      successDesc: "Se han agregado {credits} creditos a tu cuenta.",
      errorInvalid: "Codigo invalido",
      errorInvalidDesc: "El codigo ingresado no existe. Verifica e intenta de nuevo.",
      errorUsed: "Codigo ya utilizado",
      errorUsedDesc: "Este codigo ya fue utilizado anteriormente.",
      errorGeneric: "Error al aplicar el codigo.",
      backHome: "Volver al inicio",
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
      title: "Siempre con respaldo oficial",
      description: "",
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
          body: "GMare es una plataforma donde puedes cumplir el sueno de tener un vehiculo premium. Cada oportunidad cuenta con una capacidad fija de 9,999 numeros. El proceso se activa unicamente cuando el 100% de las semillas han sido adquiridas.",
        },
        {
          heading: "3. Participacion",
          body: "Para participar, el usuario debe seleccionar uno o mas numeros disponibles y completar el proceso de adquisicion. Cada numero adquirido representa una oportunidad igual de ser seleccionado.",
        },
        {
          heading: "4. Proceso de Seleccion",
          body: "La seleccion se realiza de manera aleatoria y transparente una vez que todos los numeros han sido adquiridos. El resultado sera comunicado a todos los participantes por correo electronico.",
        },
        {
          heading: "5. Entrega del Premio",
          body: "El ganador sera contactado dentro de las 48 horas siguientes a la seleccion. La entrega del vehiculo se coordinara directamente con el ganador, incluyendo toda la documentacion legal necesaria.",
        },
        {
          heading: "6. Politica de Reembolsos",
          body: "Una vez adquirido un numero, no se aceptan devoluciones ni reembolsos. Los numeros adquiridos son intransferibles.",
        },
        {
          heading: "7. Privacidad",
          body: "La informacion personal proporcionada sera utilizada unicamente para la gestion del proceso y la comunicacion con los participantes. No compartimos informacion con terceros.",
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
      winners: "Dreams fulfilled",
      howItWorks: "How it works",
      terms: "Terms & Conditions",
      verifyOtp: "Verify OTP",
      login: "Log in",
      redeemSeeds: "Apply seeds",
    },
    hero: {
      badge: "Change your luck",
      title1: "Get the",
      titleHighlight: "tree",
      titleEmoji: "🤑🤑🤑",
      title2: "your dreams.",
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
      viewersWatching: "People are viewing this item",
      dontMissOut: "Don't miss your chance",
    },
    progress: {
      targetReached: "Target Reached",
      imminentDraw: "Imminent Draw",
      fundingProgress: "Sales Progress",
      drawTrigger: "Once 100% is reached, the process begins.",
      drawUrgent: "Hang tight, it's almost yours",
      totalCapacity: "Total Capacity",
    },
    picker: {
      title: "Buy your seeds",
      subtitle: "Enter the draw for",
      selectCountry: "Select your country",
      selectCountryDesc: "Choose your country to see available prices.",
      quantityDesc: "Each seed has a random number and they will be sent to your email after purchase.",
      pricePerSeed: "Price per seed:",
      paymentMethods: "Payment method",
      paymentMethodsDesc: "Select your payment method and make the transfer.",
      totalToPay: "Total to pay:",
      copySuccess: "Copied",
      continueAfterPayment: "I already made the payment",
      continueButton: "Continue",
      uploadProof: "Upload payment proof",
      uploadProofDesc: "",
      uploadDragDrop: "Tap to select file",
      uploadFormats: "JPG, PNG or PDF (max 10MB)",
      uploading: "Uploading...",
      uploadSuccess: "Proof uploaded",
      uploadError: "Error uploading file",
      uploadedFile: "File uploaded:",
      changeFile: "Change file",
      namePlaceholder: "Your full name",
      phonePlaceholder: "Your phone number",
      emailPlaceholder: "Your email address",
      idPlaceholder: "Your ID number",
      contactModalTitle: "Contact information",
      verifyInfoDesc: "Your purchased seeds will be sent to your email once payment is verified. This process may take a few minutes or up to 24 hours.",
      idPlaceholderVE: "Your cedula (V-12345678)",
      idPlaceholderMX: "Your CURP or INE",
      idPlaceholderCO: "Your citizenship ID",
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
      confirmTitle: "You're about to change your destiny",
      confirmDesc: "Once confirmed, we'll send you an email with instructions and your seeds. Check your inbox.",
      ticketCount: "Number of seeds:",
      randomAssignNote: "Each seed is a number that will be selected randomly.",
      confirmBtn: "Confirm details",
      buyButton: "It will be mine",
      buyButtonPlural: "I want {count} seeds",
      processing: "Processing...",
      successTitle: "Purchase Confirmed",
      successDesc: "Your purchase has been registered. You will receive your seeds by email once payment is verified. Verification may take a few minutes or up to 24 hours.",
      transactionLabel: "Transaction number",
      saveTransactionNote: "Save this number as proof of your purchase.",
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
    coupon: {
      title: "Apply seeds",
      subtitle: "Enter your code to receive credits",
      codePlaceholder: "Enter your code",
      emailPlaceholder: "Your email address",
      applyBtn: "Apply",
      applying: "Applying...",
      successTitle: "Seeds added",
      successDesc: "{credits} credits have been added to your account.",
      errorInvalid: "Invalid code",
      errorInvalidDesc: "The code entered does not exist. Please check and try again.",
      errorUsed: "Code already used",
      errorUsedDesc: "This code has already been used.",
      errorGeneric: "Error applying the code.",
      backHome: "Back to home",
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
      title: "Always with official backing",
      description: "",
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
          body: "GMare is a premium vehicle draw platform. Each campaign has a fixed capacity of 9,999 numbers. The draw activates only when 100% of the numbers have been acquired.",
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

export type AppCountry = "VE" | "MX" | "CO" | "OTHER";

export const COUNTRY_FLAGS: Record<AppCountry, string> = {
  OTHER: "🌎",
  VE: "🇻🇪",
  MX: "🇲🇽",
  CO: "🇨🇴",
};

export const COUNTRY_NAMES: Record<AppCountry, string> = {
  OTHER: "Global",
  VE: "Venezuela",
  MX: "México",
  CO: "Colombia",
};

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  country: AppCountry;
  setCountry: (country: AppCountry) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("locale");
    return (saved === "en" || saved === "es") ? saved : "es";
  });

  const [country, setCountry] = useState<AppCountry>(() => {
    const saved = localStorage.getItem("country");
    return (saved === "VE" || saved === "MX" || saved === "CO" || saved === "OTHER") ? saved : "OTHER";
  });

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem("country", country);
  }, [country]);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale, country, setCountry }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
