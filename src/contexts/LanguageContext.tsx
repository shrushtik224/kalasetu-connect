import React, { createContext, useContext, useState, useCallback } from "react";

// Supported languages
export type Language = "en" | "hi" | "ta" | "bn" | "mr" | "te";

export interface LanguageOption {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
}

export const LANGUAGES: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
];

// Translation keys
type TranslationKeys = {
    // Common
    appName: string;
    welcome: string;
    home: string;
    profile: string;
    sales: string;
    record: string;
    logout: string;
    changePhoto: string;
    back: string;
    loading: string;
    noData: string;
    save: string;
    cancel: string;
    submit: string;

    // Greetings
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;

    // Dashboard
    thisMonth: string;
    products: string;
    rating: string;
    quickActions: string;
    sellNewItem: string;
    recordVideoSell: string;
    manualListing: string;
    manualListingDesc: string;
    priceEstimator: string;
    aiPriceEstimate: string;
    viewSales: string;
    viewAllProducts: string;
    priceAI: string;

    // My Sales
    mySales: string;
    totalProducts: string;
    activeListings: string;
    myProducts: string;
    productCount: string;
    noProducts: string;
    noProductsDesc: string;
    recordVideo: string;
    active: string;
    sold: string;
    soldItems: string;
    noSalesYet: string;
    noSalesDesc: string;

    // Profile
    profileTitle: string;
    location: string;
    craft: string;
    experience: string;
    contact: string;
    about: string;
    tapChangePhoto: string;
    uploadPhoto: string;
    uploading: string;

    // Price Estimator
    priceEstimatorTitle: string;
    priceEstimatorDesc: string;
    productName: string;
    productNamePlaceholder: string;
    materialCost: string;
    materialCostPlaceholder: string;
    hoursSpent: string;
    hoursSpentPlaceholder: string;
    getMarketEstimate: string;
    analyzingMarket: string;
    suggestedPrice: string;
    aiReasoning: string;
    material: string;
    labor: string;
    avgProfit: string;
    estimationFailed: string;
    fillAllFields: string;

    // Recording
    startRecording: string;
    stopRecording: string;
    recordingInProgress: string;
    uploadingVideo: string;
    transcribing: string;
    processing: string;

    // Listing Review
    reviewListing: string;
    publish: string;
    publishing: string;
    editDetails: string;
    price: string;
    description: string;
};

