import Dashboard from "@/views/dashboard/DashboardPage.vue";
import {
  authorize,
  isCorporate,
  isSuperAdmin,
  isAdminSupport,
  //isInvestor,
  or,
  and,
  can,
} from "@/router/middleware";

const canAccessDashboard = or(
  isSuperAdmin,
  and(isAdminSupport, can("dashboard")),
  and(isCorporate, can("dashboard"))
  //isInvestor
);

export default [
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    beforeEnter: authorize(canAccessDashboard),
    meta: {
      title: "Dashboard",
    },
  },
];
