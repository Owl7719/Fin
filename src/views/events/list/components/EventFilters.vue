<template>
  <div>
    <div class="d-flex align-center">
      <v-text-field
        :model-value="modelValue.text_filter"
        clearable
        persistent-clear
        autofocus
        bg-color="white"
        variant="outlined"
        density="comfortable"
        base-color="#D1D5DA"
        color="primary"
        placeholder="Search by name"
        hide-details
        @update:model-value="debounceTextFilter"
      ></v-text-field>

      <v-btn
        class="ml-3 btn-border-secondary"
        height="48"
        variant="outlined"
        @click="toggleFilters"
      >
        {{ filtersOpened ? "Hide filters" : "Show filters" }}
      </v-btn>
    </div>

    <div v-if="displayFiltersData.length > 0">
      <v-chip
        v-for="{ key, keyName, valueName } in displayFiltersData"
        :key="key"
        class="mr-2 mt-2"
        label
        size="small"
        close-icon="close"
        closable
        @click:close="clearFilter(key)"
      >
        <strong>{{ keyName }}</strong>
        &nbsp;
        <span>{{ valueName }}</span>
      </v-chip>
    </div>

    <v-expansion-panels v-model="filtersPanelState" :class="panelClass" flat multiple>
      <v-expansion-panel>
        <v-expansion-panel-text>
          <v-card flat>
            <v-card-text class="filters-container pa-3">
              <s-date-input
                :model-value="modelValue.dateAfter"
                class="w-100 filter-item"
                style="min-width: 250px"
                label="Date from"
                clearable
                @update:model-value="changed({ dateAfter: $event })"
              ></s-date-input>

              <s-date-input
                :model-value="modelValue.dateBefore"
                class="w-100 filter-item"
                style="min-width: 250px"
                label="Date to"
                clearable
                @update:model-value="changed({ dateBefore: $event })"
              ></s-date-input>

              <company-search
                v-if="showCompanyFilter"
                class="filter-item"
                :disabled="disabledFilters.company"
                label="Company"
                :model-value="modelValue.company"
                clearable
                :counter="false"
                :force-selection="false"
                @update:model-value="companyChanged"
              ></company-search>

              <event-locations-select
                class="filter-item"
                multiple
                ordered
                clearable
                label="Location"
                :model-value="modelValue.locationId"
                @update:model-value="changed({ locationId: $event })"
              ></event-locations-select>

              <event-variants-select
                class="filter-item"
                label="Variant"
                :model-value="modelValue.variants"
                :disable-variants="disabledVariants"
                :disabled="disabledFilters.variants"
                @update:model-value="
                  changed(
                    Object.assign({ variants: $event }, disableCrmSpecificTypeFilters($event))
                  )
                "
              ></event-variants-select>

              <event-types-select
                class="filter-item"
                messages="Not for Calendar events"
                label="Event type"
                :model-value="modelValue.typeId"
                :disabled="disabledFilters.typeId"
                @update:model-value="
                  changed(Object.assign({ typeId: $event }, excludeCalendarOnValue('Type', $event)))
                "
              ></event-types-select>

              <event-statuses-select
                class="filter-item"
                messages="Not for Calendar events"
                clearable
                label="Status"
                :model-value="modelValue.status"
                :disabled="disabledFilters.status"
                @update:model-value="
                  changed(
                    Object.assign({ status: $event }, excludeCalendarOnValue('Status', $event))
                  )
                "
              ></event-statuses-select>

              <v-checkbox
                v-if="isSuperAdmin"
                :model-value="modelValue.with_trashed"
                label="Show archived"
                color="primary"
                hide-details
                @update:model-value="changed({ with_trashed: $event })"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import debounce from "lodash-es/debounce";
import CompanySearch from "@/components/form/CompanySearch";
import EventLocationsSelect from "@/components/form/EventLocationsSelect";
import EventVariantsSelect from "@/components/form/EventVariantsSelect";
import { mapGetters } from "vuex";
import EventTypesSelect from "@/components/form/EventTypesSelect";
import { EVENT_VARIANT } from "@/constants";
import { formatVariant } from "@/views/events/roadshows/js/event_variants";
import EventStatusesSelect from "@/components/form/EventStatusesSelect";
import SDateInput from "@/s-components/Form/SDateInput.vue";

const isEmptyValue = (v) => {
  if (Array.isArray(v)) {
    return v.length === 0;
  }
  return !v;
};

