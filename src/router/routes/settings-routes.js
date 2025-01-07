import GeneralSettings from "@/views/settings/GeneralSettings";
import FeedbackSettings from "@/views/settings/FeedbackSettings";
import RouterView from "@/views/layouts/RouterView";
import { and, authorize, can, isAdmin, isSuperAdmin, or } from "../middleware";
import SixSettings from "@/views/settings/SixSettings";
const canManageSixSettings = or(isSuperAdmin, and(isAdmin, can("manage_six_settings")));

export default [
  {
    path: "/settings",
    meta: {
      breadcrumb: "Settings",
    },
    component: RouterView,
    children: [
      {
        path: "general",
        name: "general-settings",
        beforeEnter: authorize(isSuperAdmin),
        component: GeneralSettings,
        meta: {
          title: "General settings",
        },
      },
      {
        path: "feedback",
        name: "feedback-settings",
        beforeEnter: authorize(isSuperAdmin),
        component: FeedbackSettings,
        meta: {
          title: "Feedback settings",
        },
      },
      {
        path: "six",
        name: "manage-six-settings",
        beforeEnter: authorize(canManageSixSettings),
        component: SixSettings,
        meta: {
          title: "SIX settings",
        },
      },
    ],
  },
];
