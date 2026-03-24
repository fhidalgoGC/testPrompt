import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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
      titleHighlight: "Semillas",
      titleEmoji: "🌱",
      title2: "gana tus",
      title2Highlight: "Lechugas",
      title2Emoji1: "🥬",
      title2Emoji2: "$$$",
      title2End: "y empieza a cumplir tus sueños",
      subtitle:
        "Oportunidades exclusivas de vivir tus sueños mas deseados. Tu sueño se activa en el momento exacto en que se venden el 100% de las semillas.",
    },
    raffle: {
      priorityCampaign: "Tus Lechuguitas # 1",
      activeAllocations: "Sueños Activos",
      searchAssets: "Buscar vehiculos...",
      verifiedAsset: "Vehiculo Verificado",
      secureEntry: "Quiero mis Semillas",
      allocationFull: "Numeros Agotados",
      awaitingDraw: "Sueño en camino",
      almostFree: "Casi gratis",
      badgeLabels: [
        "La mejor opcion",
        "Buenisimo",
        "No esta nada mal",
        "Increible",
        "Imperdible",
      ] as readonly string[],
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
      quantityDesc:
        "Cada semilla tiene un numero aleatorio y seran enviados a tu correo despues de comprar.",
      pricePerSeed: "Precio por semilla:",
      paymentMethods: "Forma de pago",
      paymentMethodsDesc:
        "Selecciona tu metodo de pago y realiza la transferencia.",
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
      verifyInfoDesc:
        "Tus semillas compradas seran enviadas a tu correo una vez verificado el pago. Este proceso puede tardar unos minutos o un maximo de 24 horas.",
      idPlaceholderVE: "Tu cedula (V-12345678)",
      idPlaceholderMX: "Tu CURP o INE",
      idPlaceholderCO: "Tu cedula de ciudadania",
      otpPlaceholder: "Codigo de 6 digitos",
      sendingCode: "Enviando...",
      resendCode: "Reenviar codigo",
      verifyTitle: "Verifica tu telefono",
      verifyDesc:
        "Te enviamos un codigo de 6 digitos al numero {phone}. Ingresalo a continuacion.",
      verifyCode: "Verificar",
      verifying: "Verificando...",
      codeInvalid: "Codigo incorrecto",
      codeInvalidDesc:
        "El codigo ingresado no es valido o ha expirado. Intenta de nuevo.",
      codeSent: "Codigo enviado",
      codeSentToEmail: "Revisa tu correo para el codigo de verificacion.",
      emailCodeExplanation:
        "Al continuar, te enviaremos un codigo de 6 digitos a tu correo electronico. Tendras 5 minutos para verificarlo.",
      sendCodeEmail: "Enviar codigo al correo",
      timerExpiredTitle: "El codigo llegara pronto",
      timerExpiredDesc:
        "Tu codigo llegara en los proximos minutos. Verificalo desde la opcion 'Verificar OTP' en el menu.",
      confirmTitle: "",
      confirmDesc:
        "Al confirmar, te enviaremos un correo con las indicaciones y tus semillas. Revisa tu bandeja de entrada.",
      ticketCount: "Cantidad de semillas:",
      randomAssignNote:
        "Cada semilla es un numero que se seleccionara de forma aleatoria.",
      confirmBtn: "Confirmar datos",
      buyButton: "Quiero mis Semillas",
      buyButtonPlural: "Quiero {count} semillas",
      processing: "Procesando...",
      successTitle: "Compra Confirmada",
      successDesc:
        "Tu compra ha sido registrada. Recibiras tus semillas en tu correo una vez verificado el pago. La verificacion puede tardar unos minutos o un maximo de 24 horas.",
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
      errorInvalidDesc:
        "El codigo ingresado no existe. Verifica e intenta de nuevo.",
      errorUsed: "Codigo ya utilizado",
      errorUsedDesc: "Este codigo ya fue utilizado anteriormente.",
      errorGeneric: "Error al aplicar el codigo.",
      backHome: "Volver al inicio",
    },
    verifyOtp: {
      title: "Verificar OTP",
      subtitle: "Ingresa el codigo que recibiste por SMS.",
      phoneDesc:
        "Ingresa el numero de telefono al que enviamos el codigo de verificacion.",
      enterCodeTitle: "Ingresa tu codigo",
      enterCodeDesc: "Escribe el codigo de 6 digitos que enviamos al {phone}.",
      haveCode: "Ya tengo codigo",
      alreadyHaveCode:
        "Si ya recibiste el codigo SMS, puedes ingresar tu telefono y usar el boton 'Ya tengo codigo' para ir directo a verificarlo.",
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
          heading: "2. Quienes pueden participar",
          body: "Solo podran participar personas naturales mayores de 18 anos.",
        },
        {
          heading: "3. Datos del formulario",
          body: "Es obligatorio completar el formulario con **datos reales y verídicos**. El nombre completo y la cedula de identidad seran utilizados para **validar la identidad del ganador** al momento de hacer entrega del premio. El telefono y el correo electronico deben ser validos y accesibles, ya que seran los **medios de comunicacion oficiales** para enviarte la confirmacion de compra, tus semillas asignadas y cualquier informacion relevante del sorteo.",
        },
        {
          heading: "4. Verificacion y Confirmacion de compra",
          body: "Al enviar el formulario junto con tu comprobante de pago, recibiras un **correo electronico automatico** indicando que tu pago esta siendo validado. Una vez que nuestro equipo valide tu pago, recibiras un segundo correo con la **confirmacion de compra** y tus **semillas asignadas** en un plazo maximo de **_____** debido al alto volumen de transacciones, desde nuestros %%correos oficiales · ver punto 10|#section-10%%. Posteriormente, nuestro **canal principal de comunicacion es WhatsApp**, a traves del cual tambien te contactaremos.",
        },
        {
          heading: "5. Proceso de Seleccion",
          body: "Una vez que todas las semillas han sido adquiridas, la seleccion de los numeros ganadores se realizara **1 dia despues**, a traves del programa **Super Gana**, segun el horario establecido de acuerdo a cada premio. El resultado sera comunicado a todos los participantes por los canales oficiales.",
        },
        {
          heading: "6. Entrega del Premio",
          body: "Los ganadores seran contactados entre **24 y 36 horas** despues de la seleccion. La entrega del premio se realizara entre **12 y 24 horas** despues del contacto inicial. Para verificar el premio es necesario contar con la cedula de identidad que se registro en el momento de comprar las semillas.",
        },
        {
          heading: "7. Transparencia y difusion",
          body: "Para garantizar la transparencia de cada sorteo, los ganadores aceptan aparecer en los contenidos audiovisuales relacionados con la entrega de premios, los cuales podran ser publicados en nuestras redes sociales.",
        },
        {
          heading: "8. Politica de Reembolsos",
          body: "Una vez adquirida una semilla, no se aceptan devoluciones ni reembolsos. Las semillas adquiridas son intransferibles.",
        },
        {
          heading: "9. Privacidad",
          body: "La informacion personal proporcionada sera utilizada unicamente para la gestion del proceso y la comunicacion con los participantes. No compartimos informacion con terceros.",
        },
        {
          heading: "10. Medios de comunicacion oficiales",
          body: "Nuestros canales oficiales de contacto son: **WhatsApp:** __+58 422-633-3703__ | **Telegram:** __@ganaconmare__ | **Correo electronico:** __info@maredorazio.com__ y __ganaconmare@gmail.com__. Cualquier comunicacion fuera de estos canales no es oficial.",
        },
      ],
    },
    howItWorks: {
      title: "Como Funciona",
      subtitle:
        "Tu camino hacia el sueno de un vehiculo premium en 5 simples pasos.",
      steps: [
        {
          title: "1. Elige tu Sueno",
          description:
            "Explora los vehiculos disponibles en nuestra plataforma. Cada campana tiene una capacidad de 9,999 semillas, y tu puedes adquirir las que desees.",
        },
        {
          title: "2. Compra tus Semillas",
          description:
            "Selecciona la cantidad de semillas que deseas y completa el proceso de pago. Cada semilla tiene un numero aleatorio unico que sera tu oportunidad.",
        },
        {
          title: "3. Realiza tu Pago",
          description:
            "Elige tu metodo de pago preferido, realiza la transferencia y sube tu comprobante. Verificaremos tu pago en minutos o hasta un maximo de 24 horas.",
        },
        {
          title: "4. Espera al 100%",
          description:
            "El proceso se activa unicamente cuando el 100% de las semillas han sido vendidas. Mientras tanto, puedes seguir el progreso en tiempo real desde la plataforma.",
        },
        {
          title: "5. Seleccion del Ganador",
          description:
            "Una vez vendidas todas las semillas, se realiza una seleccion aleatoria y transparente. El ganador sera notificado por correo electronico y contactado en 48 horas.",
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
      subtitle:
        "Exclusive draws for the world's most sought-after vehicles. The draw activates the exact moment 100% of the numbers are sold.",
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
      badgeLabels: [
        "Best choice",
        "Amazing",
        "Not bad at all",
        "Incredible",
        "Can't miss",
      ] as readonly string[],
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
      quantityDesc:
        "Each seed has a random number and they will be sent to your email after purchase.",
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
      verifyInfoDesc:
        "Your purchased seeds will be sent to your email once payment is verified. This process may take a few minutes or up to 24 hours.",
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
      emailCodeExplanation:
        "By continuing, we'll send a 6-digit code to your email. You'll have 5 minutes to verify it.",
      sendCodeEmail: "Send code to email",
      timerExpiredTitle: "Your code will arrive soon",
      timerExpiredDesc:
        "Your code will arrive in the next few minutes. Verify it from the 'Verify OTP' option in the menu.",
      confirmTitle: "",
      confirmDesc:
        "Once confirmed, we'll send you an email with instructions and your seeds. Check your inbox.",
      ticketCount: "Number of seeds:",
      randomAssignNote: "Each seed is a number that will be selected randomly.",
      confirmBtn: "Confirm details",
      buyButton: "It will be mine",
      buyButtonPlural: "I want {count} seeds",
      processing: "Processing...",
      successTitle: "Purchase Confirmed",
      successDesc:
        "Your purchase has been registered. You will receive your seeds by email once payment is verified. Verification may take a few minutes or up to 24 hours.",
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
      errorInvalidDesc:
        "The code entered does not exist. Please check and try again.",
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
      alreadyHaveCode:
        "If you already received the SMS code, enter your phone and use 'I have a code' to go straight to verification.",
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
          heading: "2. Who Can Participate",
          body: "Only natural persons aged 18 years or older may participate.",
        },
        {
          heading: "3. Form Data",
          body: "It is mandatory to complete the form with **real and accurate information**. Your full name and national ID will be used to **verify the winner's identity** at the time of prize delivery. Your phone number and email must be valid and accessible, as they will be the **official communication channels** for sending your purchase confirmation, your assigned seeds, and any relevant draw updates.",
        },
        {
          heading: "4. Payment Verification and Purchase Confirmation",
          body: "When you submit the form along with your proof of payment, you will receive an **automatic email** indicating that your payment is being validated. Once our team validates your payment, you will receive a second email with your **purchase confirmation** and your **assigned seeds** within a maximum of **_____** due to the high volume of transactions, from our %%official emails · see point 10|#section-10%%. Afterwards, our **main communication channel is WhatsApp**, through which we will also contact you.",
        },
        {
          heading: "5. Draw Process",
          body: "Once all seeds have been acquired, the winning numbers will be drawn **1 day later**, through the **Super Gana** program, according to the established schedule for each prize. The result will be communicated to all participants through the official channels.",
        },
        {
          heading: "6. Prize Delivery",
          body: "Winners will be contacted between **24 and 36 hours** after the draw. The prize will be delivered between **12 and 24 hours** after initial contact. To verify the prize, winners must provide the national ID that was registered at the time of purchasing their seeds.",
        },
        {
          heading: "7. Transparency and Dissemination",
          body: "To guarantee the transparency of each draw, winners agree to appear in audiovisual content related to the prize delivery, which may be published on our social media channels.",
        },
        {
          heading: "8. Refund Policy",
          body: "Once a seed has been acquired, no returns or refunds are accepted. Acquired seeds are non-transferable.",
        },
        {
          heading: "9. Privacy",
          body: "Personal information provided will be used solely for campaign management and participant communication. We do not share information with third parties.",
        },
        {
          heading: "10. Official Communication Channels",
          body: "Our official contact channels are: **WhatsApp:** __+58 422-633-3703__ | **Telegram:** __@ganaconmare__ | **Email:** __info@maredorazio.com__ and __ganaconmare@gmail.com__. Any communication outside these channels is not official.",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Your path to owning a premium vehicle in 5 simple steps.",
      steps: [
        {
          title: "1. Choose Your Dream",
          description:
            "Browse the available vehicles on our platform. Each campaign has a capacity of 9,999 seeds, and you can acquire as many as you want.",
        },
        {
          title: "2. Buy Your Seeds",
          description:
            "Select the number of seeds you want and complete the payment process. Each seed has a unique random number that represents your chance.",
        },
        {
          title: "3. Make Your Payment",
          description:
            "Choose your preferred payment method, make the transfer, and upload your proof of payment. We'll verify your payment in minutes or up to 24 hours.",
        },
        {
          title: "4. Wait for 100%",
          description:
            "The process activates only when 100% of the seeds have been sold. Meanwhile, you can follow the progress in real time on the platform.",
        },
        {
          title: "5. Winner Selection",
          description:
            "Once all seeds are sold, a random and transparent selection is made. The winner will be notified by email and contacted within 48 hours.",
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
    return saved === "en" || saved === "es" ? saved : "es";
  });

  const [country, setCountry] = useState<AppCountry>(() => {
    const saved = localStorage.getItem("country");
    return saved === "VE" ||
      saved === "MX" ||
      saved === "CO" ||
      saved === "OTHER"
      ? saved
      : "OTHER";
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
