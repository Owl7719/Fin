import RolesList from "@/views/roles/RolesList";
import CreateRole from "@/views/roles/CreateRole";
import EditRole from "@/views/roles/EditRole";
import RouterView from "@/views/layouts/RouterView";

import { authorize, isSuperAdmin } from "../middleware";

export default [
  {
    path: "/settings/roles",
    meta: {
      breadcrumb: "Roles",
    },
    component: RouterView,
    children: [
      {
        name: "roles-list",
        path: "",
        meta: {
          title: "Roles list",
        },
        component: RolesList,
        beforeEnter: authorize(isSuperAdmin),
      },
      {
        path: "add",
        name: "create-role",
        meta: {
          title: "Create role",
        },
        component: CreateRole,
        beforeEnter: authorize(isSuperAdmin),
      },
      {
        path: ":id",
        name: "edit-role",
        meta: {
          title: "Edit role",
        },
        component: EditRole,
        beforeEnter: authorize(isSuperAdmin),
      },
    ],
  },
];
