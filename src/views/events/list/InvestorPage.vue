<template>
  <v-row>
    <!-- UPCOMING EVENTS -->
    <v-col cols="12">
      <h2 class="title text-grey">Your upcoming events</h2>
    </v-col>
    <v-col v-if="upcomingEvents.length == 0" cols="12">
      <v-alert variant="outlined" class="mb-4" :model-value="true" type="info">
        No Upcoming events
      </v-alert>
    </v-col>
    <v-col
      v-for="event in upcomingEvents"
      :key="event.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
      class="mb-3"
    >
      <v-col>
        <v-col
          v-for="slot in event.slots"
          :key="slot.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="mb-3"
        >
          <investor-event-card :event="event" :event-slot="slot"></investor-event-card>
        </v-col>
      </v-col>
    </v-col>

    <!-- OPEN INVITATION -->
    <v-col cols="12">
      <h2 class="title text-grey">Open invitations</h2>
    </v-col>
    <v-col v-if="openInvitation.length == 0" cols="12">
      <v-alert variant="outlined" class="mb-4" :model-value="true" type="info">
        No Open invitations
      </v-alert>
    </v-col>
    <v-col
      v-for="event in openInvitation"
      :key="event.id"
      cols="12"
      sm="6"
      md="4"
      lg="3"
      class="mb-3"
    >
      <investor-event-card :event="event"></investor-event-card>
    </v-col>

    <!-- PAST EVENTS -->
    <v-col cols="12">
      <h2 class="title text-grey">Past events</h2>
    </v-col>
    <v-col v-if="pastEvents.length == 0" cols="12">
      <v-alert variant="outlined" class="mb-4" :model-value="true" type="info">
        No Past events
      </v-alert>
    </v-col>
    <v-col v-for="event in pastEvents" :key="event.id" cols="12" sm="6" md="4" lg="3" class="mb-3">
      <v-col>
        <v-col
          v-for="slot in event.slots"
          :key="slot.name"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="mb-3"
        >
          <investor-event-card :event="event"></investor-event-card>
        </v-col>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
import InvestorEventCard from "@/components/investor/InvestorEventCard";

export default {
  components: { InvestorEventCard },
  computed: {
    upcomingEvents() {
      return this.$store.getters.upcomingEvents;
    },
    openInvitation() {
      return this.$store.getters.openInvitationEvents;
    },
    pastEvents() {
      return this.$store.getters.pastEvents;
    },
  },
  created() {
    this.$store.dispatch("getAllInvestorEvents");
  },
};
</script>
