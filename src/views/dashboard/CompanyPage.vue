<template>
  <v-container fluid>
    <v-row class="flex-column">
      <v-col
        v-if="isAuthorized('irm') && isWidgetVisible('key_performance_indicators')"
        :order="getTableOrder('key_performance_indicators')"
      >
        <s-dashboard-table
          class="key-indicators"
          title="Key performance indicators"
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'irm-analytics' })"
          :headers="keyPerformanceIndicatorsHeaders"
          :items="indicators"
        >
          <template #item="{ item }">
            <tr>
              <td>{{ item.label }}</td>
              <td>{{ item.covered }}</td>
              <td>{{ item.compare }}</td>
              <td>
                <div v-if="item.change_amount">
                  {{ item.change_amount }}
                </div>
                <div v-else>-</div>
              </td>
              <td>
                <div v-if="item.change" class="mr-2">
                  {{ item.change }}
                </div>
                <div v-else class="mr-2">-</div>
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col
        v-if="
          isAuthorizedAny(['view_single_company_events', 'view_six_events']) &&
          isWidgetVisible('recent_and_upcoming_events')
        "
        :order="getTableOrder('recent_and_upcoming_events')"
      >
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'events' })"
          title="Recent and upcoming events"
          :items="upcomingEvents"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatDate(item.dates[0]) }}
              </td>
              <td>
                <template v-if="isEventViewable(item)">
                  <router-link :to="{ name: 'event-details', params: { id: item.id } }">
                    {{ item.name }}
                  </router-link>
                </template>
                <template v-else>
                  {{ item.name }}
                </template>
              </td>
              <td>
                {{ formatLocation(item) }}
              </td>
              <td>
                {{ clearCompoundEventVariant(item.variant) }}
              </td>
              <td>
                <s-button
                  type="tertiary-blue"
                  :to="{
                    name: 'single-company-events-edit',
                    params: { id: item.id },
                  }"
                  :disabled="!canManageEvent(item)"
                >
                  <v-icon class="mr-1 material-icons-outlined">edit</v-icon>
                  Edit
                </s-button>
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col
        v-if="
          isAuthorized('manage_investor_requests') && isWidgetVisible('recent_investor_requests')
        "
        :order="getTableOrder('recent_investor_requests')"
      >
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'investor-requests' })"
          title="Recent investor requests"
          :items="openInteractionRequests"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatDateTime(item.created_at) }}
              </td>
              <td>
                <router-link :to="{ name: 'investor-request', params: { id: item.id } }">
                  {{ typeFormatter(item).subjectOfInterestText(item) }}
                </router-link>
              </td>
              <td>
                <router-link
                  v-if="item.investor"
                  :to="{
                    name: 'investor-profile',
                    params: { uuid: item.investor.uuid },
                  }"
                >
                  {{ item.investor.full_name }}
                </router-link>
              </td>
              <td>
                <span v-if="item.investor && item.investor.company">
                  {{ item.investor.company.name }}
                </span>
                <span v-else class="text-grey">-</span>
              </td>
              <td>
                <div class="mr-3">
                  <request-status-label :value="item.status_text" />
                </div>
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col
        v-if="isAuthorized('irm') && isWidgetVisible('recent_investor_interactions')"
        :order="getTableOrder('recent_investor_interactions')"
      >
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'logs-list' })"
          title="Recent investor interactions"
          :items="latestInteractions"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatDateTime(item.when.date) }}
              </td>
              <td>
                <router-link :to="`investor-profile/${item.user.uuid}`">
                  {{ maxChars(item.user.full_name, 30) }}
                </router-link>
              </td>
              <td>
                <span v-if="item.user.company">
                  {{ item.user.company.name }}
                </span>
                <span v-else>-</span>
              </td>
              <td>
                {{ item.event_name || "n/a" }}
              </td>
              <td>
                <s-button type="tertiary-blue" :to="{ name: 'view-log', params: { id: item.id } }">
                  <v-icon class="mr-1 material-icons-outlined">visibility</v-icon>
                  View
                </s-button>
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col
        v-if="isAuthorized('news') && isWidgetVisible('recent_published_news')"
        :order="getTableOrder('recent_published_news')"
      >
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'news-list' })"
          title="Recent published news"
          :items="news"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatPublicationDate(item) }}
              </td>
              <td>
                <router-link :to="rowActionRoute(item)">
                  {{ item.name }}
                </router-link>
              </td>
              <td>
                {{ formatLanguages(item) || "-" }}
              </td>
              <td>
                <span class="mr-2" :class="{ 'text-grey': !authorAccountExists(item) }">
                  {{ author(item) }}
                </span>
              </td>
              <td>
                <news-status :news-item="item"></news-status>
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col
        v-if="
          isAuthorizedAny(['manage_single_company_events']) &&
          isWidgetVisible('most_recent_invite_reactions')
        "
        :order="getTableOrder('most_recent_invite_reactions')"
      >
        <s-dashboard-table
          title="Most recent invite reactions"
          :items="lastInvites"
          top-button-text="Show all"
          :top-button-action="routeToIrmWithFilters"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatDateTime(item.responded_at.date) }}
              </td>
              <td>
                <router-link :to="{ name: 'event-details', params: { id: item.event.id } }">
                  {{ item.event.name }}
                </router-link>
              </td>
              <td>
                <router-link :to="`investor-profile/${item.investor.uuid}`">
                  {{ maxChars(item.investor.full_name, 30) }}
                </router-link>
              </td>
              <td>
                {{ item.investor.company ? item.investor.company.name : "-" }}
              </td>
              <td>
                <invite-status-label :model-value="item.response" />
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col
        v-if="isWidgetVisible('last_service_center_tickets')"
        :order="getTableOrder('last_service_center_tickets')"
      >
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'service-center-list' })"
          title="Last service center tickets"
          :items="tickets"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatDateTime(item.updated_at.date) }}
              </td>
              <td class="text-capitalize">
                <router-link :to="{ name: 'ticket-view', params: { id: item.id } }">
                  {{ formatUnderscoredText(item.type) }}
                </router-link>
              </td>
              <td>
                <v-tooltip location="bottom" max-width="500" open-on-click>
                  <template #activator="{ props }">
                    <div class="service-center-list__details" v-bind="props">
                      {{ item.details }}
                    </div>
                  </template>
                  <span> {{ item.details }} </span>
                </v-tooltip>
              </td>
              <td>
                {{ item.reporter.full_name }}
              </td>
              <td>
                <ticket-status-label :value="item.status"></ticket-status-label>
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import SDashboardTable from "@/views/dashboard/widgets/SDashboardTable";
import { EVENT_VARIANT } from "@/constants";
import NewsRepository from "@/api/news";
import SButton from "@/s-components/Button/SButton.vue";
import NewsStatus from "@/views/news/components/NewsStatus.vue";
import { FORMAT, formatDateTime, formatNow, formatPastDate, prevYear } from "@/functions/dates";
import { isDraft, isEditable } from "@/views/news/mixins/common-helpers";
import serviceCenterApi from "@/api/service-center";
import TicketStatusLabel from "@/views/service-center/components/TicketStatusLabel.vue";
import IrmAnalyticsApi from "@/api/irm-analytics";
import {
  clearCompoundEventVariant,
  formatLocation,
  isSingleCompanyVariant,
  isSixVariant,
} from "../events/roadshows/js/event_variants";
import { bus } from "@/plugins/bus";
import { typeFormatter } from "../investor-requests/functions";
import InviteStatusLabel from "@/views/events/roadshows/components/InviteStatusLabel.vue";
import RequestStatusLabel from "@/views/investor-requests/list/RequestStatusLabel.vue";

