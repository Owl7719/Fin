import Events from "@/views/events/list/EventsPage.vue";
import EventView from "@/views/events/view/EventView.vue";
import Logistics from "@/views/events/roadshows/components/LogisticsPage.vue";
import RouterView from "@/views/layouts/RouterView";
import { authorize, isInvestor, isAnyAdmin, isCorporate, or, and, can } from "../middleware";
import InvestorBookedEvents from "@/views/investor/events/components/InvestorBookedEvents.vue";
import InvestorOrCorporateUpcomingEvents from "@/views/investor/events/components/InvestorOrCorporateUpcomingEvents.vue";
import NotificationsView from "@/views/notifications/NotificationsView.vue";

const isAdminOrInvestorOrCorporateWithEventsPermission = or(
  isAnyAdmin,
  isInvestor,
  and(isCorporate, or(can("view_single_company_events"), can("view_six_events")))
);

export default [
  {
    path: "/events",
    redirect: "/events/list",
    component: RouterView,
    meta: {
      title: "Events",
    },
    children: [
      {
        path: ":id/logistics",
        name: "event-logistics",
        component: Logistics,
        meta: {
          title: "Edit logistics",
        },
      },
      {
        path: "list",
        beforeEnter: authorize(isAdminOrInvestorOrCorporateWithEventsPermission),
        name: "events",
        component: Events,
        meta: {
          title: "List of all my events",
        },
        children: [
          {
            path: "booked",
            name: "booked-events",
            component: InvestorBookedEvents,
            beforeEnter: authorize(isInvestor),
            meta: {
              title: "List all events",
            },
          },
          {
            path: "upcoming",
            name: "upcoming-events",
            component: InvestorOrCorporateUpcomingEvents,
            beforeEnter: authorize(isInvestor),
            meta: {
              title: "List all events",
            },
          },
          {
            path: "event-notifications",
            name: "event-notifications",
            component: NotificationsView,
            beforeEnter: authorize(isInvestor),
            meta: {
              title: "List all events",
            },
          },
        ],
      },
      {
        path: "details/:id",
        beforeEnter: authorize(isAdminOrInvestorOrCorporateWithEventsPermission),
        name: "event-details",
        component: EventView,
        meta: {
          title: "Event details",
        },
      },
    ],
  },
];
