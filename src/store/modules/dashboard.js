import { FORMAT } from "@/functions/dates.js";
import { DateTime } from "luxon";
import InvestorRequestApi from "@/api/investor-requests";
import FeedbackInvitesApi from "@/api/feedback-invites";
import EventApi from "@/api/events";
import UsersApi from "@/api/users";
import LogsApi from "@/api/logs";

export default {
  state: {
    data: [],
    singleEvents: [],
    conferences: [],
    feedbacks: [],
    lastLogins: [],
    lastUsers: [],
    lastInvites: [],
    investorRequests: [],
    totalRoadshows: 0,
    totalInvestors: 0,
    totalInteractions: 0,
    latestInteractions: [],
  },
  mutations: {
    resetDashboardModule(state) {
      Object.assign(state, {
        data: [],
        singleEvents: [],
        conferences: [],
        feedbacks: [],
        lastLogins: [],
        lastUsers: [],
        lastInvites: [],
        investorRequests: [],
        totalRoadshows: 0,
        totalInvestors: 0,
        totalInteractions: 0,
      });
    },
    setAllEvents(state, payload) {
      state.data = payload.data;
    },
    setConferences(state, payload) {
      state.conferences = payload.data;
    },
    setSingleEvents(state, payload) {
      state.singleEvents = payload.data;
    },
    setFeedbacks(state, payload) {
      state.feedbacks = payload.data;
    },
    setTotalRoadshows(state, payload) {
      state.totalRoadshows = payload.data;
    },
    setTotalInvestors(state, payload) {
      state.totalInvestors = payload.data;
    },
    setTotalInteractions(state, payload) {
      state.totalInteractions = payload.data;
    },
    setLatestInteractions(state, payload) {
      state.latestInteractions = payload.data;
    },
    setLastLogins(state, payload) {
      state.lastLogins = payload.data;
    },
    setLastUsers(state, payload) {
      state.lastUsers = payload.data;
    },
    setLastInvites(state, payload) {
      state.lastInvites = payload.data;
    },
    setInvestorRequests(state, payload) {
      state.investorRequests = payload;
    },
  },
  actions: {
    getInvestorEvents({ commit }) {
      const eventsIncludes = "status,eventType,location,company,slots.representatives,slots.venue";

      const eventsParams = {
        include: eventsIncludes,
        fromNow: true,
        withOwnedInvites: true,
        withOwnedSlots: true,
        wherePublicOnlyAttendant: true,
      };

      // eslint-disable-next-line
      EventApi.list(eventsParams).then(response => {
          commit("setAllEvents", response.data);
        })
        .catch(() => {});

      // eslint-disable-next-line
      const feedbackInvitesIncludes = [
        "event",
        "event.company",
      ];
      const params = {
        include: feedbackInvitesIncludes.join(),
        eventStatus: 5,
        sort: "-sent_at",
      };

      // eslint-disable-next-line
      FeedbackInvitesApi
        .list(
          params
        )
        .then((response) => {
          commit("setFeedbacks", response.data);
        })
        .catch(() => {});
    },
    getInvestorRequests({ commit, getters }) {
      if (getters.isAuthorized("manage_investor_requests")) {
        const include = ["investor.company", "company", "event"].join(",");
        const params = {
          limit: 3,
          include,
        };
        // eslint-disable-next-line
        InvestorRequestApi
          .list(
            params
          )
          .then((response) => {
          commit("setInvestorRequests", response.data);
        });
      }
    },
    getCompanyEvents({ commit, getters }, params = {}) {
      if (getters.isAuthorizedAny(["view_single_company_events", "view_six_events"])) {
        const allEventsParams = {
          ...params,
        };
        // eslint-disable-next-line
        EventApi.list(allEventsParams).then(response => {
          commit("setAllEvents", response);
        });

        const countEventsParams = {
          count: true,
        };

        // eslint-disable-next-line
        EventApi.list(countEventsParams).then(response => {
          commit("setTotalRoadshows", response);
        });
      }

      if (getters.isAuthorizedAll(["view_investors", "view_and_manage_linked_investors"])) {
        const usersParams = {
          linked: true,
          investor: true,
          count: true,
        };
        // eslint-disable-next-line
        UsersApi.list(usersParams).then(response => {
          commit("setTotalInvestors", response);
        });
      }

      if (getters.isAuthorized("irm")) {
        const params = {
          type: "interaction",
          count: true,
        };
        // eslint-disable-next-line
        LogsApi.list(params).then(response => {
          commit("setTotalInteractions", response);
        });

        const endDate = DateTime.now().toFormat(FORMAT.DATE_SQL);

        const startDate = DateTime.now().minus({ days: 90 }).toFormat(FORMAT.DATE_SQL);

        const latestInteractionsIncludes = ["user", "user.company"];
        const latestInteractionsParams = {
          limit: 3,
          end_date: endDate,
          start_date: startDate,
          type: "interaction",
          include: latestInteractionsIncludes.join(),
        };

        // eslint-disable-next-line
        LogsApi.list(latestInteractionsParams).then(response => {
          commit("setLatestInteractions", response);
        });
      }

      if (getters.isAuthorized("manage_single_company_events")) {
        // eslint-disable-next-line
        axios
          .get(
            "/event-invites?responded&sort=-responded_at&limit=3&include=investor.company,event.company,sender"
          )
          .then((response) => {
            commit("setLastInvites", response.data);
          });
      }
    },
    getAdminEvents({ commit, getters }) {
      let includes = "location,eventType,status,assetClass,company";

      if (
        getters.isAuthorized("manage_owned_conferences") ||
        getters.isAuthorized("manage_all_events")
      ) {
        const allAdminEventsParams = {
          latestAndUpcoming: true,
          sort: "-start_date",
          include: includes,
        };
        // eslint-disable-next-line
        EventApi
          .list(allAdminEventsParams)
          .then((response) => {
          commit("setAllEvents", response);
        });

        const singleAdminEventsParams = {
          limit: 10,
          sort: "-created_at",
          include: includes,
        };

        // eslint-disable-next-line
        EventApi
          .list(singleAdminEventsParams)
          .then((response) => {
          commit("setSingleEvents", response);
        });
      }

      if (
        getters.isAuthorized("manage_owned_single_company_events") ||
        getters.isAuthorized("manage_all_events")
      ) {
        const totalRoadshowsParams = {
          count: true,
        };
        // eslint-disable-next-line
        EventApi.list(totalRoadshowsParams).then(response => {
          commit("setTotalRoadshows", response);
        });
      }

      const totalInvestorsParams = {
        investor: true,
        count: true,
      };

      // eslint-disable-next-line
      UsersApi.list(totalInvestorsParams).then(response => {
        commit("setTotalInvestors", response);
      });

      const totalLogsParams = {
        count: true,
      };

      // eslint-disable-next-line
      LogsApi.list(totalLogsParams).then(response => {
        commit("setTotalInteractions", response);
      });

      if (getters.isAuthorized("see_dashboard_widget_last_logins")) {
        const lastLoginsIncludes = ["company"];
        const lastLoginsParams = {
          limit: 15,
          sort: "-loggedin_at",
          include: lastLoginsIncludes.join(),
        };
        // eslint-disable-next-line
        UsersApi
          .list(lastLoginsParams)
          .then(response => {
          commit("setLastLogins", response);
        });
      }

      if (getters.isAuthorized("see_dashboard_widget_recent_registrations")) {
        const lastLoginsIncludes = ["company"];
        const lastLoginsParams = {
          limit: 15,
          nonAdmin: true,
          latestCreated: true,
          include: lastLoginsIncludes.join(),
        };

        // eslint-disable-next-line
        UsersApi
          .list(lastLoginsParams)
          .then(response => {
          commit("setLastUsers", response);
        });
      }

      if (
        getters.isAuthorized("manage_owned_single_company_events") &&
        getters.isAuthorized("manage_all_events")
      ) {
        // eslint-disable-next-line
        axios
          .get(
            "/event-invites?responded&sort=-responded_at&limit=10&include=investor.company,event.company,sender"
          )
          .then((response) => {
            commit("setLastInvites", response.data);
          });
      }
    },
  },
  getters: {},
};
