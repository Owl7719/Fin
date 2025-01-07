<template>
  <v-container v-if="event" fluid>
    <v-row>
      <v-col>
        <v-widget class="mb-3 bg-white" title="Event Details" variant="outlined">
          <template #widget-header-action>
            <v-tooltip location="top" open-on-click>
              <template #activator="{ props }">
                <v-chip
                  label
                  variant="flat"
                  size="small"
                  color="warning"
                  text-color="black"
                  style="float: right"
                  v-bind="props"
                >
                  {{ event.status.text }}
                </v-chip>
              </template>
              <span>Status</span>
            </v-tooltip>
          </template>

          <template #widget-content>
            <v-row class="pa-2">
              <v-col cols="12" sm="7">
                <v-row class="flex-column subtitle font-weight-regular">
                  <v-col>
                    <h2 class="event-view__title">
                      {{ event.name }}
                    </h2>
                  </v-col>
                  <v-col class="value">{{ event.event_type.name }}</v-col>
                  <v-col class="value">
                    {{ datesPeriods(event.period_formatted) }}
                  </v-col>
                  <v-col class="value"> {{ locations }}</v-col>
                  <v-col v-if="canSeeOwnershipData && event.shares_covered" class="value">
                    {{ event.shares_covered }}% of shares covered
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12" sm="5">
                <v-data-value top-text="Company participants">
                  <v-spacer class="mt-1"></v-spacer>
                  <event-participants :participants="participants"></event-participants>
                </v-data-value>
                <v-data-value top-text="Event coordinators" class="mt-4">
                  <v-spacer class="mt-1"></v-spacer>
                  <event-participants :participants="coordinators || []"></event-participants>
                </v-data-value>
              </v-col>
            </v-row>
          </template>
        </v-widget>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="border-t border-e border-s rounded-s bg-white">
          <v-tabs v-model="activeTab" slider-color="primary" color="primary">
            <v-tab v-for="tab in tabs" :key="tab.name()" ripple style="font-size: 16px">
              {{ tab.name() }}
            </v-tab>
          </v-tabs>
        </div>

        <v-tabs-window v-model="activeTab" class="border-b border-s border-e">
          <v-tabs-window-item
            v-for="tab in tabs"
            :key="tab.name()"
            :transition="false"
            :reverse-transition="false"
          >
            <v-card flat>
              <v-card-text class="pa-0">
                <component
                  :is="tab.component"
                  :event="event"
                  :join-urls="joinUrls"
                  :company-id="companyId"
                  @refresh-event="loadEvent"
                ></component>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>

    <notes-dialog ref="notes-dialog"></notes-dialog>
  </v-container>
</template>

<script>
import { bus } from "@/plugins/bus";
import VDataValue from "@/components/VDataValue";
import EventParticipants from "./components/EventParticipants";
import NotesDialog from "./components/NotesDialog";
import Attendants from "./tabs/AttendantsComponent.vue";
import Feedback from "./tabs/FeedbackComponent.vue";
import { flatInvestorsFromSlots, datesPeriods } from "./helpers";
import find from "lodash-es/find";
import { mapGetters } from "vuex";
import { formatEventName } from "../roadshows/js/functions";
import { uniqBy } from "lodash/array";
import uniq from "lodash-es/uniq.js";
import SingleEvent from "@/views/events/view/components/schedule/SingleEvent.vue";
import EventApi from "@/api/events";
import AttendanceManagementApi from "@/api/attendance-management";

const select = [
  "id,name,period_formatted,start_date,dates,shares_covered,shareholder_company_ids,owned_company_id,remarks",

  "logistics{}",
  "status{text}",
  "eventType{name}",
  "company{id,name,shares_outstanding}",
  "slots{}",
  "slots{representatives{uuid,id,full_name,order,company_function,profile{any_phone}}}",
  "slots{location{}}",
  "slots{venue{}}",
  "slots{investors{id,uuid,email,full_name,last_name,company_id,slot_data,company_function,investor_type}}",
  "slots{investors{company{id,name},profile{id,any_phone}}}",
  "slots{interactionLogs{interaction{}}}",
  "secondaryOwners{id,name}",
  "companyCoordinators{full_name,company_function,profile{any_phone}}",
  "systemCoordinator{full_name,company_function,profile{any_phone}}",
  "ownedCompany{id, zoom_credentials}",
].join(",");

