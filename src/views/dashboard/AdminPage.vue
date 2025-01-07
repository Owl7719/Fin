<template>
  <v-container fluid>
    <v-row class="admin-dashboard" dense>
      <!-- STATISTICS -->
      <v-col
        v-if="
          isAuthorized('manage_owned_single_company_events') || isAuthorized('manage_all_events')
        "
        cols="12"
        sm="4"
      >
        <v-statistics
          icon="table_view"
          :title="totalRoadshows"
          :custom-style="investorsIconStyle"
          sub-title="Total Events"
          color="thernary"
        >
        </v-statistics>
      </v-col>
      <v-col cols="12" sm="4">
        <v-statistics
          icon="groups"
          :custom-style="investorsIconStyle"
          :title="totalInvestors"
          sub-title="Total Investors"
          color="primary"
        >
        </v-statistics>
      </v-col>
      <v-col cols="12" sm="4">
        <v-statistics
          icon="forum"
          :title="totalInteractions"
          :custom-style="investorsIconStyle"
          sub-title="Total Interactions"
          color="quaternary"
        >
        </v-statistics>
      </v-col>
    </v-row>

    <!-- UPCOMING EVENTS -->

    <v-row>
      <six-performance-indicator
        v-if="isAuthorized('see_dashboard_widget_six_performance_indicators')"
        class="mb-2"
      />
    </v-row>
    <v-row>
      <v-col
        v-if="
          isAuthorized('manage_owned_single_company_events') || isAuthorized('manage_all_events')
        "
        class="mb-2"
        cols="12"
      >
        <v-widget
          title-font-size="16px"
          title="Most recently added Single Company Events"
          content-bg="pa-0 ma-0"
          color="grey-lighten-3"
          density="compact"
          variant="outlined"
        >
          <template #widget-content>
            <v-data-table
              light
              :headers="singleHeaders"
              :items="upcomingSingles"
              class="elevation-0"
              hide-default-footer
              :mobile-breakpoint="0"
            >
              <template #item="{ item }">
                <tr>
                  <td :class="greyTextIfPast(item)">
                    {{ formatDateTime(item.created_at.date) }}
                  </td>
                  <td :class="greyTextIfPast(item)">
                    {{ item.company ? item.company.name : "-" }}
                  </td>
                  <td :class="greyTextIfPast(item)">
                    {{ item.location ? item.location.name : "-" }}
                  </td>
                  <td :class="greyTextIfPast(item)">
                    {{ formatDate(item.start_date.date) }}
                  </td>
                  <td :class="greyTextIfPast(item)">
                    {{ item.name }}
                  </td>
                  <td :class="greyTextIfPast(item)">
                    {{ item.asset_class.name }}
                  </td>
                  <td :class="greyTextIfPast(item)">
                    {{ item.status.text }}
                  </td>

                  <td class="text-center px-0">
                    <s-button
                      type="tertiary-blue"
                      :to="{
                        name: 'single-company-events-edit',
                        params: { id: item.id },
                      }"
                    >
                      <v-icon class="material-icons-outlined mr-1"> edit </v-icon>
                      Edit
                    </s-button>
                  </td>
                </tr>
              </template>
              <template #bottom></template>
            </v-data-table>
          </template>
        </v-widget>
      </v-col>
      <v-col v-else cols="12">
        <v-alert variant="outlined" class="mb-2" :model-value="true" type="warning">
          You have no permission to see single company events
        </v-alert>
      </v-col>
    </v-row>

    <!-- LATEST INVITES -->

    <v-row>
      <v-col cols="12" class="mb-2">
        <v-widget
          disable-initial-sort
          title-font-size="16px"
          title="Most recent invite reactions"
          content-bg="pa-0 ma-0"
          color="grey-lighten-3"
          density="compact"
          variant="outlined"
        >
          <template #widget-content>
            <v-data-table
              light
              :headers="lastInviteHeaders"
              :items="lastInvites"
              hide-default-footer
              :mobile-breakpoint="0"
              class="elevation-0"
            >
              <template #item="{ item }">
                <tr>
                  <td>
                    {{ formatDateTime(item.responded_at.date) }}
                  </td>
                  <td>
                    {{ item.event.company ? item.event.company.name : "-" }}
                  </td>
                  <td>{{ item.event.name }}</td>
                  <td>{{ showResponse(item.response) }}</td>
                  <td>{{ item.investor.last_name }}</td>
                  <td>{{ item.investor.first_name }}</td>
                  <td>
                    {{ item.investor.company ? item.investor.company.name : "-" }}
                  </td>
                  <td>{{ item.investor.company_function }}</td>
                </tr>
              </template>
              <template #bottom></template>
            </v-data-table>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <!-- LAST LOGINS -->

    <v-row>
      <v-col v-if="isAuthorized('see_dashboard_widget_last_logins')" cols="12" class="mb-2">
        <v-widget
          disable-initial-sort
          title-font-size="16px"
          title="Last log-ins"
          content-bg="ma-0 pa-0"
          color="grey-lighten-3"
          density="compact"
          variant="outlined"
        >
          <template #widget-content>
            <v-data-table
              light
              :headers="loginHeaders"
              :items="lastLogins"
              hide-default-footer
              :mobile-breakpoint="0"
              class="elevation-0"
            >
              <template #item="{ item }">
                <tr>
                  <td v-if="item.loggedin_at">
                    {{ formatDateTime(item.loggedin_at.date) }}
                  </td>
                  <td v-else>-</td>
                  <td>{{ item.last_name }}</td>
                  <td>{{ item.first_name }}</td>
                  <td>
                    {{ (item.company && item.company.name) || "-" }}
                  </td>
                  <td>{{ item.company_function }}</td>
                </tr>
              </template>
              <template #bottom></template>
            </v-data-table>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <!-- LATEST USER REGISTRATIONS -->

    <v-row>
      <v-col
        v-if="isAuthorized('see_dashboard_widget_recent_registrations')"
        cols="12"
        class="mb-2"
      >
        <v-widget
          title-font-size="16px"
          title="Recent user registrations"
          content-bg="pa-0 ma-0"
          color="grey-lighten-3"
          density="compact"
          variant="outlined"
        >
          <template #widget-content>
            <v-data-table
              light
              :headers="registrationHeaders"
              :items="lastUsers"
              hide-default-footer
              class="elevation-0"
              :mobile-breakpoint="0"
            >
              <template #item="{ item }">
                <tr>
                  <td>
                    {{ formatDateTime(item.created_at.date) }}
                  </td>
                  <td>{{ item.last_name || "-" }}</td>
                  <td>{{ item.first_name || "-" }}</td>
                  <td>
                    {{ (item.company && item.company.name) || "-" }}
                  </td>
                  <td>{{ item.company_function || "-" }}</td>
                  <td class="text-center px-0">
                    <v-icon v-if="item.active" size="20" color="success">check</v-icon>
                    <v-icon v-else size="20" color="error">clear</v-icon>
                  </td>
                  <td class="text-center px-0">
                    <s-button
                      type="tertiary-blue"
                      :to="{
                        name: 'edit-user',
                        params: { uuid: item.uuid },
                      }"
                    >
                      <v-icon class="material-icons-outlined mr-1">edit</v-icon>
                      Edit
                    </s-button>
                  </td>
                </tr>
              </template>
              <template #bottom></template>
            </v-data-table>
          </template>
        </v-widget>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VStatistics from "@/components/VStatistics";
