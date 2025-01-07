<template>
  <v-container v-if="event" fluid>
    <v-card variant="outlined" class="bg-white">
      <v-card-title class="pa-3">Event Details</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="5">
            <span class="label">Event:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">{{ event.name }}</span>
          </v-col>
        </v-row>
        <v-row v-if="remark">
          <v-col cols="5">
            <span class="label">Remarks:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">{{ remark }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <span class="label">Date:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">{{ formatDate(event.start_date.date) }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <span class="label">Time:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">
              {{ eventTime(event) }}
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5">
            <span class="label">Company:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">
              {{ event.company.name }}
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="5">
            <span class="label">Location/Time zone:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">
              {{ eventLocation }}
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="5">
            <span class="label">Type:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">
              {{ eventType }}
            </span>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="5">
            <span class="label">Corporate representatives:</span>
          </v-col>
          <v-col cols="7">
            <span class="value">
              {{ eventRepresentatives }}
            </span>
          </v-col>
        </v-row>

        <template v-if="slot">
          <template v-if="!isPhoneOnline">
            <v-row>
              <v-col cols="5">
                <span class="label">Venue:</span>
              </v-col>
              <v-col cols="7">
                <span class="value"> {{ slotAddress }} </span>
              </v-col>
            </v-row>
          </template>

          <template v-if="isPhoneOnline && !isZoomConference">
            <v-row v-if="slot.venue.url">
              <v-col cols="5">
                <span class="label">URL/Webcast:</span>
              </v-col>
              <v-col cols="7">
                <clickable-urls-and-phones :text="slot.venue.url"></clickable-urls-and-phones>
              </v-col>
            </v-row>

            <v-row v-if="slot.venue.url">
              <v-col cols="5">
                <span class="label">Dial-in:</span>
              </v-col>
              <v-col cols="7">
                <clickable-urls-and-phones
                  v-if="slot.venue.phone"
                  :text="slot.venue.phone"
                ></clickable-urls-and-phones>
                <span v-else>-</span>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="5">
                <span class="label">Details:</span>
              </v-col>
              <v-col cols="7">
                <span class="value">
                  {{ slot.venue.details || "-" }}
                </span>
              </v-col>
            </v-row>
          </template>

          <template v-if="isZoomConference">
            <v-row>
              <v-col cols="5">
                <span class="label">Zoom meeting ID:</span>
              </v-col>
              <v-col cols="7">
                <span class="value">
                  <template v-if="'id' in zoomCredentials">
                    {{ zoomCredentials.id }}
                  </template>
                  <template v-else> Zoom credentials are not set </template>
                </span>
              </v-col>
            </v-row>

            <v-row v-if="'id' in zoomCredentials">
              <v-col cols="5">
                <span class="label">URL:</span>
              </v-col>
              <v-col cols="7">
                Join meeting by
                <a :href="zoomCredentials.meeting_link" target="_blank">clicking here</a>
              </v-col>
            </v-row>
          </template>
        </template>

        <template v-if="isFutureEvent(event)">
          <v-row v-if="!slot && invite">
            <v-col cols="5">
              <span class="label">Book slot:</span>
            </v-col>
            <v-col cols="7">
              <s-button :to="bookingRoute"> Book Slot </s-button>
            </v-col>
          </v-row>

          <v-row v-else-if="slot">
            <v-col cols="5">
              <span class="label">Add to calendar:</span>
            </v-col>
            <v-col cols="7">
              <s-button
                v-if="event.calendar_links.google"
                type="secondary"
                :href="event.calendar_links.google"
                target="_blank"
                class="mr-3"
              >
                <img
                  class="mr-2"
                  width="16px"
                  src="@/assets/google_calendar.png"
                  alt="Google calendar"
                  title="Google calendar"
                />
                Google calendar
              </s-button>

              <s-button
                v-if="event.calendar_links.ics"
                type="secondary"
                :href="event.calendar_links.ics"
              >
                <img
                  class="mr-2"
                  width="16px"
                  src="@/assets/outlook_calendar.svg"
                  alt="Outlook calendar"
                  title="Outlook calendar"
                />
                Outlook calendar
              </s-button>
            </v-col>
          </v-row>
          <v-row v-if="!invite && !slot">
            <v-col cols="5">
              <span class="label">Book slot:</span>
            </v-col>
            <v-col cols="7">
              <s-button
                type="secondary"
                :disabled="!isEventInteractionRequestAvailable(event) || !isEventHasSlots"
                :to="{
                  name: 'investor-request-event',
                  params: { eventId: event.id },
                }"
              >
                Request an invite
              </s-button>
            </v-col>
          </v-row>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { eventTime, formatLocation, isFutureEvent } from "../../investor/events/helpers";
import { mapGetters } from "vuex";
import { EVENT_VARIANT, SLOT_TYPES, VENUE_TYPES } from "@/constants";
import { formatTimeZoneAbbrFromSQLString } from "@/functions/dates";
import SButton from "@/s-components/Button/SButton.vue";
import PublicEventsApi from "@/api/public-events";
import ClickableUrlsAndPhones from "@/views/events/components/ClickableUrlsAndPhones.vue";

