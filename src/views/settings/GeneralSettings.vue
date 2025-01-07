<template>
  <v-container fluid>
    <v-widget :enable-header="false" variant="outlined" class="pb-1 bg-white">
      <template #widget-content>
        <v-tabs v-model="active" :show-arrows="false" grow slider-color="primary" color="primary">
          <v-tab v-for="tab in tabs" :key="tab.name" ripple>
            {{ tab.name }}
          </v-tab>
        </v-tabs>

        <v-tabs-window
          v-model="active"
          class="pa-4"
          :transition="false"
          :reverse-transition="false"
        >
          <v-tabs-window-item v-for="tab in tabs" :key="tab.name">
            <component :is="tab.component"></component>
          </v-tabs-window-item>
        </v-tabs-window>
      </template>
    </v-widget>
  </v-container>
</template>

<script>
import AssetClasses from "./general/AssetClasses";
import Sectors from "./general/SectorsComponent.vue";
import EventLocations from "./general/EventLocations";
import StockCountries from "./general/StockCountries";
import EventStatuses from "./general/EventStatuses";
import CompanyTypes from "./general/CompanyTypes";
import AumOptions from "./general/AumOptions";
import EventTypes from "./general/EventTypes";
import CustomSenderEmails from "./general/CustomSenderEmails";
import TermsVersions from "./general/TermsVersions";
import SixAdHoc from "./general/SixAdHoc";

export default {
  components: {
    AssetClasses,
    Sectors,
    EventLocations,
    StockCountries,
    EventStatuses,
    CompanyTypes,
    AumOptions,
    EventTypes,
    CustomSenderEmails,
    TermsVersions,
    SixAdHoc,
  },
  data() {
    return {
      active: null,
      tabs: [
        { component: "AssetClasses", name: "Asset Classes" },
        { component: "Sectors", name: "Sectors" },
        { component: "EventLocations", name: "Event Locations" },
        {
          component: "StockCountries",
          name: "Stock Exchange Countries",
        },
        { component: "EventStatuses", name: "Event Status" },
        { component: "CompanyTypes", name: "Company Types" },
        { component: "AumOptions", name: "AUM options" },
        { component: "EventTypes", name: "Event Types" },
        {
          component: "CustomSenderEmails",
          name: "Custom Sender's Emails",
        },
        { component: "TermsVersions", name: "Terms Versions" },
        { component: "SixAdHoc", name: "SIX Ad hoc" },
      ],
    };
  },
};
</script>