// All translations
const translations: Record<Language, TranslationKeys> = {
    en: {
        appName: "KalaSetu",
        welcome: "Welcome",
        home: "Home",
        profile: "Profile",
        sales: "Sales",
        record: "Record",
        logout: "Logout",
        changePhoto: "Change Photo",
        back: "Back",
        loading: "Loading...",
        noData: "No data",
        save: "Save",
        cancel: "Cancel",
        submit: "Submit",

        goodMorning: "Good Morning",
        goodAfternoon: "Hello",
        goodEvening: "Good Evening",

        thisMonth: "This Month",
        products: "Products",
        rating: "Rating",
        quickActions: "Quick Actions",
        sellNewItem: "Sell New Item",
        recordVideoSell: "Record video & sell your craft",
        manualListing: "Manual Listing",
        manualListingDesc: "Write manually",
        priceEstimator: "Price Estimator",
        aiPriceEstimate: "AI price estimate",
        viewSales: "View My Sales",
        viewAllProducts: "View all products & sales",
        priceAI: "Price AI",

        mySales: "My Sales",
        totalProducts: "Total Products",
        activeListings: "Active Listings",
        myProducts: "My Products",
        productCount: "products",
        noProducts: "No products yet",
        noProductsDesc: "Record a video to add your first product!",
        recordVideo: "Record Video",
        active: "Active",
        sold: "Sold",
        soldItems: "Sold Items",
        noSalesYet: "No sales yet",
        noSalesDesc: "Your products will appear here once sold.",

        profileTitle: "Profile",
        location: "Location",
        craft: "Craft",
        experience: "Experience",
        contact: "Contact",
        about: "About",
        tapChangePhoto: "Tap to change profile photo",
        uploadPhoto: "Change Photo",
        uploading: "Uploading...",

        priceEstimatorTitle: "AI Price Estimator",
        priceEstimatorDesc: "Get a fair market price for your craft",
        productName: "Product Name",
        productNamePlaceholder: "e.g. Madhubani Painting, Terracotta Pot...",
        materialCost: "Material Cost (₹)",
        materialCostPlaceholder: "e.g. 200",
        hoursSpent: "Hours Spent Making It",
        hoursSpentPlaceholder: "e.g. 5",
        getMarketEstimate: "Get Market Estimate",
        analyzingMarket: "Analyzing market data...",
        suggestedPrice: "Suggested Market Price",
        aiReasoning: "AI Reasoning",
        material: "Material",
        labor: "Labor",
        avgProfit: "Avg Profit",
        estimationFailed: "Estimation Failed",
        fillAllFields: "Please fill in all fields to get an estimate.",

        startRecording: "Start Recording",
        stopRecording: "Stop Recording",
        recordingInProgress: "Recording in progress...",
        uploadingVideo: "Uploading video...",
        transcribing: "Transcribing...",
        processing: "Processing...",

        reviewListing: "Review Listing",
        publish: "Publish",
        publishing: "Publishing...",
        editDetails: "Edit Details",
        price: "Price",
        description: "Description",
    },

    hi: {
        appName: "कलासेतु",
        welcome: "स्वागत है",
        home: "होम",
        profile: "प्रोफ़ाइल",
        sales: "बिक्री",
        record: "रिकॉर्ड",
        logout: "लॉग आउट",
        changePhoto: "फोटो बदलें",
        back: "वापस",
        loading: "लोड हो रहा है...",
        noData: "कोई डेटा नहीं",
        save: "सहेजें",
        cancel: "रद्द करें",
        submit: "जमा करें",

        goodMorning: "सुप्रभात",
        goodAfternoon: "नमस्ते",
        goodEvening: "शुभ संध्या",

        thisMonth: "इस महीने",
        products: "उत्पाद",
        rating: "रेटिंग",
        quickActions: "त्वरित कार्य",
        sellNewItem: "नया सामान बेचें",
        recordVideoSell: "वीडियो रिकॉर्ड करें और बेचें",
        manualListing: "हाथ से लिखें",
        manualListingDesc: "मैन्युअल लिस्टिंग",
        priceEstimator: "मूल्य अनुमान",
        aiPriceEstimate: "AI मूल्य अनुमान",
        viewSales: "मेरी बिक्री देखें",
        viewAllProducts: "सभी उत्पाद और बिक्री देखें",
        priceAI: "AI मूल्य",

        mySales: "मेरी बिक्री",
        totalProducts: "कुल सामान",
        activeListings: "सक्रिय लिस्टिंग",
        myProducts: "मेरे उत्पाद",
        productCount: "उत्पाद",
        noProducts: "कोई उत्पाद नहीं",
        noProductsDesc: "अपना पहला उत्पाद जोड़ने के लिए वीडियो रिकॉर्ड करें!",
        recordVideo: "वीडियो रिकॉर्ड करें",
        active: "सक्रिय",
        sold: "बिक गया",
        soldItems: "बिके हुए सामान",
        noSalesYet: "अभी तक कोई बिक्री नहीं",
        noSalesDesc: "बिकने पर आपके उत्पाद यहाँ दिखेंगे।",

        profileTitle: "प्रोफ़ाइल",
        location: "स्थान",
        craft: "कला",
        experience: "अनुभव",
        contact: "संपर्क जानकारी",
        about: "परिचय",
        tapChangePhoto: "प्रोफ़ाइल फ़ोटो बदलने के लिए टैप करें",
        uploadPhoto: "फ़ोटो बदलें",
        uploading: "अपलोड हो रहा है...",

        priceEstimatorTitle: "AI मूल्य अनुमानक",
        priceEstimatorDesc: "अपनी कला के लिए उचित बाजार मूल्य जानें",
        productName: "उत्पाद का नाम",
        productNamePlaceholder: "जैसे मधुबनी पेंटिंग, टेराकोटा पॉट...",
        materialCost: "सामग्री लागत (₹)",
        materialCostPlaceholder: "जैसे 200",
        hoursSpent: "बनाने में लगा समय (घंटे)",
        hoursSpentPlaceholder: "जैसे 5",
        getMarketEstimate: "बाजार अनुमान प्राप्त करें",
        analyzingMarket: "बाजार डेटा विश्लेषण कर रहे हैं...",
        suggestedPrice: "सुझावित बाजार मूल्य",
        aiReasoning: "AI तर्क",
        material: "सामग्री",
        labor: "श्रम",
        avgProfit: "औसत लाभ",
        estimationFailed: "अनुमान विफल",
        fillAllFields: "अनुमान के लिए सभी फ़ील्ड भरें।",

        startRecording: "रिकॉर्डिंग शुरू करें",
        stopRecording: "रिकॉर्डिंग बंद करें",
        recordingInProgress: "रिकॉर्डिंग चल रही है...",
        uploadingVideo: "वीडियो अपलोड हो रहा है...",
        transcribing: "लिप्यंतरण हो रहा है...",
        processing: "प्रोसेसिंग...",

        reviewListing: "लिस्टिंग समीक्षा",
        publish: "प्रकाशित करें",
        publishing: "प्रकाशित हो रहा है...",
        editDetails: "विवरण संपादित करें",
        price: "मूल्य",
        description: "विवरण",
    },

    ta: {
        appName: "கலாசேது",
        welcome: "வரவேற்கிறோம்",
        home: "முகப்பு",
        profile: "சுயவிவரம்",
        sales: "விற்பனை",
        record: "பதிவு",
        logout: "வெளியேறு",
        changePhoto: "புகைப்படம் மாற்று",
        back: "பின்",
        loading: "ஏற்றுகிறது...",
        noData: "தரவு இல்லை",
        save: "சேமி",
        cancel: "ரத்து",
        submit: "சமர்ப்பி",

        goodMorning: "காலை வணக்கம்",
        goodAfternoon: "வணக்கம்",
        goodEvening: "மாலை வணக்கம்",

        thisMonth: "இந்த மாதம்",
        products: "பொருட்கள்",
        rating: "மதிப்பீடு",
        quickActions: "விரைவு செயல்கள்",
        sellNewItem: "புதிய பொருள் விற்க",
        recordVideoSell: "வீடியோ பதிவு செய்து விற்கவும்",
        manualListing: "கைமுறை பட்டியல்",
        manualListingDesc: "கையால் எழுதுங்கள்",
        priceEstimator: "விலை மதிப்பீடு",
        aiPriceEstimate: "AI விலை மதிப்பீடு",
        viewSales: "விற்பனை பார்க்க",
        viewAllProducts: "அனைத்து பொருட்களையும் பார்க்கவும்",
        priceAI: "AI விலை",

        mySales: "எனது விற்பனை",
        totalProducts: "மொத்த பொருட்கள்",
        activeListings: "செயலில் உள்ள பட்டியல்",
        myProducts: "எனது பொருட்கள்",
        productCount: "பொருட்கள்",
        noProducts: "பொருட்கள் இல்லை",
        noProductsDesc: "முதல் பொருளைச் சேர்க்க வீடியோ பதிவு செய்யுங்கள்!",
        recordVideo: "வீடியோ பதிவு",
        active: "செயலில்",
        sold: "விற்கப்பட்டது",
        soldItems: "விற்கப்பட்ட பொருட்கள்",
        noSalesYet: "இன்னும் விற்பனை இல்லை",
        noSalesDesc: "விற்கப்பட்டால் உங்கள் பொருட்கள் இங்கே தோன்றும்.",

        profileTitle: "சுயவிவரம்",
        location: "இடம்",
        craft: "கை வேலை",
        experience: "அனுபவம்",
        contact: "தொடர்பு",
        about: "பற்றி",
        tapChangePhoto: "புகைப்படத்தை மாற்ற தட்டவும்",
        uploadPhoto: "புகைப்படம் மாற்று",
        uploading: "பதிவேற்றுகிறது...",

        priceEstimatorTitle: "AI விலை மதிப்பீட்டாளர்",
        priceEstimatorDesc: "உங்கள் கைவினைப்பொருளுக்கு நியாயமான விலை அறியுங்கள்",
        productName: "பொருளின் பெயர்",
        productNamePlaceholder: "எ.கா. மதுபனி ஓவியம்...",
        materialCost: "பொருள் செலவு (₹)",
        materialCostPlaceholder: "எ.கா. 200",
        hoursSpent: "செய்ய எடுத்த நேரம் (மணி)",
        hoursSpentPlaceholder: "எ.கா. 5",
        getMarketEstimate: "சந்தை மதிப்பீடு பெறுக",
        analyzingMarket: "சந்தை தரவு ஆய்வு...",
        suggestedPrice: "பரிந்துரைக்கப்பட்ட விலை",
        aiReasoning: "AI காரணம்",
        material: "பொருள்",
        labor: "உழைப்பு",
        avgProfit: "சராசரி லாபம்",
        estimationFailed: "மதிப்பீடு தோல்வி",
        fillAllFields: "அனைத்து புலங்களையும் நிரப்பவும்.",

        startRecording: "பதிவு தொடங்கு",
        stopRecording: "பதிவு நிறுத்து",
        recordingInProgress: "பதிவு நடக்கிறது...",
        uploadingVideo: "வீடியோ பதிவேற்றம்...",
        transcribing: "எழுத்துப்பெயர்ப்பு...",
        processing: "செயலாக்கம்...",

        reviewListing: "பட்டியல் மதிப்பாய்வு",
        publish: "வெளியிடு",
        publishing: "வெளியிடுகிறது...",
        editDetails: "விவரங்களை திருத்து",
        price: "விலை",
        description: "விவரம்",
    },

    bn: {
        appName: "কলাসেতু",
        welcome: "স্বাগতম",
        home: "হোম",
        profile: "প্রোফাইল",
        sales: "বিক্রয়",
        record: "রেকর্ড",
        logout: "লগ আউট",
        changePhoto: "ছবি বদলান",
        back: "পিছনে",
        loading: "লোড হচ্ছে...",
        noData: "কোনো তথ্য নেই",
        save: "সংরক্ষণ",
        cancel: "বাতিল",
        submit: "জমা দিন",

        goodMorning: "সুপ্রভাত",
        goodAfternoon: "নমস্কার",
        goodEvening: "শুভ সন্ধ্যা",

        thisMonth: "এই মাসে",
        products: "পণ্য",
        rating: "রেটিং",
        quickActions: "দ্রুত কার্যকলাপ",
        sellNewItem: "নতুন জিনিস বিক্রি করুন",
        recordVideoSell: "ভিডিও রেকর্ড করে বিক্রি করুন",
        manualListing: "হাতে লিখুন",
        manualListingDesc: "ম্যানুয়াল লিস্টিং",
        priceEstimator: "মূল্য অনুমান",
        aiPriceEstimate: "AI মূল্য অনুমান",
        viewSales: "বিক্রি দেখুন",
        viewAllProducts: "সমস্ত পণ্য ও বিক্রি দেখুন",
        priceAI: "AI মূল্য",

        mySales: "আমার বিক্রি",
        totalProducts: "মোট পণ্য",
        activeListings: "সক্রিয় তালিকা",
        myProducts: "আমার পণ্য",
        productCount: "পণ্য",
        noProducts: "কোনো পণ্য নেই",
        noProductsDesc: "প্রথম পণ্য যোগ করতে ভিডিও রেকর্ড করুন!",
        recordVideo: "ভিডিও রেকর্ড",
        active: "সক্রিয়",
        sold: "বিক্রিত",
        soldItems: "বিক্রিত পণ্য",
        noSalesYet: "এখনো কোনো বিক্রি হয়নি",
        noSalesDesc: "বিক্রি হলে আপনার পণ্য এখানে দেখা যাবে।",

        profileTitle: "প্রোফাইল",
        location: "অবস্থান",
        craft: "শিল্প",
        experience: "অভিজ্ঞতা",
        contact: "যোগাযোগ",
        about: "পরিচিতি",
        tapChangePhoto: "প্রোফাইল ছবি বদলাতে ট্যাপ করুন",
        uploadPhoto: "ছবি বদলান",
        uploading: "আপলোড হচ্ছে...",

        priceEstimatorTitle: "AI মূল্য অনুমানকারী",
        priceEstimatorDesc: "আপনার শিল্পের জন্য ন্যায্য বাজার মূল্য জানুন",
        productName: "পণ্যের নাম",
        productNamePlaceholder: "যেমন মধুবনী পেইন্টিং...",
        materialCost: "উপকরণ খরচ (₹)",
        materialCostPlaceholder: "যেমন ২০০",
        hoursSpent: "তৈরি করতে সময় (ঘণ্টা)",
        hoursSpentPlaceholder: "যেমন ৫",
        getMarketEstimate: "বাজার অনুমান পান",
        analyzingMarket: "বাজার তথ্য বিশ্লেষণ...",
        suggestedPrice: "প্রস্তাবিত বাজার মূল্য",
        aiReasoning: "AI যুক্তি",
        material: "উপকরণ",
        labor: "শ্রম",
        avgProfit: "গড় লাভ",
        estimationFailed: "অনুমান ব্যর্থ",
        fillAllFields: "অনুমানের জন্য সব ক্ষেত্র পূরণ করুন।",

        startRecording: "রেকর্ডিং শুরু",
        stopRecording: "রেকর্ডিং বন্ধ",
        recordingInProgress: "রেকর্ডিং চলছে...",
        uploadingVideo: "ভিডিও আপলোড হচ্ছে...",
        transcribing: "প্রতিলিপি করা হচ্ছে...",
        processing: "প্রক্রিয়াকরণ...",

        reviewListing: "তালিকা পর্যালোচনা",
        publish: "প্রকাশ করুন",
        publishing: "প্রকাশ হচ্ছে...",
        editDetails: "বিবরণ সম্পাদনা",
        price: "মূল্য",
        description: "বিবরণ",
    },

    mr: {
        appName: "कलासेतू",
        welcome: "स्वागत आहे",
        home: "मुख्यपृष्ठ",
        profile: "प्रोफाइल",
        sales: "विक्री",
        record: "रेकॉर्ड",
        logout: "बाहेर पडा",
        changePhoto: "फोटो बदला",
        back: "मागे",
        loading: "लोड होत आहे...",
        noData: "माहिती नाही",
        save: "जतन करा",
        cancel: "रद्द करा",
        submit: "सबमिट करा",

        goodMorning: "सुप्रभात",
        goodAfternoon: "नमस्कार",
        goodEvening: "शुभ संध्याकाळ",

        thisMonth: "या महिन्यात",
        products: "उत्पादने",
        rating: "रेटिंग",
        quickActions: "जलद कृती",
        sellNewItem: "नवीन वस्तू विका",
        recordVideoSell: "व्हिडिओ रेकॉर्ड करा आणि विका",
        manualListing: "हाताने लिहा",
        manualListingDesc: "मॅन्युअल लिस्टिंग",
        priceEstimator: "किंमत अंदाज",
        aiPriceEstimate: "AI किंमत अंदाज",
        viewSales: "माझी विक्री पहा",
        viewAllProducts: "सर्व उत्पादने आणि विक्री पहा",
        priceAI: "AI किंमत",

        mySales: "माझी विक्री",
        totalProducts: "एकूण उत्पादने",
        activeListings: "सक्रिय लिस्टिंग",
        myProducts: "माझी उत्पादने",
        productCount: "उत्पादने",
        noProducts: "उत्पादने नाहीत",
        noProductsDesc: "पहिले उत्पादन जोडण्यासाठी व्हिडिओ रेकॉर्ड करा!",
        recordVideo: "व्हिडिओ रेकॉर्ड",
        active: "सक्रिय",
        sold: "विकले",
        soldItems: "विकलेले सामान",
        noSalesYet: "अजून विक्री नाही",
        noSalesDesc: "विकल्यावर तुमची उत्पादने इथे दिसतील.",

        profileTitle: "प्रोफाइल",
        location: "स्थान",
        craft: "कला",
        experience: "अनुभव",
        contact: "संपर्क",
        about: "माहिती",
        tapChangePhoto: "प्रोफाइल फोटो बदलण्यासाठी टॅप करा",
        uploadPhoto: "फोटो बदला",
        uploading: "अपलोड होत आहे...",

        priceEstimatorTitle: "AI किंमत अंदाजक",
        priceEstimatorDesc: "तुमच्या कलेसाठी योग्य बाजारभाव जाणा",
        productName: "उत्पादनाचे नाव",
        productNamePlaceholder: "उदा. मधुबनी चित्र...",
        materialCost: "सामग्री खर्च (₹)",
        materialCostPlaceholder: "उदा. 200",
        hoursSpent: "बनवण्यासाठी लागलेला वेळ (तास)",
        hoursSpentPlaceholder: "उदा. 5",
        getMarketEstimate: "बाजार अंदाज मिळवा",
        analyzingMarket: "बाजार डेटा विश्लेषण...",
        suggestedPrice: "सुचवलेली बाजार किंमत",
        aiReasoning: "AI तर्क",
        material: "सामग्री",
        labor: "श्रम",
        avgProfit: "सरासरी नफा",
        estimationFailed: "अंदाज अयशस्वी",
        fillAllFields: "अंदाजासाठी सर्व फील्ड भरा.",

        startRecording: "रेकॉर्डिंग सुरू करा",
        stopRecording: "रेकॉर्डिंग थांबवा",
        recordingInProgress: "रेकॉर्डिंग सुरू आहे...",
        uploadingVideo: "व्हिडिओ अपलोड होत आहे...",
        transcribing: "लिप्यंतरण होत आहे...",
        processing: "प्रक्रिया सुरू आहे...",

        reviewListing: "लिस्टिंग पुनरावलोकन",
        publish: "प्रकाशित करा",
        publishing: "प्रकाशित होत आहे...",
        editDetails: "तपशील संपादित करा",
        price: "किंमत",
        description: "वर्णन",
    },

    te: {
        appName: "కలాసేతు",
        welcome: "స్వాగతం",
        home: "హోమ్",
        profile: "ప్రొఫైల్",
        sales: "అమ్మకాలు",
        record: "రికార్డ్",
        logout: "లాగ్ అవుట్",
        changePhoto: "ఫోటో మార్చు",
        back: "వెనుకకు",
        loading: "లోడ్ అవుతోంది...",
        noData: "డేటా లేదు",
        save: "సేవ్",
        cancel: "రద్దు",
        submit: "సబ్మిట్",

        goodMorning: "శుభోదయం",
        goodAfternoon: "నమస్కారం",
        goodEvening: "శుభ సాయంత్రం",

        thisMonth: "ఈ నెల",
        products: "ఉత్పత్తులు",
        rating: "రేటింగ్",
        quickActions: "త్వరిత చర్యలు",
        sellNewItem: "కొత్త వస్తువు అమ్మండి",
        recordVideoSell: "వీడియో రికార్డ్ చేసి అమ్మండి",
        manualListing: "చేతితో రాయండి",
        manualListingDesc: "మాన్యువల్ లిస్టింగ్",
        priceEstimator: "ధర అంచనా",
        aiPriceEstimate: "AI ధర అంచనా",
        viewSales: "అమ్మకాలు చూడండి",
        viewAllProducts: "అన్ని ఉత్పత్తులు & అమ్మకాలు చూడండి",
        priceAI: "AI ధర",

        mySales: "నా అమ్మకాలు",
        totalProducts: "మొత్తం ఉత్పత్తులు",
        activeListings: "యాక్టివ్ లిస్టింగ్",
        myProducts: "నా ఉత్పత్తులు",
        productCount: "ఉత్పత్తులు",
        noProducts: "ఉత్పత్తులు లేవు",
        noProductsDesc: "మొదటి ఉత్పత్తిని జోడించడానికి వీడియో రికార్డ్ చేయండి!",
        recordVideo: "వీడియో రికార్డ్",
        active: "యాక్టివ్",
        sold: "అమ్మబడింది",
        soldItems: "అమ్మబడిన వస్తువులు",
        noSalesYet: "ఇంకా అమ్మకాలు లేవు",
        noSalesDesc: "అమ్మబడినప్పుడు మీ ఉత్పత్తులు ఇక్కడ కనిపిస్తాయి.",

        profileTitle: "ప్రొఫైల్",
        location: "ప్రదేశం",
        craft: "కళ",
        experience: "అనుభవం",
        contact: "సంప్రదించు",
        about: "గురించి",
        tapChangePhoto: "ప్రొఫైల్ ఫోటో మార్చడానికి ట్యాప్ చేయండి",
        uploadPhoto: "ఫోటో మార్చు",
        uploading: "అప్‌లోడ్ అవుతోంది...",

        priceEstimatorTitle: "AI ధర అంచనాదారుడు",
        priceEstimatorDesc: "మీ కళకు సరసమైన మార్కెట్ ధర తెలుసుకోండి",
        productName: "ఉత్పత్తి పేరు",
        productNamePlaceholder: "ఉదా. మధుబని పెయింటింగ్...",
        materialCost: "సామగ్రి ఖర్చు (₹)",
        materialCostPlaceholder: "ఉదా. 200",
        hoursSpent: "తయారు చేయడానికి సమయం (గంటలు)",
        hoursSpentPlaceholder: "ఉదా. 5",
        getMarketEstimate: "మార్కెట్ అంచనా పొందండి",
        analyzingMarket: "మార్కెట్ డేటా విశ్లేషణ...",
        suggestedPrice: "సూచించిన మార్కెట్ ధర",
        aiReasoning: "AI తర్కం",
        material: "సామగ్రి",
        labor: "శ్రమ",
        avgProfit: "సగటు లాభం",
        estimationFailed: "అంచనా విఫలమైంది",
        fillAllFields: "అంచనా కోసం అన్ని ఫీల్డ్‌లను నింపండి.",

        startRecording: "రికార్డింగ్ ప్రారంభించు",
        stopRecording: "రికార్డింగ్ ఆపు",
        recordingInProgress: "రికార్డింగ్ జరుగుతోంది...",
        uploadingVideo: "వీడియో అప్‌లోడ్...",
        transcribing: "ట్రాన్స్‌క్రిప్షన్...",
        processing: "ప్రాసెసింగ్...",

        reviewListing: "లిస్టింగ్ సమీక్ష",
        publish: "ప్రచురించు",
        publishing: "ప్రచురిస్తోంది...",
        editDetails: "వివరాలు సవరించు",
        price: "ధర",
        description: "వివరణ",
    },
};

// Context
interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType>({
    language: "hi",
    setLanguage: () => { },
    t: translations.hi,
});

// Provider
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem("kalasetu_lang");
        return (saved as Language) || "hi";
    });

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("kalasetu_lang", lang);
    }, []);

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Hook
export const useLanguage = () => useContext(LanguageContext);
