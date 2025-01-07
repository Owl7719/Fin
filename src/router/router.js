import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import authWithTokenIfPresent from "./guards/auth-with-token";
import {
  checkWhetherProfileComplete,
  showTermsDialogIfNeeded,
} from "./guards/check-profile-complete";
import redirectAfterAuth from "./guards/redirect-after-auth";
import bootstrapIfNeeded from "./guards/bootstrap-if-needed";
import checkPending1ClickBooking from "./guards/pending-one-click-booking";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(authWithTokenIfPresent);
router.beforeEach(checkPending1ClickBooking);
router.beforeEach(checkWhetherProfileComplete);
router.beforeEach(redirectAfterAuth);
router.beforeEach(bootstrapIfNeeded);

router.beforeEach(showTermsDialogIfNeeded);
router.afterEach(showTermsDialogIfNeeded);

export default router;
