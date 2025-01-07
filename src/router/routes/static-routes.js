export default [
  {
    path: "/about",
    name: "About",
    meta: {
      title: "About",
    },
    component: () => import("@/views/static-pages/AboutPage.vue"),
  },
  {
    path: "/help",
    name: "Help",
    meta: {
      title: "Help/Support",
    },
    component: () => import("@/views/static-pages/HelpPage.vue"),
  },
  {
    path: "/terms-of-use",
    name: "Terms Of Use",
    meta: {
      title: "Terms of use",
    },
    component: () => import("@/views/terms/TermsOfUse.vue"),
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
    meta: {
      title: "Privacy policy",
    },
    component: () => import("@/views/terms/PrivacyPolicy.vue"),
  },
  {
    path: "/imprint-and-disclaimer",
    name: "Imprint and Disclaimer",
    meta: {
      title: "Imprint and disclaimer",
    },
    component: () => import("@/views/static-pages/ImprintAndDisclaimer.vue"),
  },
];
