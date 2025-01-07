<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'booked-events' })"
          title="My booked events"
          :items="bookedEvents"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatDate(item.start_date.date) }}
                {{ eventTime(item) }}
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
              <td>{{ item.company.name }}</td>
              <td>
                {{ item.variant === EVENT_VARIANT.SIX ? item.location.name : formatLocation(item) }}
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col cols="12">
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'notifications-view' })"
          title="My followed company events"
          :items="followedCompanyEvents"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ dateTimeFollowedEvents(item) }}
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>{{ item.company_name }}</td>
              <td>
                {{ item.location.name }}
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>

      <v-col cols="12">
        <s-dashboard-table
          top-button-text="Show all"
          :top-button-action="() => $router.push({ name: 'upcoming-events' })"
          title="All upcoming events"
          :items="upcomingEvents"
        >
          <template #item="{ item }">
            <tr>
              <td>
                {{ formatDate(item.start_date.date) }}
                {{ eventTime(item) }}
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
              <td>{{ item.company.name }}</td>
              <td>
                {{ item.variant === EVENT_VARIANT.SIX ? item.location.name : formatLocation(item) }}
              </td>
            </tr>
          </template>
        </s-dashboard-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SDashboardTable from "@/views/dashboard/widgets/SDashboardTable.vue";
import { EVENT_VARIANT } from "@/constants";
import EventApi from "@/api/events";
import NotificationsRepository from "@/api/notifications";
import { formatTimeZoneAbbrFromSQLString } from "@/functions/dates";
import { eventTime, formatLocation, isEventViewable } from "../investor/events/helpers";

export default {
  components: { SDashboardTable },
  data() {
    return {
      events: [],
      followedCompanyEvents: [],
      upcomingEvents: [],
    };
  },
  computed: {
    EVENT_VARIANT() {
      return EVENT_VARIANT;
    },
    bookedEvents() {
      return this.events.filter((event) => event.slots[0]);
    },
  },
  mounted() {
    this.loadBookedEvents();
    this.loadFollowedCompanyEvents();
    this.loadUpcomingEvents();
  },
  methods: {
    eventTime,
    dateTimeFollowedEvents(event) {
      const eventDate = this.formatDate(event.date);
      const eventTime = event.time ? `${this.formatTime(event.time.split(" ")[0])} CEST` : "";
      return `${eventDate} ${eventTime}`;
    },
    formatLocation,
    isEventViewable,
    formatTimeZoneAbbrFromSQLString,
    loadBookedEvents() {
      const eventsIncludes = [
        "location",
        "eventType",
        "company",
        "slots.location",
        "secondaryOwners",
      ];

      const eventsParams = {
        sort: "-start_date",
        include: eventsIncludes.join(","),
        fromNow: true,
        limit: 3,
        withOwnedSlots: true,
      };

      EventApi.list(eventsParams)
        .then((response) => {
          this.events = response.data;
        })
        .catch(() => {});
    },
    loadFollowedCompanyEvents() {
      NotificationsRepository.list({
        sort: "-start_date",
        limit: 3,
      }).then((response) => {
        this.followedCompanyEvents = response.data;
      });
    },
    loadUpcomingEvents() {
      const eventsIncludes = [
        "location",
        "company",
        "eventType",
        "slots.location",
        "secondaryOwners",
      ];

      const eventsParams = {
        sort: "-start_date",
        include: eventsIncludes.join(","),
        fromNow: true,
        publishedOnCalendar: true,
        limit: 3,
      };

      EventApi.list(eventsParams)
        .then((response) => {
          this.upcomingEvents = response.data;
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
:deep(.v-table > .v-table__wrapper > table > tbody > tr > td) {
  width: 20%;
}
</style>
