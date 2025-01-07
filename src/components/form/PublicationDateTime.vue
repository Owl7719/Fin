<template>
  <div>
    <v-row :class="publicationDateTimeClass">
      <v-col :class="publicationDateTimeItemClass">
        <s-date-input
          v-model="date"
          label="Publication Date"
          prepend-icon="event"
          hide-details
          @update:model-value="emitInput"
        ></s-date-input>
      </v-col>

      <v-col :class="publicationDateTimeItemClass">
        <time-input
          v-model="time"
          label="Publication Time"
          :suffix="selectedDateTimezone"
          prepend-icon="access_time"
          :append-icon="false"
          @update:model-value="emitInput"
        >
        </time-input>
      </v-col>
    </v-row>
    <div v-if="displayErrorForPastDate && !isFutureDate" class="text-red">
      Please select a future date
    </div>
  </div>
</template>

<script>
import {
  isFuture,
  formatSqlDateTimeToUtc,
  formatTimeZoneAbbrFromSQLString,
} from "@/functions/dates";
import SDateInput from "@/s-components/Form/SDateInput.vue";
import TimeInput from "@/views/events/roadshows/components/TimeInput.vue";

export default {
  name: "PublicationDateTime",
  components: { TimeInput, SDateInput },
  props: {
    displayErrorForPastDate: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      // date time full, example: "2022-03-05 12:00:00"
      type: String,
      required: true,
    },
    column: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      date: null,
      time: null,
    };
  },
  computed: {
    isFutureDate() {
      return isFuture(formatSqlDateTimeToUtc(this.modelValue));
    },
    selectedDateTimezone() {
      return this.modelValue ? formatTimeZoneAbbrFromSQLString(this.modelValue) : null;
    },
    publicationDateTimeClass() {
      return {
        "flex-column": this.column,
        "flex-row": !this.column,
      };
    },
    publicationDateTimeItemClass() {
      return {
        "v-col-xl-8 v-col-lg-10 v-col-12": this.column,
        "v-col-sm-6 v-col-12": !this.column,
      };
    },
  },
  watch: {
    modelValue() {
      this.setDateTimeFromValue();
    },
  },
  created() {
    this.setDateTimeFromValue();
  },
  methods: {
    toFullDateTime() {
      return this.date && this.time ? this.date + " " + this.time : "";
    },
    setDateTimeFromValue() {
      if (!this.modelValue) return;
      const [date, time] = this.modelValue.split(" ");
      this.date = date;
      this.time = time.split(":").slice(0, 2).join(":");
    },
    emitInput() {
      this.$emit("update:modelValue", this.toFullDateTime());
    },
  },
};
</script>

<style scoped>
:deep(.theme--light.v-input input, .theme--light.v-input textarea) {
  color: #1d2f3d;
}

:deep(.v-text-field__suffix) {
  color: #1d2f3d;
}
</style>
