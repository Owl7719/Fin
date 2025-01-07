<template>
  <v-card class="s-dashboard-info-card bg-white" variant="outlined">
    <v-container class="py-1" fluid>
      <v-data-table
        :mobile-breakpoint="0"
        :headers="headers"
        :items="items"
        hide-default-footer
        :no-data-text="noDataText"
      >
        <template #top>
          <v-toolbar flat density="comfortable" class="bg-white">
            <v-row dense align="center">
              <v-col class="s-dashboard-title d-flex align-center">{{ title }}</v-col>
              <v-col cols="auto">
                <div class="text-right">
                  <s-button
                    v-if="topButtonText && topButtonAction"
                    class="ma-0"
                    type="tertiary"
                    @click="() => topButtonAction()"
                  >
                    {{ topButtonText }}
                  </s-button>
                </div>
              </v-col>
            </v-row>
          </v-toolbar>
          <v-divider></v-divider>
        </template>
        <template #item="{ item }">
          <slot name="item" :item="item"></slot>
        </template>
      </v-data-table>
    </v-container>
  </v-card>
</template>

<script>
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton },
  props: {
    title: {
      type: String,
      required: true,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    noDataText: {
      type: String,
      default: "No data available.",
    },
    topButtonAction: {
      type: Function,
      default: null,
    },
    topButtonText: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.s-dashboard-title {
  font-weight: 400;
  font-size: 16px;
  color: #1d2f3d;
}

:deep(.v-data-table > .v-data-table__wrapper > table > tbody > tr > td) {
  font-weight: 400;
  font-size: 14px !important;
  color: #1d2f3d;
  line-height: 16px;
}

:deep(.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover) {
  background-color: transparent !important;
}
</style>
