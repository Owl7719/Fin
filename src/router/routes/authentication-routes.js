import CheckEmail from "@/views/authentication/CheckEmail.vue";
import Unsubscribe from "@/views/global/UnsubscribePage.vue";
import RegisterCorporate from "@/views/authentication/RegisterCorporate";
import LoginMethod from "@/views/authentication/LoginMethod.vue";
import LoginMagicLink from "@/views/authentication/LoginMagicLink.vue";
import LoginPassword from "@/views/authentication/LoginPassword.vue";
import RegisterInvestor from "@/views/authentication/RegisterInvestor.vue";
import TwoFactorChallenge from "@/views/authentication/TwoFactorChallenge.vue";
import SetPassword from "@/views/authentication/SetPassword.vue";
import ForgotPassword from "@/views/authentication/ForgotPassword.vue";

export default [
  {
    path: "/login",
    component: LoginMethod,
    name: "login",
  },
  {
    path: "/login-magic-link",
    component: LoginMagicLink,
    name: "login-magic-link",
  },
  {
    path: "/login-password",
    component: LoginPassword,
    name: "login-password",
  },
  {
    path: "/login-two-factor-challenge",
    component: TwoFactorChallenge,
    name: "login-two-factor-challenge",
  },
  {
    path: "/check-email",
    component: CheckEmail,
    name: "check-email",
    meta: {
      title: "Check email",
    },
  },
  {
    path: "/password/email",
    component: ForgotPassword,
    name: "password-reset-email",
    meta: {
      title: "Forgot password",
    },
  },
  {
    path: "/password/reset",
    component: SetPassword,
    name: "reset-password",
    meta: {
      title: "Reset password",
    },
  },
  {
    path: "/register",
    component: RegisterInvestor,
    name: "register",
    meta: {
      title: "Register",
    },
  },
  {
    path: "/register/corporate",
    component: RegisterCorporate,
    name: "register-corporate",
    meta: {
      title: "Register",
    },
  },
  {
    path: "/unsubscribe",
    name: "unsubscribe",
    component: Unsubscribe,
    meta: {
      title: "Unsubscribe",
    },
  },
];