export default {
  components: {
    SDateInput,
    EventStatusesSelect,
    EventTypesSelect,
    EventVariantsSelect,
    EventLocationsSelect,
    CompanySearch,
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        text_filter: "",
        company: null,
        companyId: null,
        locationId: null,
        variants: null,
        typeId: null,
        status: null,
        dateAfter: null,
        dateBefore: null,
        with_trashed: null,
      }),
    },
    showCompanyFilter: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      filtersPanelState: [],
      showCalVariant: true,
      disabledFilters: {
        company: false,
        variants: false,
        typeId: false,
        status: false,
      },
      filtersCounterForDisableCal: {},
    };
  },
  computed: {
    ...mapGetters(["isAnyAdmin", "settings", "isSuperAdmin"]),
    filterNames() {
      return {
        company: "Company",
        text_filter: "Text search",
        dateAfter: "Date from",
        dateBefore: "Date to",
        locationId: "Location",
        typeId: "Event type",
        variants: "Variant",
        status: "Status",
        with_trashed: "Show archived",
      };
    },
    filtersOpened() {
      return typeof this.filtersPanelState[0] !== "undefined";
    },
    disabledVariants() {
      const disabledVariants = [];
      if (!this.showCalVariant) {
        disabledVariants.push(EVENT_VARIANT.SIX);
      }
      return disabledVariants;
    },
    displayFiltersValueFormatters() {
      const dict =
        (dictionary, textKey = "name") =>
        (id) => {
          if (Array.isArray(id)) {
            const entries = dictionary.filter((it) => id.includes(it.id)).map((it) => it[textKey]);
            return entries.join(", ");
          }
          const entry = dictionary.find((it) => it.id === id);
          return entry ? entry[textKey] : "?";
        };
      const id = (v) => v;
      return {
        text_filter: id,
        company: (company) => company.name,
        variants: formatVariant,
        typeId: dict(this.settings.eventTypes),
        locationId: dict(this.settings.eventLocations),
        status: dict(this.settings.eventStatuses, "text"),
        dateAfter: id,
        dateBefore: id,
        with_trashed: (v) => (v ? "Yes" : ""),
      };
    },
    displayFiltersData() {
      const formatters = this.displayFiltersValueFormatters;
      const displayFiltersData = [];

      for (const [key, value] of Object.entries(this.modelValue)) {
        if (!isEmptyValue(value) && key in formatters) {
          displayFiltersData.push({
            key,
            keyName: this.filterNames[key],
            valueName: formatters[key](this.modelValue[key]),
          });
        }
      }

      return displayFiltersData;
    },
    panelClass() {
      return this.filtersPanelState.length ? "mt-2 mb-3 border-1" : "";
    },
  },
  methods: {
    toggleFilters() {
      this.filtersPanelState = this.filtersOpened ? [] : [0];
    },
    changed(changes) {
      let newValues = { ...this.modelValue, ...changes };
      this.$emit("update:modelValue", newValues);
    },
    clearFilter(key) {
      this.changed({ ...this.modelValue, [key]: null });
    },
    debounceTextFilter: debounce(function (text_filter) {
      this.changed({ text_filter });
    }, 500),
    companyChanged(data) {
      const companyId = data && data.id;
      if (!companyId && !this.modelValue.companyId) {
        return;
      }
      this.changed({ company: data, companyId });
    },
    disableCrmSpecificTypeFilters(variant) {
      if (variant === EVENT_VARIANT.SIX) {
        this.disabledFilters.typeId = true;
        this.disabledFilters.status = true;
        return { typeId: null, status: null };
      } else {
        this.disabledFilters.typeId = false;
        this.disabledFilters.status = false;
        return {};
      }
    },
    excludeCalendarOnValue(type, value) {
      if (value) {
        this.filtersCounterForDisableCal[type] = (this.filtersCounterForDisableCal[type] || 0) + 1;
      } else {
        delete this.filtersCounterForDisableCal[type];
      }

      if (Object.keys(this.filtersCounterForDisableCal).length) {
        this.showCalVariant = false;
        return { notVariants: EVENT_VARIANT.SIX };
      } else {
        this.showCalVariant = true;
        return { notVariants: null };
      }
    },
  },
};
</script>

<style scoped>
.date-input {
  position: relative;
  top: -4px;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
}

.filter-item {
  max-width: 250px;
  margin: 4px 8px;
  flex: 1 1 240px;
}

:deep(.v-input__control) {
  display: block;
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0 !important;
}
</style>
