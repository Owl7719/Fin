import { ifAuthenticated, ifNotAuthenticated } from "./middleware.js";

// TEMPLATES
import Auth from "@/views/layouts/AuthPage.vue"; // Styled template with only auth access
import Guest from "@/views/layouts/GuestPage.vue"; // Styled template with only guest access
import Global from "@/views/layouts/GlobalPage.vue"; // Styled template with global access
import MultiLayout from "@/views/layouts/MultiLayout";

import AuthRoutes from "./auth-routes"; // All routes to inject into Auth template
import GuestRoutes from "./guest-routes"; // All routes to inject into Guest template
import MultiLayoutRoutes from "./multi-layout-routes"; // All routes to inject into Empty template
import BookingRoutes from "./booking-routes.js"; // All booking routes

// HTTP CODES ROUTES
import HttpCodesRoutes from "./routes/http-codes-routes";
import Booking from "@/views/layouts/BookingPage.vue";

export default [
  // With this is fixed a router-view template problem.
  { path: "/", redirect: "/login" },
  // Guest routes template WITH style - only if the user is unauthenticated
  {
    path: "/guest",
    name: "guest",
    component: Guest,
    beforeEnter: ifNotAuthenticated,
    children: GuestRoutes,
  },
  // Auth routes template WITH style - only if the user is authenticated
  {
    path: "/auth",
    name: "auth",
    component: Auth,
    beforeEnter: ifAuthenticated,
    children: AuthRoutes,
  },
  // Global routes template WITH style - the user can access these routes authenticated or not
  {
    path: "/global",
    name: "global",
    component: Global,
  },
  // These routes can be viewed with different layouts
  {
    path: "/multi-layout",
    name: "multi-layout",
    component: MultiLayout,
    children: MultiLayoutRoutes,
  },
  // Global routes template WITHOUT style - the user can access these routes authenticated or not
  {
    path: "/booking-layout",
    name: "booking-layout",
    component: Booking,
    children: BookingRoutes,
  },
].concat([], HttpCodesRoutes);
