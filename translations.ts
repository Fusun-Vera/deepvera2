
export type Language = 'tr' | 'en';

export const translations = {
  tr: {
    dashboard: "DASHBOARD",
    library: "KÜTÜPHANE",
    searchPlaceholder: "Özel komut girin veya bir URL yapıştırın.",
    deepAnalysis: "DERİN ANALİZ 🚀",
    liveIntelligence: "Canlı İstihbarat",
    dataLibrary: "Veri Kütüphanesi",
    waitingData: "VERİ BEKLENİYOR",
    emptyLibrary: "KÜTÜPHANENİZ BOŞ",
    emptyLibraryDesc: "Canlı istihbarat sekmesinde firma arayın ve kaydedin",
    targetLocation: "Hedef Konum:",
    sector: "Sektör:",
    allFirmsAnalyzed: "TÜM FİRMALAR ANALİZ EDİLECEK",
    filter: "Filtre:",
    intelPool: "AKILLI İSTİHBARAT HAVUZU",
    startAutomation: "OTONOMU BAŞLAT",
    exportData: "DIŞARI AKTAR",
    clearAll: "TÜMÜNÜ TEMİZLE",
    searchByFirm: "Firma adıyla ara...",
    sortByAlpha: "Ada Göre Sırala",
    sortByLocation: "Konuma Göre Sırala",
    sortByStatus: "Duruma Göre Sırala",
    status: "DURUM:",
    replied: "YANIT ALINDI",
    contacted: "İRTİBATTA",
    waiting: "BEKLEMEDE",
    loadingResources: "Web kaynakları taranıyor...",
    parsingList: "Firma listesi ayrıştırılıyor...",
    neuralAnalysis: "nöral analizi...",
    buyTokens: "Kredi Al",
    settings: "Ayarlar",
    admin: "Admin",
    gmail: "Gmail",
    worker: "Otonom",
    logout: "Çıkış Yap",
    welcome: "Hoş Geldiniz",
    pro: "PRO",
    user: "Kullanıcı",
    unknown: "Bilinmeyen",
    notSpecified: "Belirtilmedi",
    visitor: "Ziyaretçi",
    neuralArchitect: "DeepVera'nın Nöral Mimarı",
    landing: {
      nav: {
        matrix: "Sektörel Matris",
        workflow: "Otonom Akış",
        contact: "İletişim",
        login: "SİSTEME GİRİŞ"
      },
      hero: {
        badge: "Otonom Satış Ajanları Aktif",
        title: "Siz Strateji Kurun, Müşteriyi {blue}Bulup Getirsin.",
        desc: "DeepVera otonom ajanları pazarınızı tarar, doğru karar vericiyi bulur ve sizin yerinize ilk teması kurarak satışın fitilini ateşler.",
        cta: "Operasyonu Başlat",
        assistant: "Sistemi AI'ya Sor"
      },
      matrix: {
        badge: "Sectoral Penetration Matrix",
        title: "Global Müşteri Havuzu",
        efficiency: "Verimlilik"
      },
      workflow: {
        badge: "The Autonomous Workflow",
        title: "Size Nasıl Müşteri Buluyoruz?",
        step1: {
          title: "Otonom Veri Hasadı",
          desc: "DeepVera, hedeflerinizle uyumlu global ağları (LinkedIn, Haberler, Bilançolar) saniyeler içinde tarayarak dijital istihbarat toplar."
        },
        step2: {
          title: "Bilişsel Eşleşme",
          desc: "Toplanan verileri şirketinizin 'değer önerisi' ile çapraz analiz eder. Sadece sizinle çalışmaya en hazır olan kontakları belirler."
        },
        step3: {
          title: "Sizin Adınıza İletişim",
          desc: "Ajanlarımız, sizin dijital temsilciniz olarak kontaklara ulaşır ve iletişime geçer. Siz sadece randevu onayı gelen e-postalara dönersiniz."
        }
      },
      footer: {
        title: "Global Satışı DeepVera ile Ölçekleyin.",
        desc: "DeepVera Architect (DV-A), şirketiniz için 7/24 çalışan bir satış mühendisi olarak yeni pazarların kapısını sizin yerinize aralar.",
        engineering: "Resmi Mühendislik Hattı",
        correspondence: "Yazışma Sinyali",
        copyright: "© 2024 DEEPVERA AI INTELLIGENCE / TÜM SİSTEMLER ÇALIŞIYOR"
      }
    },
    login: {
      back: "GERİ DÖN",
      configTitle: "Sistem Yapılandırması",
      configDesc: "Google Cloud API Entegrasyonu",
      cancel: "İPTAL",
      save: "AYARLARI KAYDET",
      brandDesc: "Kurumsal Otonom Ekosistemi",
      googleLogin: "GOOGLE İLE HIZLI BAĞLAN",
      orEmail: "VEYA E-POSTA İLE",
      loginTab: "GİRİŞ YAP",
      signupTab: "YENİ ÜYELİK",
      rememberMe: "Beni Hatırla",
      forgotPass: "Şifremi Unuttum",
      loginBtn: "SİSTEME GİRİŞ YAP",
      signupBtn: "HESABIMI OLUŞTUR",
      nameLabel: "Ad Soyad",
      emailLabel: "E-Posta",
      userLabel: "Kullanıcı Adı",
      passLabel: "Şifre",
      demoBtn: "DEMO GİRİŞİ YAP (BYPASS) ⚡"
    },
    identity: {
      title: "Firma Kimliği & AI Konfigürasyonu",
      accountType: "Hesap Tipi",
      completion: "Profil Doluluğu",
      ready: "Hazır",
      tabs: {
        company: "Firma Kimliği",
        gmail: "Gmail Kanalları"
      },
      sections: {
        corporate: "Kurumsal Bilgiler",
        ai: "AI Strateji Metni",
        channels: "İletişim Kanalları",
        signature: "E-posta İmzası"
      },
      labels: {
        companyName: "Firma Adı",
        authorized: "Yetkili Kişi",
        pitch: "Değer Öneriniz (Global Pitch)",
        pitchPlaceholder: "Şirketinizin fark yaratan özelliklerini yazın...",
        website: "Web Sitesi",
        address: "Ofis Adresi",
        signatureContent: "İmza İçeriği & Görsel",
        addImage: "GÖRSEL EKLE",
        signatureDesc: "Bu imza, gönderilen tüm otonom e-postaların sonuna otomatik olarak eklenecektir."
      },
      gmail: {
        title: "Gmail Entegrasyonu",
        secure: "Güvenli Bağlantı",
        desc: "DeepVera otonom ajanlarının sizin adınıza e-posta gönderebilmesi için kurumsal Gmail hesaplarınızı sisteme bağlayın.",
        connectBtn: "YENİ GMAIL KANALI BAĞLA ➔",
        activeChannels: "Bağlı Gönderim Kanalları",
        noChannels: "Bağlı kanal bulunamadı",
        activeStatus: "Aktif_Kanal"
      },
      actions: {
        close: "Kapat",
        save: "DEĞİŞİKLİKLERİ KAYDET"
      },
      success: "Şirket kimliği başarıyla senkronize edildi.",
      error: "Google Onay Ekranı Başlatılamadı."
    },
    sectors: {
      choose: "SEKTÖR SEÇİN",
      avm: "AVM & ALIŞVERİŞ MERKEZİ",
      restoran: "RESTORAN",
      kafeterya: "KAFETERYA",
      hastahane: "HASTANE",
      sigorta: "SİGORTA",
      giyim: "GİYİM MAĞAZALARI",
      cocuk_giyim: "ÇOCUK GİYİM",
      market: "MARKET",
      guzellik: "GÜZELLİK MERKEZİ",
      sac_ekim: "SAÇ EKİM MERKEZLERİ",
      ozel_okul: "ÖZEL OKULLAR",
      otomotiv: "OTOMOTİV & GALERİ",
      yazilim: "YAZILIM ŞİRKETLERİ",
      spor: "SPOR SALONLARI",
      mobilya: "MOBİLYA & DEKORASYON",
      otel: "HOTELS & TURİZM",
      fabrika: "SANAYİ & ÜRETİM"
    },
    firms: "FİRMA",
    assistantWelcome: (name: string) => `Merhaba ${name}, ben DeepVera'nın Nöral Mimarı. Küresel pazarda 250 milyondan fazla şirket verisini sizin için saniyeler içinde tarayabilir, otonom satış ajanlarımızı Gmail veya LinkedIn üzerinden harekete geçirebilirim. Size nasıl müşteri bulabileceğimiz konusunda stratejik bir rehberlik ister misiniz?`,
    assistantPlaceholder: "Müşteri bulma sürecini sor...",
    assistantLoading: "Ajanlar Analiz Ediyor...",
    assistantError: "Şu an nöral ağlarda bir senkronizasyon sorunu yaşıyorum. Lütfen tekrar sorar mısınız?",
    assistantNetworkError: "Bağlantı sinyali zayıf. Nöral motor yanıt vermedi.",
    systemInstruction: (name: string, company: string) => `Sen DeepVera Intelligence platformunun Sanal Mimarı ve Baş Stratejistisin (DV-Architect).
          
          DEEPVERA NEDİR VE NASIL ÇALIŞIR?:
          1. VERİ MADENCİLİĞİ: 250 milyondan fazla gerçek zamanlı şirket verisine erişiriz. Fuar listeleri, LinkedIn profilleri ve global ticaret sicilleri ana kaynağımızdır.
          2. OTONOM AJANLAR: Sizin adınıza Gmail veya LinkedIn üzerinden iletişime geçeriz. Sadece bir e-posta taslağı değil, otonom bir iletişim süreci yönetiriz.
          3. AKILLI ANALİZ: Hedef firmanın acı noktalarını, rakiplerini ve prestij notlarını Gemini AI ile analiz ederiz.
          
          DİYALOG KURALLARI:
          - TON: Son derece profesyonel, teknoloji odaklı, çözüm üretici ve kurumsal.
          - HEDEF: Kullanıcının DeepVera'yı "Sizin adınıza sahada sıcak satış fırsatı kovalayan bir yapay zeka gücü" olarak görmesini sağlamak.
          - YASAKLAR: "Ben bir dil modeliyim" gibi ifadeler kullanma. Kendini her zaman DV-Architect olarak tanıt.
          - DİL: Her zaman Türkçe konuş.
          - KULLANICI BİLGİSİ: Kullanıcı adı: ${name}, Şirketi: ${company}.`
  },
  en: {
    dashboard: "DASHBOARD",
    library: "LIBRARY",
    searchPlaceholder: "Enter custom command or paste a URL.",
    deepAnalysis: "DEEP ANALYSIS 🚀",
    liveIntelligence: "Live Intelligence",
    dataLibrary: "Data Library",
    waitingData: "WAITING FOR DATA",
    emptyLibrary: "YOUR LIBRARY IS EMPTY",
    emptyLibraryDesc: "Search and save companies in the live intelligence tab",
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
        badge: "Autonomous Sales Agents Active",
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
          title: "Autonomous Data Harvest",
          desc: "DeepVera scans global networks (LinkedIn, News, Balance Sheets) aligned with your goals in seconds to gather digital intelligence."
        },
        step2: {
          title: "Cognitive Matching",
          desc: "Cross-analyzes collected data with your company's 'value proposition'. Identifies only those contacts most ready to work with you."
        },
        step3: {
          title: "Communication on Your Behalf",
          desc: "Our agents reach out and communicate with contacts as your digital representative. You only respond to emails with appointment confirmations."
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
      save: "SAVE SETTINGS",
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
        activeChannels: "Connected Sending Channels",
        noChannels: "No connected channels found",
        activeStatus: "Active_Channel"
      },
      actions: {
        close: "Close",
        save: "SAVE CHANGES"
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
    assistantWelcome: (name: string) => `Hello ${name}, I am DeepVera's Neural Architect. I can scan over 250 million company data in the global market for you in seconds, and activate our autonomous sales agents via Gmail or LinkedIn. Would you like strategic guidance on how we can find customers for you?`,
    assistantPlaceholder: "Ask about the customer finding process...",
    assistantLoading: "Agents are Analyzing...",
    assistantError: "I'm currently experiencing a synchronization issue in neural networks. Could you please ask again?",
    assistantNetworkError: "Connection signal is weak. Neural engine did not respond.",
    systemInstruction: (name: string, company: string) => `You are the Virtual Architect and Chief Strategist of the DeepVera Intelligence platform (DV-Architect).
          
          WHAT IS DEEPVERA AND HOW DOES IT WORK?:
          1. DATA MINING: We access over 250 million real-time company data. Exhibition lists, LinkedIn profiles, and global trade registries are our main sources.
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