export default {
  name: "ViewInvestorEvent",
  components: { ClickableUrlsAndPhones, SButton },
  data() {
    return {
      event: null,
    };
  },
  computed: {
    ...mapGetters(["userData"]),
    slot() {
      return this.event.slots.find((slot) =>
        slot.investors.some((investor) => investor.id === this.userData.id)
      );
    },
    invite() {
      return this.event.invites.find((invite) => invite.investor.id === this.userData.id);
    },
    isPhoneOnline() {
      return (
        this.slot.type_id === SLOT_TYPES.ONE_TO_ONE_PHONE_ONLINE ||
        this.slot.type_id === SLOT_TYPES.GROUP_PHONE_ONLINE ||
        (this.slot.venue && this.slot.venue.type_id === 5)
      );
    },
    isZoomConference() {
      return (
        this.slot && this.slot.venue && this.slot.venue.type_id === VENUE_TYPES.ZOOM_CONFERENCE
      );
    },
    zoomCredentials() {
      return this.isZoomConference ? this.event.owned_company.zoom_credentials : null;
    },
    eventLocation() {
      if (this.slot) {
        return this.slot.location.name;
      } else {
        return this.formatLocation(this.event);
      }
    },
    eventType() {
      if (this.slot) {
        return this.slot.type;
      } else {
        return this.event.slots[0] ? this.event.slots[0].type : "-";
      }
    },
    eventRepresentatives() {
      if (this.slot) {
        return this.slot.representatives
          .map((rep) => `${rep.full_name} (${rep.company_function})`)
          .join(", ");
      } else {
        return this.event.slots[0] && this.event.slots[0].location
          ? this.event.slots[0].representatives
              .map((rep) => `${rep.full_name} (${rep.company_function})`)
              .join(", ")
          : "-";
      }
    },
    remark() {
      if (isFutureEvent(this.event) && this.slot) {
        return "Upcoming, you booked a slot";
      }
      if (!isFutureEvent(this.event) && this.slot) {
        return "Past event, you participated";
      }
      if (isFutureEvent(this.event) && !this.slot && this.invite && this.isEventBookable) {
        return "Upcoming, you can still book your slot ";
      }
      if (isFutureEvent(this.event) && !this.isEventBookable) {
        return "Upcoming, booking closed";
      }

      return "";
    },
    slotAddress() {
      const firstInvestor = this.slot.investors[0];

      if (
        this.slot.venue.type_id === VENUE_TYPES.INVESTOR_OFFICE &&
        firstInvestor &&
        firstInvestor.profile
      ) {
        const { city, address, zip_code, phone } = firstInvestor.profile;
        const officeAddress = [address, city, zip_code, phone].filter((item) => !!item).join(", ");
        return officeAddress ? `Investor's office: ${officeAddress}` : "-";
      }

      const { venue_name, address, city, phone } = this.slot.venue;
      const venueAddress = [venue_name, address, city, phone].filter((item) => !!item).join(", ");
      return venueAddress || "-";
    },
    isEventBookable() {
      return this.event.slots.every((slot) => slot.investors_count < slot.size);
    },
    isEventHasSlots() {
      return this.event.slots.length > 0;
    },
    bookingRoute() {
      return {
        name: "single-company-event-invite",
        params: { token: this.invite.token },
      };
    },
  },
  created() {
    this.loadEvent();
  },
  methods: {
    eventTime,
    isFutureEvent,
    formatTimeZoneAbbrFromSQLString,
    formatLocation,
    loadEvent() {
      const includes = [
        "location",
        "company",
        "slots.location",
        "slots.representatives",
        "slots.investors.profile",
        "slots.venue",
        "invites",
        "invites.investor",
        "ownedCompany",
      ];

      const params = {
        include: includes.join(","),
      };

      PublicEventsApi.getPublicEventById(this.$route.params.id, params).then((response) => {
        this.event = response.data;

        const pageTitle = `Event details - ${this.event.name} - ${this.formatDate(
          this.event.start_date.date
        )}`;
        this.$setPageTitle(pageTitle);
      });
    },
    isEventInteractionRequestAvailable(event) {
      const isSixVariant = [EVENT_VARIANT.SIX, EVENT_VARIANT.SINGLE_COMPANY_AND_SIX].includes(
        event.variant
      );

      const isCrmVariant = [
        EVENT_VARIANT.SINGLE_COMPANY,
        EVENT_VARIANT.SINGLE_COMPANY_AND_SIX,
      ].includes(event.variant);

      const isSixOrCalendarRequestInvitesEnabled =
        isSixVariant &&
        event.sixEvent &&
        (event.sixEvent.request_invite_enabled ||
          event.sixEvent.request_invite_enabled_on_calendar);

      const isCrmRequestInviteEnabled = isCrmVariant && event.publish_request_invite_link;

      return (
        event.company.receives_emails &&
        (isCrmRequestInviteEnabled || isSixOrCalendarRequestInvitesEnabled)
      );
    },
  },
};
</script>

<style scoped>
.label {
  font-size: 14px;
  line-height: 16px;
  color: #75808e;
}

.value {
  color: #1d2f3d;
}
</style>
