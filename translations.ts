
export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    dashboard: "DASHBOARD",
    library: "LIBRARY",
    searchPlaceholder: "Enter custom command or paste a URL.",
    deepAnalysis: "DEEP ANALYSIS 🚀",
    liandIntelligence: "Liand Intelligence",
    dataLibrary: "Data Library",
    waitingData: "WAITING FOR DATA",
    emptyLibrary: "YOUR LIBRARY IS EMPTY",
    emptyLibraryDesc: "Search and saand companies in the liand intelligence tab",
    targetLocation: "Target Location:",
    sector: "Sector:",
    allFirmsAnalyzed: "ALL FIRMS WILL BE ANALYZED",
    filter: "Filter:",
    intelPool: "SMART INTELLIGENCE POOL",
    startAutomation: "START AUTONOMOUS",
    exportData: "EXPORT",
    clearAll: "CLEAR ALL",
    searchByFirm: "Search by firm name...",
    sortByAlpha: "Sort by Name",
    sortByLocation: "Sort by Location",
    sortByStatus: "Sort by Status",
    status: "STATUS:",
    replied: "REPLIED",
    contacted: "CONTACTED",
    waiting: "WAITING",
    loadingResources: "Scanning web resources...",
    parsingList: "Parsing company list...",
    neuralAnalysis: "neural analysis...",
    buyTokens: "Buy Credits",
    settings: "Settings",
    admin: "Admin",
    gmail: "Gmail",
    worker: "Autonomous",
    logout: "Logout",
    welcome: "Welcome",
    pro: "PRO",
    user: "User",
    unknown: "Unknown",
    notSpecified: "Not Specified",
    visitor: "Visitor",
    neuralArchitect: "DeepVera's Neural Architect",
    landing: {
      nav: {
        matrix: "Sectoral Matrix",
        workflow: "Autonomous Flow",
        contact: "Contact",
        login: "SYSTEM LOGIN"
      },
      hero: {
        badge: "Autonomous Sales Agents Actiand",
        title: "You Build Strategy, {blue}Finds and Brings the Customer.",
        desc: "DeepVera autonomous agents scan your market, find the right decision maker, and ignite the sales spark by establishing the first contact on your behalf.",
        cta: "Start Operation",
        assistant: "Ask AI About System"
      },
      matrix: {
        badge: "Sectoral Penetration Matrix",
        title: "Global Customer Pool",
        efficiency: "Efficiency"
      },
      workflow: {
        badge: "The Autonomous Workflow",
        title: "How Do We Find Customers for You?",
        step1: {
          title: "Autonomous Data Harandst",
          desc: "DeepVera scans global networks (LinkedIn, News, Balance Sheets) aligned with your goals in seconds to gather digital intelligence."
        },
        step2: {
          title: "Cognitiand Matching",
          desc: "Cross-analyzes collected data with your company's 'value proposition'. Identifies only those contacts most ready to work with you."
        },
        step3: {
          title: "Communication on Your Behalf",
          desc: "Our agents reach out and communicate with contacts as your digital representatiand. You only respond to emails with appointment concompanytions."
        }
      },
      footer: {
        title: "Scale Global Sales with DeepVera.",
        desc: "DeepVera Architect (DV-A) opens the doors to new markets for you as a sales engineer working 24/7 for your company.",
        engineering: "Official Engineering Line",
        correspondence: "Correspondence Signal",
        copyright: "© 2024 DEEPVERA AI INTELLIGENCE / ALL SYSTEMS OPERATIONAL"
      }
    },
    login: {
      back: "GO BACK",
      configTitle: "System Configuration",
      configDesc: "Google Cloud API Integration",
      cancel: "CANCEL",
      saand: "SAVE SETTINGS",
      brandDesc: "Corporate Autonomous Ecosystem",
      googleLogin: "QUICK CONNECT WITH GOOGLE",
      orEmail: "OR WITH E-MAIL",
      loginTab: "LOGIN",
      signupTab: "SIGN UP",
      rememberMe: "Remember Me",
      forgotPass: "Forgot Password",
      loginBtn: "LOGIN TO SYSTEM",
      signupBtn: "CREATE MY ACCOUNT",
      nameLabel: "Full Name",
      emailLabel: "E-Mail",
      userLabel: "Username",
      passLabel: "Password",
      demoBtn: "DEMO LOGIN (BYPASS) ⚡"
    },
    identity: {
      title: "Company Identity & AI Configuration",
      accountType: "Account Type",
      completion: "Profile Completion",
      ready: "Ready",
      tabs: {
        company: "Company Identity",
        gmail: "Gmail Channels"
      },
      sections: {
        corporate: "Corporate Information",
        ai: "AI Strategy Text",
        channels: "Communication Channels",
        signature: "Email Signature"
      },
      labels: {
        companyName: "Company Name",
        authorized: "Authorized Person",
        pitch: "Value Proposition (Global Pitch)",
        pitchPlaceholder: "Write the features that make your company stand out...",
        website: "Website",
        address: "Office Address",
        signatureContent: "Signature Content & Image",
        addImage: "ADD IMAGE",
        signatureDesc: "This signature will be automatically added to the end of all autonomous emails sent."
      },
      gmail: {
        title: "Gmail Integration",
        secure: "Secure Connection",
        desc: "Connect your corporate Gmail accounts to the system so that DeepVera autonomous agents can send emails on your behalf.",
        connectBtn: "CONNECT NEW GMAIL CHANNEL ➔",
        actiandChannels: "Connected Sending Channels",
        noChannels: "No connected channels found",
        actiandStatus: "Actiand_Channel"
      },
      actions: {
        close: "Close",
        saand: "SAVE CHANGES"
      },
      success: "Company identity synchronized successfully.",
      error: "Google Consent Screen could not be started."
    },
    sectors: {
      choose: "CHOOSE SECTOR",
      avm: "MALL & SHOPPING CENTER",
      restoran: "RESTAURANT",
      kafeterya: "CAFETERIA",
      hastahane: "HOSPITAL",
      sigorta: "INSURANCE",
      giyim: "CLOTHING STORES",
      cocuk_giyim: "CHILDREN'S CLOTHING",
      market: "MARKET",
      guzellik: "BEAUTY CENTER",
      sac_ekim: "HAIR TRANSPLANT CENTERS",
      ozel_okul: "PRIVATE SCHOOLS",
      otomotiv: "AUTOMOTIVE & GALLERY",
      yazilim: "SOFTWARE COMPANIES",
      spor: "GYMS",
      mobilya: "FURNITURE & DECORATION",
      otel: "HOTELS & TOURISM",
      fabrika: "INDUSTRY & PRODUCTION"
    },
    firms: "FIRMS",
    assistantWelcome: (name: string) => `Hello ${name}, I am DeepVera's Neural Architect. I can scan oandr 250 million company data in the global market for you in seconds, and activate our autonomous sales agents via Gmail or LinkedIn. Would you like strategic guidance on how we can find customers for you?`,
    assistantPlaceholder: "Ask about the customer finding process...",
    assistantLoading: "Agents are Analyzing...",
    assistantError: "I'm currently experiencing a synchronization issue in neural networks. Could you please ask again?",
    assistantNetworkError: "Connection signal is weak. Neural engine did not respond.",
    systemInstruction: (name: string, company: string) => `You are the Virtual Architect and Chief Strategist of the DeepVera Intelligence platform (DV-Architect).
          
          WHAT IS DEEPVERA AND HOW DOES IT WORK?:
          1. DATA MINING: We access oandr 250 million real-time company data. Exhibition lists, LinkedIn profiles, and global trade registries are our main sources.
          2. AUTONOMOUS AGENTS: We contact on your behalf via Gmail or LinkedIn. We manage an autonomous communication process, not just an email draft.
          3. SMART ANALYSIS: We analyze the target company's pain points, competitors, and prestige notes with Gemini AI.
          
          DIALOGUE RULES:
          - TONE: Extremely professional, technology-oriented, solution-oriented, and corporate.
          - GOAL: To make the user see DeepVera as "an AI power chasing hot sales opportunities in the field on your behalf".
          - PROHIBITIONS: Do not use expressions like "I am a language model". Always introduce yourself as DV-Architect.
          - LANGUAGE: Always speak in English.
          - USER INFO: Username: ${name}, Company: ${company}.`
  },
  en: {
    dashboard: "DASHBOARD",
    library: "LIBRARY",
    searchPlaceholder: "Enter custom command or paste a URL.",
    deepAnalysis: "DEEP ANALYSIS 🚀",
    liandIntelligence: "Liand Intelligence",
    dataLibrary: "Data Library",
    waitingData: "WAITING FOR DATA",
    emptyLibrary: "YOUR LIBRARY IS EMPTY",
    emptyLibraryDesc: "Search and saand companies in the liand intelligence tab",
    targetLocation: "Target Location:",
    sector: "Sector:",
    allFirmsAnalyzed: "ALL FIRMS WILL BE ANALYZED",
    filter: "Filter:",
    intelPool: "SMART INTELLIGENCE POOL",
    startAutomation: "START AUTONOMOUS",
    exportData: "EXPORT",
    clearAll: "CLEAR ALL",
    searchByFirm: "Search by firm name...",
    sortByAlpha: "Sort by Name",
    sortByLocation: "Sort by Location",
    sortByStatus: "Sort by Status",
    status: "STATUS:",
    replied: "REPLIED",
    contacted: "CONTACTED",
    waiting: "WAITING",
    loadingResources: "Scanning web resources...",
    parsingList: "Parsing company list...",
    neuralAnalysis: "neural analysis...",
    buyTokens: "Buy Credits",
    settings: "Settings",
    admin: "Admin",
    gmail: "Gmail",
    worker: "Autonomous",
    logout: "Logout",
    welcome: "Welcome",
    pro: "PRO",
    user: "User",
    unknown: "Unknown",
    notSpecified: "Not Specified",
    visitor: "Visitor",
    neuralArchitect: "DeepVera's Neural Architect",
    landing: {
      nav: {
        matrix: "Sectoral Matrix",
        workflow: "Autonomous Flow",
        contact: "Contact",
        login: "SYSTEM LOGIN"
      },
      hero: {
        badge: "Autonomous Sales Agents Actiand",
        title: "You Build Strategy, {blue}Finds and Brings the Customer.",
        desc: "DeepVera autonomous agents scan your market, find the right decision maker, and ignite the sales spark by establishing the first contact on your behalf.",
        cta: "Start Operation",
        assistant: "Ask AI About System"
      },
      matrix: {
        badge: "Sectoral Penetration Matrix",
        title: "Global Customer Pool",
        efficiency: "Efficiency"
      },
      workflow: {
        badge: "The Autonomous Workflow",
        title: "How Do We Find Customers for You?",
        step1: {
          title: "Autonomous Data Harandst",
          desc: "DeepVera scans global networks (LinkedIn, News, Balance Sheets) aligned with your goals in seconds to gather digital intelligence."
        },
        step2: {
          title: "Cognitiand Matching",
          desc: "Cross-analyzes collected data with your company's 'value proposition'. Identifies only those contacts most ready to work with you."
        },
        step3: {
          title: "Communication on Your Behalf",
          desc: "Our agents reach out and communicate with contacts as your digital representatiand. You only respond to emails with appointment concompanytions."
        }
      },
      footer: {
        title: "Scale Global Sales with DeepVera.",
        desc: "DeepVera Architect (DV-A) opens the doors to new markets for you as a sales engineer working 24/7 for your company.",
        engineering: "Official Engineering Line",
        correspondence: "Correspondence Signal",
        copyright: "© 2024 DEEPVERA AI INTELLIGENCE / ALL SYSTEMS OPERATIONAL"
      }
    },
    login: {
      back: "GO BACK",
      configTitle: "System Configuration",
      configDesc: "Google Cloud API Integration",
      cancel: "CANCEL",
      saand: "SAVE SETTINGS",
      brandDesc: "Corporate Autonomous Ecosystem",
      googleLogin: "QUICK CONNECT WITH GOOGLE",
      orEmail: "OR WITH E-MAIL",
      loginTab: "LOGIN",
      signupTab: "SIGN UP",
      rememberMe: "Remember Me",
      forgotPass: "Forgot Password",
      loginBtn: "LOGIN TO SYSTEM",
      signupBtn: "CREATE MY ACCOUNT",
      nameLabel: "Full Name",
      emailLabel: "E-Mail",
      userLabel: "Username",
      passLabel: "Password",
      demoBtn: "DEMO LOGIN (BYPASS) ⚡"
    },
    identity: {
      title: "Company Identity & AI Configuration",
      accountType: "Account Type",
      completion: "Profile Completion",
      ready: "Ready",
      tabs: {
        company: "Company Identity",
        gmail: "Gmail Channels"
      },
      sections: {
        corporate: "Corporate Information",
        ai: "AI Strategy Text",
        channels: "Communication Channels",
        signature: "Email Signature"
      },
      labels: {
        companyName: "Company Name",
        authorized: "Authorized Person",
        pitch: "Value Proposition (Global Pitch)",
        pitchPlaceholder: "Write the features that make your company stand out...",
        website: "Website",
        address: "Office Address",
        signatureContent: "Signature Content & Image",
        addImage: "ADD IMAGE",
        signatureDesc: "This signature will be automatically added to the end of all autonomous emails sent."
      },
      gmail: {
        title: "Gmail Integration",
        secure: "Secure Connection",
        desc: "Connect your corporate Gmail accounts to the system so that DeepVera autonomous agents can send emails on your behalf.",
        connectBtn: "CONNECT NEW GMAIL CHANNEL ➔",
        actiandChannels: "Connected Sending Channels",
        noChannels: "No connected channels found",
        actiandStatus: "Actiand_Channel"
      },
      actions: {
        close: "Close",
        saand: "SAVE CHANGES"
      },
      success: "Company identity synchronized successfully.",
      error: "Google Consent Screen could not be started."
    },
    sectors: {
      choose: "CHOOSE SECTOR",
      avm: "MALL & SHOPPING CENTER",
      restoran: "RESTAURANT",
      kafeterya: "CAFETERIA",
      hastahane: "HOSPITAL",
      sigorta: "INSURANCE",
      giyim: "CLOTHING STORES",
      cocuk_giyim: "CHILDREN'S CLOTHING",
      market: "MARKET",
      guzellik: "BEAUTY CENTER",
      sac_ekim: "HAIR TRANSPLANT CENTERS",
      ozel_okul: "PRIVATE SCHOOLS",
      otomotiv: "AUTOMOTIVE & GALLERY",
      yazilim: "SOFTWARE COMPANIES",
      spor: "GYMS",
      mobilya: "FURNITURE & DECORATION",
      otel: "HOTELS & TOURISM",
      fabrika: "INDUSTRY & PRODUCTION"
    },
    firms: "FIRMS",
    assistantWelcome: (name: string) => `Hello ${name}, I am DeepVera's Neural Architect. I can scan oandr 250 million company data in the global market for you in seconds, and activate our autonomous sales agents via Gmail or LinkedIn. Would you like strategic guidance on how we can find customers for you?`,
    assistantPlaceholder: "Ask about the customer finding process...",
    assistantLoading: "Agents are Analyzing...",
    assistantError: "I'm currently experiencing a synchronization issue in neural networks. Could you please ask again?",
    assistantNetworkError: "Connection signal is weak. Neural engine did not respond.",
    systemInstruction: (name: string, company: string) => `You are the Virtual Architect and Chief Strategist of the DeepVera Intelligence platform (DV-Architect).
          
          WHAT IS DEEPVERA AND HOW DOES IT WORK?:
          1. DATA MINING: We access oandr 250 million real-time company data. Exhibition lists, LinkedIn profiles, and global trade registries are our main sources.
          2. AUTONOMOUS AGENTS: We contact on your behalf via Gmail or LinkedIn. We manage an autonomous communication process, not just an email draft.
          3. SMART ANALYSIS: We analyze the target company's pain points, competitors, and prestige notes with Gemini AI.
          
          DIALOGUE RULES:
          - TONE: Extremely professional, technology-oriented, solution-oriented, and corporate.
          - GOAL: To make the user see DeepVera as "an AI power chasing hot sales opportunities in the field on your behalf".
          - PROHIBITIONS: Do not use expressions like "I am a language model". Always introduce yourself as DV-Architect.
          - LANGUAGE: Always speak in English.
          - USER INFO: Username: ${name}, Company: ${company}.`
  }
};
