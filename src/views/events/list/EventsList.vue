<template>
  <v-container fluid>
    <slot name="filters"></slot>
    <v-data-table-server
      :mobile-breakpoint="0"
      :headers="headers"
      :items="events"
      :items-per-page-options="[10, 25, 50]"
      :items-length="totalEvents"
      class="border-sm rounded mt-3"
      no-data-text="No events"
      @update:options="getEvents"
    >
      <template #item="{ item }">
        <tr>
          <td class="text-left">
            <div class="d-flex align-center justify-space-between">
              {{ formatDate(item.start_date.date) }}
              <v-tooltip v-if="item.dates.length > 1" location="bottom" open-on-click>
                <template #activator="{ props }">
                  <v-icon class="mx-3" color="#75808E" v-bind="props"> date_range </v-icon>
                </template>
                <span>{{ formatMultiDayEvent(item.dates) }}</span>
              </v-tooltip>
            </div>
          </td>
          <td class="text-left">
            <template v-if="isEventViewable(item)">
              <router-link :to="{ name: 'event-details', params: { id: item.id } }">
                {{ item.name }}
              </router-link>
            </template>
            <template v-else>
              {{ item.name }}
            </template>
          </td>
          <td v-if="showCompanyColumn" class="text-left">
            {{ item.company ? item.company.name : "-" }}
          </td>
          <td class="text-left">
            {{ clearCompoundEventVariant(item.variant) }}
          </td>
          <td class="text-left">
            {{ formatLocation(item) }}
          </td>
          <td class="text-left">
            <span v-if="item.deleted_at">
              <v-chip
                small
                label
                style="height: 28px"
                color="red lighten-4"
                text-color="black"
                class="ml-0 font-weight-medium py-1"
              >
                Trashed
              </v-chip>
            </span>
            <event-status-editable
              v-else-if="isSingleCompanyVariant(item)"
              :event-status="item.status"
              :editable="canManageEvent(item)"
              @changed="changeStatus(item.id, $event)"
            ></event-status-editable>
            <span v-else>-</span>
          </td>
          <td class="text-left">
            {{ creatorName(item) }}
          </td>
          <td class="text-center">
            <s-button
              v-if="showEditButton"
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
            <v-menu offset-y>
              <template #activator="{ props }">
                <s-button type="tertiary" class="mx-2" icon size="small" v-bind="props">
                  <v-icon size="18">more_vert</v-icon>
                </s-button>
              </template>
              <v-list>
                <v-list-item v-if="showInviteRequestLinkColumn" @click="showRequestLinkModal(item)">
                  Invite Link
                </v-list-item>
                <v-list-item
                  :disabled="!canManageEvent(item)"
                  @click="onConfirmReplicating(item.id)"
                >
                  <v-list-item-title>Replicate</v-list-item-title>
                </v-list-item>
                <v-list-item :disabled="!canDeleteEvent(item)" @click="onConfirmDeleting(item)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </template>
    </v-data-table-server>

    <event-invite-request-modal
      :event="requestInviteLink.selectedEvent"
      v-model="requestInviteLink.dialogVisible"
      @close="requestInviteLink.dialogVisible = false"
    ></event-invite-request-modal>

    <s-confirm
      v-model="confirmDialogReplicate"
      confirm-label="Replicate"
      :max-width="500"
      @confirm="confirmReplicating(selectedEvent)"
    >
      <span
        >You are about to clone this event (all data other than attendants and date. Are you
        sure?</span
      >
    </s-confirm>

    <s-confirm
      v-model="confirmDialogDelete"
      confirm-label="Delete"
      :max-width="500"
      @confirm="confirmDeleting(selectedEvent)"
    >
      <span
        >Are you sure you want to delete the event <b>{{ selectedEvent.name }}</b
        >?</span
      >
    </s-confirm>
  </v-container>
</template>

<script>
import EventInviteRequestModal from "../components/EventInviteRequestModal";
import { mapGetters } from "vuex";
import {
  clearCompoundEventVariant,
  formatLocation,
  isSingleCompanyVariant,
  isSixVariant,
} from "@/views/events/roadshows/js/event_variants";
import { EVENT_VARIANT } from "@/constants";
import EventApi from "@/api/events";
import EventStatusEditable from "@/components/form/EventStatusEditable";
import SConfirm from "@/s-components/Dialog/SConfirm";
import SButton from "@/s-components/Button/SButton.vue";
import get from "lodash-es/get";

export default {
  components: { SButton, EventStatusEditable, EventInviteRequestModal, SConfirm },
  props: {
    showCompanyColumn: {
      type: Boolean,
      required: true,
    },
    showInviteRequestLinkColumn: {
      type: Boolean,
      required: true,
    },
    showEditButton: {
      type: Boolean,
      required: true,
    },
    getEventsQueryParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      EVENT_VARIANT,
      loading: true,
      textFilter: "",
      eventIdToDelete: null,
      currentDialogItem: null,
      events: [],
      requestInviteLink: {
        selectedEvent: null,
        dialogVisible: false,
      },
      pagination: {
        itemsPerPage: 10,
        page: 1,
        sortBy: [{ key: "start_date", order: "desc" }],
      },
      totalEvents: 0,
      confirmDialogReplicate: false,
      confirmDialogDelete: false,
      selectedEvent: {},
    };
  },
  computed: {
    ...mapGetters(["isAnyAdmin", "isAuthorized", "isAuthorizedAll", "isAuthorizedAny"]),
    headers() {
      return [
        { title: "Date", value: "start_date", sortable: true, width: "160px" },
        { title: "Event name", sortable: false },
        ...(this.showCompanyColumn ? [{ title: "Company", sortable: false }] : []),
        { title: "Variant", sortable: false },
        { title: "Time-zone / Location", sortable: false },
        { title: "Status", sortable: false },
        { title: "Created by", sortable: false },
        { align: "right", sortable: false, width: "180px" },
      ];
    },
  },
  watch: {
    getEventsQueryParams() {
      this.getEvents();
    },
  },
  methods: {
    get,
    formatMultiDayEvent(dates) {
      return dates.map((date) => this.formatDate(date)).join(", ");
    },
    clearCompoundEventVariant,
    formatLocation,
    isSingleCompanyVariant,
    getEvents(options) {
      const pagination = options || this.pagination;
      const { page, itemsPerPage, sortBy } = pagination;
      const sort = sortBy[0]
        ? `${sortBy[0].order === "asc" ? "" : "-"}` + sortBy[0].key
        : "-start_date";

      this.loading = true;
      const include = [
        "creator",
        "location",
        "eventType",
        "status",
        "secondaryOwners",
        "slots.location",
      ];
      if (this.showCompanyColumn) {
        include.push("company");
      }
      EventApi.list({
        include: include.join(","),
        deletable: true,
        limit: itemsPerPage,
        page,
        sort,
        ...this.getEventsQueryParams,
      })
        .then(({ data, meta }) => {
          this.events = data;
          this.totalEvents = meta.total;
        })
        .finally(() => {
          this.loading = false;
        });
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
      if (isSixVariant(event) && this.isAuthorized("manage_six_events")) {
        return true;
      }
      return false;
    },
    isEventViewable(event) {
      return event.variant !== EVENT_VARIANT.SIX;
    },
    changeStatus(eventId, status) {
      EventApi.status(eventId, status.id).then(() => {
        this.success("Status successfully changed.");
        const event = this.events.find((event) => event.id === eventId);
        if (event) {
          event.status = status;
        }
      });
    },
    canDeleteEvent(event) {
      return this.canManageEvent(event) && event.is_deletable === true && !event.deleted_at;
    },
    onConfirmDeleting(event) {
      this.confirmDialogDelete = true;
      this.selectedEvent = event;
    },
    confirmDeleting(event) {
      this.loading = true;
      EventApi.delete(event.id).then((response) => {
        this.success(response.message);
        this.getEvents();
      });
      this.eventIdToDelete = null;
    },
    creatorName(event) {
      return event.creator ? event.creator.full_name : "n/a";
    },
    showRequestLinkModal(item) {
      this.requestInviteLink.selectedEvent = item;
      this.requestInviteLink.dialogVisible = true;
    },
    onConfirmReplicating(eventId) {
      this.confirmDialogReplicate = true;
      this.selectedEvent = eventId;
    },
    confirmReplicating(eventId) {
      EventApi.replicate(eventId).then((data) => {
        this.$router.push({
          name: "single-company-events-edit",
          params: { id: data.data.id },
        });
      });
    },
  },
};
</script>
