import EditUserProfile from "@/views/management/user/profile/EditUserProfile";
import AddUser from "@/views/management/user/add/AddUser";
import EditUser from "@/views/management/user/edit/EditUser";
import ListInvestors from "@/views/management/user/list/ListInvestors";
import ChangePassword from "@/views/management/user/auth/ChangePassword.vue";
import RouterView from "@/views/layouts/RouterView";
import { authorize, can, or, and, isCorporate, isAnyAdmin } from "../middleware";
import TwoFactorAuthentication from "@/views/management/user/auth/TwoFactorAuthentication.vue";

const canSeeInvestors = or(
  isAnyAdmin,
  and(isCorporate, or(can("view_and_manage_linked_investors"), can("view_investors")))
);

export default [
  {
    path: "/edit-user-profile/:page?",
    name: "edit-user-profile",
    meta: {
      title: "User profile",
    },
    component: EditUserProfile,
  },
  // ADMIN COMPANIES GROUP
  {
    path: "/investors",
    name: "investors",
    redirect: "/investors/list",
    component: RouterView,
    meta: {
      title: "Investors",
    },
    children: [
      {
        path: "list",
        name: "investors-list",
        beforeEnter: authorize(canSeeInvestors),
        component: ListInvestors,
      },
      {
        path: "create",
        beforeEnter: authorize(and(isCorporate, can("view_and_manage_linked_investors"))),
        name: "add-investor",
        meta: {
          title: "Add investor",
        },
        component: AddUser,
      },
    ],
  },
  // ADMIN USER MANAGEMENT GROUP
  {
    path: "/users",
    name: "users",
    redirect: "/users/list",
    meta: {},
    component: RouterView,
    children: [
      {
        path: "list",
        name: "users-list",
        beforeEnter: authorize(isAnyAdmin),
        meta: {
          title: "List users",
        },
        component: ListInvestors,
      },
      {
        path: "add",
        name: "users-add",
        meta: {
          title: "Add user",
        },
        component: AddUser,
      },
      {
        path: "edit/:uuid",
        name: "edit-user",
        meta: {
          title: "Edit user",
        },
        component: EditUser,
      },
    ],
  },
  {
    path: "/change-password",
    name: "change-password",
    meta: {
      title: "Change password",
    },
    component: ChangePassword,
  },
  {
    path: "/two-factor-authentication-settings",
    name: "two-factor-authentication-settings",
    meta: {
      title: "Two factor authentication",
    },
    component: TwoFactorAuthentication,
  },
];
