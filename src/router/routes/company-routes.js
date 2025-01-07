import List from "@/views/companies/ListPage.vue";
import Create from "@/views/companies/CreatePage.vue";
import Edit from "@/views/companies/EditPage.vue";
import EditTabGeneral from "@/views/companies/edit_tabs/GeneralPage.vue";
import EditTabEvents from "@/views/companies/edit_tabs/EventsPage.vue";
import View from "@/views/companies/ViewPage.vue";

import RouterView from "@/views/layouts/RouterView";

import {
  authorize,
  isAnyAdmin,
} from "@/router/middleware";

export default [
  {
    path: "/edit-company",
    redirect: { name: "own-company-edit-general" },
    name: "edit-company",
    meta: { title: "Edit company" },
    component: Edit,
    children: [
      {
        path: "general",
        name: "own-company-edit-general",
        meta: { title: "Company general settings" },
        component: EditTabGeneral,
      },
      {
        path: "events",
        name: "own-company-edit-events",
        meta: { title: "Company events settings" },
        component: EditTabEvents,
      },
    ],
  },
  {
    path: "/companies",
    name: "companies-list-outer",
    meta: { title: "Companies" },
    redirect: "/companies/list",
    component: RouterView,
    children: [
      {
        path: "list",
        name: "companies-list",
        meta: { title: "Company list" },
        component: List,
      },
      {
        path: "create",
        name: "companies-create",
        beforeEnter: authorize(isAnyAdmin),
        meta: { title: "Add company" },
        component: Create,
      },
      {
        path: "/edit/:id",
        redirect: (route) => `/edit/${route.params.id}/general`,
        name: "admin-companies-edit",
        beforeEnter: authorize(isAnyAdmin),
        meta: { title: "Edit company" },
        component: Edit,
        props: (route) => ({ companyId: route.params.id }),
        children: [
          {
            path: "general",
            name: "companies-edit-general",
            meta: { title: "Company general settings" },
            component: EditTabGeneral,
            props: true,
          },
          {
            path: "events",
            name: "companies-edit-events",
            meta: { title: "Company events settings" },
            component: EditTabEvents,
            props: true,
          },
        ],
      },
      {
        path: ":id",
        name: "view-company",
        meta: { title: "Company profile" },
        component: View,
      },
    ],
  },
];
