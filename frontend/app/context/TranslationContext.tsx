// app/context/TranslationContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface TranslationContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  availableLanguages: { code: string; label: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  en: {
    langZone: "LangZone",
    footerDescription: "Bridging language barriers and connecting cultures through innovative learning solutions.",
    learn: "Learn",
    learningGuides: "Learning Guides",
    courses: "Courses",
    resources: "Resources",
    practiceExercises: "Practice Exercises",
    company: "Company",
    aboutUs: "About Us",
    careers: "Careers",
    blog: "Blog",
    sitemap: "Sitemap",
    support: "Support",
    faq: "FAQ",
    contactUs: "Contact Us",
    helpCenter: "Help Center",
    termsOfService: "Terms of Service",
    privacyPolicy: "Privacy Policy",
    stayUpdated: "Stay Updated",
    subscribeNewsletter: "Subscribe to our newsletter for language learning tips.",
    yourEmail: "Your email",
    subscribe: "Subscribe",
    findInstructors: "Find Instructors",
    becomeInstructor: "Become an Instructor",
    menu: "Menu",
  },
  sn: {
    langZone: "LangZone",
    footerDescription: "Kubatanidza mitauro uye kubatanidza tsika kuburikidza nedzidzo inovandudza.",
    learn: "Dzidza",
    learningGuides: "Madzidzisiro Ekudzidza",
    courses: "Makosi",
    resources: "Zvishandiso",
    practiceExercises: "Maitiro Ekudzidzira",
    company: "Kambani",
    aboutUs: "Nezvedu",
    careers: "Mabasa",
    blog: "Bhurogu",
    sitemap: "Saiti Mepu",
    support: "Rubatsiro",
    faq: "Mibvunzo Inowanzo Bvunzwa",
    contactUs: "Taura Nesu",
    helpCenter: "Nzvimbo Yekubatsira",
    termsOfService: "Mitemo Yebasa",
    privacyPolicy: "Mutemo Wevanzvimbo",
    stayUpdated: "Ramba Uchiziviswa",
    subscribeNewsletter: "Nyoresa kune tsamba yedu yezano rekudzidza mitauro.",
    yourEmail: "Imeyili yako",
    subscribe: "Nyoresa",
    findInstructors: "Tsvaga Vadzidzisi",
    becomeInstructor: "Iva Mudzidzisi",
    menu: "Menyu",
  },
  fr: {
    langZone: "LangZone",
    footerDescription: "Briser les barrières linguistiques et connecter les cultures grâce à l'apprentissage innovant.",
    learn: "Apprendre",
    learningGuides: "Guides d'apprentissage",
    courses: "Cours",
    resources: "Ressources",
    practiceExercises: "Exercices pratiques",
    company: "Entreprise",
    aboutUs: "À propos de nous",
    careers: "Carrières",
    blog: "Blog",
    sitemap: "Plan du site",
    support: "Support",
    faq: "FAQ",
    contactUs: "Contactez-nous",
    helpCenter: "Centre d'aide",
    termsOfService: "Conditions d'utilisation",
    privacyPolicy: "Politique de confidentialité",
    stayUpdated: "Restez informé",
    subscribeNewsletter: "Abonnez-vous à notre newsletter pour des conseils d'apprentissage des langues.",
    yourEmail: "Votre email",
    subscribe: "S'abonner",
    findInstructors: "Trouver des instructeurs",
    becomeInstructor: "Devenir instructeur",
    menu: "Menu",
  },
  es: {
    langZone: "LangZone",
    footerDescription: "Rompiendo barreras lingüísticas y conectando culturas a través del aprendizaje innovador.",
    learn: "Aprender",
    learningGuides: "Guías de aprendizaje",
    courses: "Cursos",
    resources: "Recursos",
    practiceExercises: "Ejercicios prácticos",
    company: "Empresa",
    aboutUs: "Sobre nosotros",
    careers: "Carreras",
    blog: "Blog",
    sitemap: "Mapa del sitio",
    support: "Soporte",
    faq: "Preguntas frecuentes",
    contactUs: "Contáctanos",
    helpCenter: "Centro de ayuda",
    termsOfService: "Términos de servicio",
    privacyPolicy: "Política de privacidad",
    stayUpdated: "Mantente informado",
    subscribeNewsletter: "Suscríbete a nuestro boletín para consejos de aprendizaje de idiomas.",
    yourEmail: "Tu correo electrónico",
    subscribe: "Suscribirse",
    findInstructors: "Encontrar instructores",
    becomeInstructor: "Conviértete en instructor",
    menu: "Menú",
  },
  de: {
    langZone: "LangZone",
    footerDescription: "Überwindung von Sprachbarrieren und Verbindung von Kulturen durch innovatives Lernen.",
    learn: "Lernen",
    learningGuides: "Lernanleitungen",
    courses: "Kurse",
    resources: "Ressourcen",
    practiceExercises: "Übungsaufgaben",
    company: "Unternehmen",
    aboutUs: "Über uns",
    careers: "Karriere",
    blog: "Blog",
    sitemap: "Seitenübersicht",
    support: "Unterstützung",
    faq: "FAQ",
    contactUs: "Kontakt",
    helpCenter: "Hilfezentrum",
    termsOfService: "Nutzungsbedingungen",
    privacyPolicy: "Datenschutzrichtlinie",
    stayUpdated: "Bleiben Sie auf dem Laufenden",
    subscribeNewsletter: "Abonnieren Sie unseren Newsletter für Tipps zum Sprachenlernen.",
    yourEmail: "Deine E-Mail",
    subscribe: "Abonnieren",
    findInstructors: "Instruktoren finden",
    becomeInstructor: "Instruktor werden",
    menu: "Menü",
  },
  pt: {
    langZone: "LangZone",
    footerDescription: "Superando barreiras linguísticas e conectando culturas através de aprendizado inovador.",
    learn: "Aprender",
    learningGuides: "Guias de Aprendizagem",
    courses: "Cursos",
    resources: "Recursos",
    practiceExercises: "Exercícios Práticos",
    company: "Empresa",
    aboutUs: "Sobre nós",
    careers: "Carreiras",
    blog: "Blog",
    sitemap: "Mapa do site",
    support: "Suporte",
    faq: "Perguntas frequentes",
    contactUs: "Contate-nos",
    helpCenter: "Centro de ajuda",
    termsOfService: "Termos de serviço",
    privacyPolicy: "Política de privacidade",
    stayUpdated: "Fique Atualizado",
    subscribeNewsletter: "Inscreva-se na nossa newsletter para dicas de aprendizado de idiomas.",
    yourEmail: "Seu e-mail",
    subscribe: "Inscrever-se",
    findInstructors: "Encontrar instrutores",
    becomeInstructor: "Torne-se instrutor",
    menu: "Menu",
  },
  zh: {
    langZone: "LangZone",
    footerDescription: "通过创新学习解决方案打破语言障碍并连接文化。",
    learn: "学习",
    learningGuides: "学习指南",
    courses: "课程",
    resources: "资源",
    practiceExercises: "练习题",
    company: "公司",
    aboutUs: "关于我们",
    careers: "职业",
    blog: "博客",
    sitemap: "网站地图",
    support: "支持",
    faq: "常见问题",
    contactUs: "联系我们",
    helpCenter: "帮助中心",
    termsOfService: "服务条款",
    privacyPolicy: "隐私政策",
    stayUpdated: "保持更新",
    subscribeNewsletter: "订阅我们的新闻通讯以获取语言学习技巧。",
    yourEmail: "你的邮箱",
    subscribe: "订阅",
    findInstructors: "寻找讲师",
    becomeInstructor: "成为讲师",
    menu: "菜单",
  },
};

const availableLanguages = [
  { code: "en", label: "English" },
  { code: "sn", label: "Shona" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Chinese" },
];

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: string) => {
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang: handleSetLang, t, availableLanguages }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslation must be used within a TranslationProvider");
  return context;
}