export default {
  components: {
    VDataValue,
    EventParticipants,
    NotesDialog,
    Attendants,
    SingleEvent,
    Feedback,
  },
  data() {
    return {
      joinUrls: {},
      activeTab: null,
      event: null,
      tabs: [
        { name: () => `Schedule & Notes`, component: "SingleEvent" },
        {
          name: () => `Attendance & Profiles (${this.investorsCount})`,
          component: "Attendants",
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "isAnyAdmin",
      "isCorporate",
      "userData",
      "isAuthorized",
      "isSuperAdmin",
      "isAuthorizedAny",
    ]),
    canSeeOwnershipData() {
      return (
        (this.isAnyAdmin && this.isAuthorized("manage_all_ownership_data")) ||
        (this.isCorporate && this.isAuthorized("manage_related_ownership_data"))
      );
    },
    locations() {
      const locations = uniq(
        this.event.slots.filter((it) => it.location).map((it) => it.location.name)
      );

      return locations.length ? locations.join(", ") : "n/a";
    },
    companyId() {
      return this.$store.state.user.data.company_id;
    },
    investorsCount() {
      if (!this.event) {
        return 0;
      }
      return flatInvestorsFromSlots(this.event).length;
    },
    slotsCount() {
      if (!this.event) {
        return 0;
      }
      return this.event.slots.length;
    },
    coordinators() {
      const coordinators = [];
      if (this.event.system_coordinator) {
        coordinators.push(this.event.system_coordinator);
      }
      return coordinators.concat(this.event.company_coordinators).filter((el) => el);
    },
    participants() {
      return uniqBy(this.event.slots.map((it) => it.representatives).flat(), (it) => it.id).sort(
        (a, b) => a.order - b.order
      );
    },
  },
  created() {
    this.addListeners();
    this.loadEvent().then((event) => {
      if (this.$route.params.tab && this.$route.params.tab === "feedback") {
        this.activeTab = 2;
      }
      this.tabs.push({
        name: () => `Investor Feedback `,
        component: "Feedback",
      });

      this.$setPageTitle(null, formatEventName(event));
      this.showEditButtonIfEditingAllowed();
      this.getJoinUrls();
    });
  },
  unmounted() {
    this.removeListeners();
  },
  methods: {
    loadEvent() {
      return this.getEvent(this.$route.params.id).then((event) => {
        this.event = event;
        return event;
      });
    },
    datesPeriods,
    async getJoinUrls() {
      const { data } = await AttendanceManagementApi.getRepresentativeJoinUrls(this.event.id);
      this.joinUrls = Array.isArray(data) ? {} : data;
    },
    addListeners() {
      bus.on("showProfile", this.showProfile);
      bus.on("showNotes", this.showNotes);
      bus.on("updateInteraction", this.updateInteraction);
    },
    removeListeners() {
      bus.off("showProfile");
      bus.off("showNotes");
      bus.off("updateInteraction");
    },
    canEditEvent(event) {
      return (
        this.$store.getters.isAnyAdmin ||
        event.owned_company_id == this.userData.company_id ||
        this.$isEventOwner(event)
      );
    },
    showEditButtonIfEditingAllowed() {
      if (this.canEditEvent(this.event)) {
        bus.emit("setPageTopButtons", [
          {
            icon: "edit",
            slot: "Edit",
            type: "secondary",
            iconOutlined: true,
            callback: {
              action: () => {
                this.$router.push({
                  name: "single-company-events-edit",
                  params: { id: this.$route.params.id },
                });
              },
            },
          },
        ]);
      }
    },
    getEvent(eventId) {
      return EventApi.v2get(eventId, {
        select,
        slotIcsWithAttendants: 1,
        withSharesCovered: 1,
        withShareholderCompanyIds: 1,
      }).then((response) => response.data);
    },
    showProfile(uuid) {
      this.$router.push({ name: "investor-profile", params: { uuid } });
    },
    showNotes({ investor, slot }) {
      const interaction = find(slot.interactionLogs, {
        user_id: investor.id,
        logable_id: slot.id,
      });
      this.$refs["notes-dialog"].showDialog(interaction, investor);
    },
    updateInteraction(updatedLogData) {
      const slot = find(this.event.slots, { id: updatedLogData.slot_id });
      for (let i in slot.interactionLogs) {
        if (slot.interactionLogs[i].id == updatedLogData.id) {
          slot.interactionLogs[i].interaction.ownership_comment = updatedLogData.comment;
          slot.interactionLogs[i].interaction.notes = updatedLogData.notes;
          slot.interactionLogs[i].interaction.quality = updatedLogData.quality;
          return;
        }
      }
    },
  },
};
</script>

<style scoped>
.border-1 {
  border-radius: 4px;
}

i {
  position: relative;
  top: 2px;
}

:deep(.title-custom) {
  font-size: 20px !important;
}

:deep(.value) {
  font-size: 14px;
  line-height: 16px;
  color: #1d2f3d;
}

.event-view__title {
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: #1d2f3d;
}
</style>