import { mapGetters, mapState } from "vuex";
import SixPerformanceIndicator from "@/views/dashboard/widgets/SixPerformanceIndicator";
import { isPast } from "@/functions/dates";
import { DATE_TIME_FORMAT } from "@/constants";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, VStatistics, SixPerformanceIndicator },
  data: function () {
    return {
      DATE_TIME_FORMAT,
      singleHeaders: [
        { title: "Time stamp", value: "created_at", sortable: false },
        { title: "Event company", sortable: false },
        { title: "Location", value: "location.name", sortable: false },
        { title: "Event date", align: "left", sortable: false },
        { title: "Event/Subject", value: "name", sortable: false },
        { title: "Asset class", value: "asset_class.name", sortable: false },
        { title: "Status", value: "status.text", sortable: false },
        { title: "Edit", align: "center", sortable: false, width: "8%" },
      ],
      conferenceHeaders: [
        {
          title: "Date",
          align: "left",
          sortable: false,
        },
        { title: "Conference name", value: "name", sortable: false },
        { title: "Location", value: "location.name", sortable: false },
        { title: "Status", value: "status.text", sortable: false },
        { title: "Edit", sortable: false, width: "20" },
      ],
      loginHeaders: [
        { title: "Time stamp", value: "loggedin_at", sortable: false },
        {
          title: "Name",
          align: "left",
          sortable: false,
        },
        { title: "First name", value: "first_name", sortable: false },
        { title: "Company", value: "company.name", sortable: false },
        { title: "Role", value: "company_function", sortable: false },
      ],
      registrationHeaders: [
        { title: "Time stamp", value: "created_at", sortable: false },
        {
          title: "Name",
          align: "left",
          sortable: false,
        },
        { title: "First name", value: "first_name", sortable: false },
        { title: "Company", value: "company.name", sortable: false },
        { title: "Role", value: "company_function", sortable: false },
        {
          title: "Activated",
          value: "active",
          sortable: false,
          width: "20",
        },
        { title: "Edit", align: "center", sortable: false, width: "8%" },
      ],
      lastInviteHeaders: [
        {
          title: "Time stamp",
          align: "left",
          sortable: false,
        },
        {
          title: "Event company",
          sortable: false,
        },
        { title: "Event/Subject", value: "event.name", sortable: false },
        { title: "Type", value: "response", sortable: false },
        { title: "Name", value: "investor.last_name", sortable: false },
        {
          title: "First name",
          value: "investor.first_name",
          sortable: false,
        },
        {
          title: "Company",
          value: "investor.company.name",
          sortable: false,
        },
        {
          title: "Role",
          value: "investor.company_function",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["isAuthorized"]),
    ...mapState({
      upcomingSingles: (state) => [...state.dashboard.singleEvents],
    }),
    lastLogins() {
      if (this.$store.state.dashboard.lastLogins.length) {
        return this.$store.state.dashboard.lastLogins;
      }
      return [];
    },
    lastInvites() {
      if (this.$store.state.dashboard.lastInvites.length) {
        return this.$store.state.dashboard.lastInvites;
      }
      return [];
    },
    lastUsers() {
      if (this.$store.state.dashboard.lastUsers.length) {
        return this.$store.state.dashboard.lastUsers;
      }
      return [];
    },
    totalRoadshows() {
      return this.$store.state.dashboard.totalRoadshows.toString();
    },
    totalInteractions() {
      return this.$store.state.dashboard.totalInteractions.toString();
    },
    totalInvestors() {
      return this.$store.state.dashboard.totalInvestors.toString();
    },
    investorsIconStyle() {
      return {
        "font-size": "76px",
        "line-height": "1.04",
      };
    },
  },
  beforeMount() {
    this.$store.dispatch("getAdminEvents");
  },
  methods: {
    showResponse(response) {
      if (response) {
        let responses = {
            1: "Accepted",
            2: "No time",
            3: "Not interested",
          },
          answer;

        if (this.$store.state.settings.inviteResponses) {
          this.$store.state.settings.inviteResponses.map(
            (item) => (responses[item.id] = item.name)
          );
        }

        if ((answer = responses[response])) {
          return answer;
        }
      }

      return "";
    },
    greyTextIfPast(event) {
      return {
        "text-grey-darken-2": isPast(event.start_date.date),
      };
    },
  },
};
</script>

<style>
.admin-dashboard .v-card__text {
  padding-top: 0 !important;
}
.text-grey-darken-2 {
  color: #606060 !important;
}
</style>
