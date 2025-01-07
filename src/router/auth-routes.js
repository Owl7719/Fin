import dashboard from "./routes/dashboard.js";
import managementRoutes from "./routes/management-routes.js";
import companyRoutes from "./routes/company-routes.js";
import eventRoutes from "./routes/event-routes.js";
import singleCompanyEventRoutes from "./routes/single-company-events-routes.js";
import logs from "./routes/log-routes.js";
import serviceCenterRoutes from "@/router/routes/service-center-routes";
import settings from "./routes/settings-routes.js";
import rolesRoutes from "./routes/role-routes.js";
import tags from "./routes/tag-routes.js";
import investorsMerge from "./routes/merging.js";
import investorsRequestsManaging from "./routes/investor-requests.js";
import widgets from "./routes/widget-routes";
import changelog from "./routes/changelog-routes";
import mailing from "./routes/mailing-routes";
import news from "./routes/news-routes";
import sixNotificationsAdmin from "./routes/six-notifications-admin-routes";
import notifications from "./routes/notifications-routes";
import researchReportsAdmin from "@/router/routes/research-reports-admin";
import researchReportsDownload from "@/router/routes/research-reports-download";
import customization from "@/router/routes/menu-customization-routes.js";
import ownershipDataRoutes from "@/router/routes/ownership-data-routes";

export default [].concat(
  dashboard,
  managementRoutes,
  companyRoutes,
  eventRoutes,
  singleCompanyEventRoutes,
  logs,
  serviceCenterRoutes,
  settings,
  rolesRoutes,
  investorsMerge,
  investorsRequestsManaging,
  tags,
  widgets,
  changelog,
  mailing,
  news,
  sixNotificationsAdmin,
  notifications,
  researchReportsAdmin,
  researchReportsDownload,
  customization,
  ownershipDataRoutes
);