const yearNow = prevYear(0);
const dateNow = formatNow(FORMAT.DATE_SQL);

const lastYear = prevYear(1);
const dateNowYearAgo = formatPastDate({ years: 1 }, FORMAT.DATE_SQL);

export default {
  components: {
    RequestStatusLabel,
    InviteStatusLabel,
    TicketStatusLabel,
    NewsStatus,
    SButton,
    SDashboardTable,
  },
  data() {
    return {
      EVENT_VARIANT,
      news: [],
      tickets: [],
      indicators: [],
      keyPerformanceIndicatorsHeaders: [
        { sortable: false },
        { title: "YTD (this year)", sortable: false },
        { title: "YTD (last year)", sortable: false },
        { title: "Change", sortable: false },
        { title: "Change in %", sortable: false, align: "right" },
      ],
    };
  },
  computed: {
    ...mapGetters(["isAuthorized", "isAuthorizedAny", "isAnyAdmin", "isCorporate", "userData"]),
    lastInvites() {
      const invites = this.$store.state.dashboard.lastInvites;

      return Array.isArray(invites) ? invites : [];
    },
    upcomingEvents() {
      return this.$store.state.dashboard.data || [];
    },
    openInteractionRequests() {
      return this.$store.state.dashboard.investorRequests || [];
    },
    totalRoadshows() {
      return this.$store.state.dashboard.totalRoadshows;
    },
    totalInteractions() {
      return this.$store.state.dashboard.totalInteractions;
    },
    totalInvestors() {
      return this.$store.state.dashboard.totalInvestors;
    },
    latestInteractions() {
      return this.$store.state.dashboard.latestInteractions;
    },
    userWidgets() {
      return this.userData.customization && this.userData.customization.widgets
        ? this.userData.customization.widgets
        : [];
    },
  },
  beforeUnmount() {
    bus.off("external-interaction-created");
  },
  mounted() {
    if (this.isCorporate) {
      this.setTopButtons();
      this.loadKeyPerformanceIndicators();

      this.loadCompanyEventsAndInteractions();
      this.$store.dispatch("getInvestorRequests");
      this.loadRecentlyUpdatedNews();
      this.loadCompanyEventsAndInteractions();
      this.loadTickets();

      bus.on("external-interaction-created", this.loadCompanyEventsAndInteractions);
    } else if (this.isAnyAdmin) {
      this.$store.dispatch("getAdminEvents");
    }
  },
  methods: {
    routeToIrmWithFilters() {
      const filters = {
        log_type: [
          "event-invite-accepted",
          "event-invite-declined",
          "one-click-booking",
          "event-one-click-booking",
        ],
      };
      return this.$router.push({ name: "logs-list", params: { filters: JSON.stringify(filters) } });
    },
    setTopButtons() {
      const buttons = [];

      buttons.push({
        slot: "Dashboard customization",
        type: "secondary",
        icon: "edit",
        iconOutlined: true,
        callback: {
          route: {
            name: "dashboard-customization",
          },
        },
      });

      bus.emit("setPageTopButtons", buttons);
    },
    typeFormatter,
    isWidgetVisible(key) {
      return this.userWidgets.length === 0 || this.getTableOrder(key) >= 0;
    },
    getTableOrder(key) {
      return this.userWidgets.indexOf(key);
    },
    loadCompanyEventsAndInteractions() {
      const eventsIncludes = ["location", "eventType", "slots.location", "secondaryOwners"];

      const eventsParams = {
        sort: "-start_date",
        include: eventsIncludes.join(","),
        limit: 3,
      };

      this.$store.dispatch("getCompanyEvents", eventsParams);
    },
    clearCompoundEventVariant,
    formatLocation,
    async loadKeyPerformanceIndicators() {
      const response = await IrmAnalyticsApi.summary({
        covered_from: yearNow.from,
        covered_to: dateNow,
        compare_from: lastYear.from,
        compare_to: dateNowYearAgo,
      });

      this.indicators = response;
    },
    async loadTickets() {
      const includes = ["reporter", "reporter.company", "assignee", "assignee.company"].join();

      const params = {
        limit: 3,
        include: includes,
      };

      const response = await serviceCenterApi.list(params);
      this.tickets = response.data;
    },
    maxChars(text, maxChars = 50) {
      return text.length <= maxChars ? text : text.substring(0, maxChars) + "...";
    },
    loadRecentlyUpdatedNews() {
      if (this.isAuthorized("news")) {
        const params = {
          limit: 3,
          include: "author,channels,translations",
          published_only: true,
          sort: "-publication_date",
        };

        NewsRepository.list(params).then(({ data }) => {
          this.news = data;
        });
      }
    },
    formatLanguages(newsItem) {
      return newsItem.translations.map((it) => it.language.toUpperCase()).join(", ");
    },
    formatPublicationDate(newsItem) {
      const dateTime = newsItem.published_at || newsItem.scheduled_for || null;
      return dateTime ? formatDateTime(dateTime, FORMAT.DATETIME) : "-";
    },
    author(newsItem) {
      return (
        (newsItem.author ? newsItem.author.full_name : newsItem.author_email) +
        ` (${newsItem.source.toUpperCase()})`
      );
    },
    authorAccountExists(newsItem) {
      return newsItem.author && newsItem.author.id;
    },
    rowActionRoute(newsItem) {
      const routeName =
        isEditable(newsItem, this.userData) && isDraft(newsItem)
          ? "news-edit-basic-info"
          : "news-edit-publication";
      return {
        name: routeName,
        params: { id: newsItem.id },
      };
    },
    formatUnderscoredText(type) {
      return type.split("_").join(" ");
    },
    isEventViewable(event) {
      return event.variant !== EVENT_VARIANT.SIX;
    },
    canManageEvent(event) {
      if (this.isAnyAdmin) {
        return true;
      }
      if (!this.$isEventOwner(event)) {
        return false;
      }
      if (isSingleCompanyVariant(event) && this.isAuthorized("manage_single_company_events")) {
        return true;
      }
      return !!(isSixVariant(event) && this.isAuthorized("manage_six_events"));
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:first-child) {
  width: 20%;
}

:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  width: 25%;
}

:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:nth-child(4)) {
  width: auto;
}

:deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
  width: 13%;
  text-align: right;
}

.key-indicators {
  & :deep(.v-table > .v-table__wrapper > table > thead > tr > th:last-child > span) {
    margin-right: 8px;
  }

  & :deep(.v-table > .v-table__wrapper > table > tbody > tr > td:last-child) {
    width: 13%;
    text-align: right;

    & > div {
      display: inline-block;
      width: 90px;
      text-align: center;
    }
  }
}

.service-center-list__details {
  white-space: nowrap;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-center__company-name {
  font-size: 12px;
  line-height: 14px;
}

@media (max-width: 380px) {
  .v-btn {
    min-width: 45px !important;
  }
}
</style>
