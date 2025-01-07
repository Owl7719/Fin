import MenuCustomizationView from "@/views/menu/MenuCustomizationView.vue";
import CustomizationPage from "@/views/menu/CustomizationPage.vue";
import DashboardCustomizationView from "@/views/menu/DashboardCustomizationView.vue";
import { authorize, isAnyAdmin, isCorporate, or } from "@/router/middleware";

const isAnyAdminOrCorporate = or(isAnyAdmin, isCorporate);

export default [
  {
    path: "/customization",
    name: "customization",
    component: CustomizationPage,
    children: [
      {
        path: "menu",
        name: "menu-customization",
        beforeEnter: authorize(isAnyAdminOrCorporate),
        component: MenuCustomizationView,
        meta: {
          title: "Menu customization",
        },
      },
      {
        path: "dashboard",
        name: "dashboard-customization",
        beforeEnter: authorize(isCorporate),
        component: DashboardCustomizationView,
        meta: {
          title: "Dashboard customization",
        },
      },
    ],
  },
];
