<template>
  <div>
    <h3 :class="{ 'subheading font-weight-regular mb-2': true, required: required }">
      {{ label }}
    </h3>

    <!-- ----- DATES LIST ----- -->
    <v-list class="border pa-0">
      <v-list-item
        v-for="date in modelValue"
        :key="date"
        class="d-flex justify-space-between"
        @click="editDate(date)"
      >
        <v-list-item-title
          :class="{
            'body-1': true,
            'text-secondary': !hasErrors,
            'text-red': hasErrors,
          }"
        >
          {{ formatDate(date) }}
        </v-list-item-title>

        <template #append>
          <s-button type="tertiary" size="small" icon class="show-on-hover mr-3">
            <v-icon class="material-icons-outlined">edit</v-icon>
          </s-button>
          <s-button type="tertiary" size="small" icon @click.stop="removeDate(date)">
            <v-icon>close</v-icon>
          </s-button>
        </template>
      </v-list-item>
    </v-list>
    <div v-if="hasErrors" class="text-red mt-2">
      {{ errorMessages[0] }}
    </div>
    <!-- ----- /DATES LIST ----- -->

    <!-- ----- ADD BUTTON (obviously) ----- -->
    <div class="text-right">
      <s-button type="tertiary" class="mt-2 text-none" @click="addDate">
        Add additional day
      </s-button>
    </div>
    <!-- ----- /ADD BUTTON ----- -->
    <!-- ----- DATE DIALOG ----- -->
    <v-dialog
      ref="dateDialog"
      v-model="dateDialog.visible"
      persistent
      width="290px"
      @update:model-value="emitDateAdding(dateDialog.value)"
    >
      <v-date-picker
        :model-value="formatDateToDateObj"
        scrollable
        color="primary"
        :allowed-dates="allowedDialogDates"
        @update:model-value="updateDate"
      >
        <template #actions>
          <s-button type="tertiary" @click="dateDialog.visible = false"> Cancel </s-button>
          <s-button :disabled="!dateDialog.value" @click="selectDate(dateDialog.value)">
            Ok
          </s-button>
        </template>
      </v-date-picker>
    </v-dialog>
    <!-- ----- /DATE DIALOG ----- -->
  </div>
</template>

<script>
import { bus } from "@/plugins/bus";
import SButton from "@/s-components/Button/SButton.vue";
import { DateTime } from "luxon";

export default {
  components: { SButton },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    datesTotals: {
      type: Object,
      default: () => ({}),
    },
    required: {
      type: Boolean,
      default: false,
    },
    deletableDatesWithSlots: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Event dates",
    },
  },
  emits: ["update:modelValue", "changed", "edit-dates"],
  data() {
    return {
      dateDialog: {
        visible: false,
        value: null,
        mode: null,
      },
      DATE_DIALOG_MODE: {
        ADDING: 1,
        EDITING: 2,
      },
      dateToEdit: null,
      editDates: [],
      errorMessages: [],
    };
  },
  computed: {
    formatDateToDateObj() {
      return DateTime.fromSQL(this.dateDialog.value).toJSDate();
    },
    hasErrors() {
      return this.errorMessages.length > 0;
    },
  },
  created() {
    bus.on("event-updated", () => {
      this.clearEditingIndex();
    });
  },
  unmounted() {
    bus.off("event-updated");
  },
  methods: {
    updateDate(date) {
      this.dateDialog.value = DateTime.fromJSDate(date).toISODate();
    },
    dateInfo(date) {
      return date in this.datesTotals
        ? this.datesTotals[date]
        : { slotsCount: 0, investorsCount: 0 };
    },
    addDate() {
      this.dateDialog = {
        value: null,
        visible: true,
        mode: this.DATE_DIALOG_MODE.ADDING,
      };
    },
    allowedDialogDates(date) {
      return this.dateDialog.mode === this.DATE_DIALOG_MODE.EDITING
        ? !this.modelValue.includes(date) && this.dateDialog.value !== date
        : !this.modelValue.includes(date);
    },
    editDate(date) {
      this.dateToEdit = date;
      this.dateDialog = {
        value: null,
        visible: true,
        mode: this.DATE_DIALOG_MODE.EDITING,
      };
    },
    clearEditingIndex() {
      this.editDates = [];
    },
    removeDate(dateToDelete) {
      const removingError = this.removingError(dateToDelete);
      if (removingError) {
        return this.error(removingError);
      }
      this.$emit(
        "update:modelValue",
        this.modelValue.filter((date) => date !== dateToDelete)
      );
      this.$emit("changed", {
        dates: this.modelValue.filter((date) => date !== dateToDelete),
        edit_dates: this.editDates,
      });
    },
    removingError(date) {
      if (this.modelValue.length === 1) {
        // is last?
        return "Event must have at least one date";
      }
      if (this.hasInvestors(date)) {
        return "This date already has investors";
      }
      if (this.hasSlots(date) && !this.deletableDatesWithSlots) {
        return "Date with slots can not be deleted";
      }
      return null;
    },
    hasSlots(date) {
      return date in this.datesTotals && this.datesTotals[date].slotsCount > 0;
    },
    hasInvestors(date) {
      return date in this.datesTotals && this.datesTotals[date].investorsCount > 0;
    },
    selectDate(date) {
      if (this.dateDialog.mode === this.DATE_DIALOG_MODE.ADDING) {
        this.$emit("changed", {
          dates: [...this.modelValue.filter((date) => date !== this.dateToEdit), date],
          edit_dates: this.editDates,
        });
        this.dateDialog.visible = false;
      } else {
        // editing
        this.dateDialog.visible = false;
        const findExistingEditingFn = (editTuple) => editTuple.includes(this.dateToEdit);
        const existingEditingIndex = this.editDates.findIndex(findExistingEditingFn);
        let originalDateToEdit = this.dateToEdit;
        if (existingEditingIndex >= 0) {
          originalDateToEdit = this.editDates[existingEditingIndex][0];
          this.editDates = this.editDates.filter((editTuple) => !findExistingEditingFn(editTuple));
        }
        if (this.hasInvestors(originalDateToEdit)) {
          this.info("Please update current attendants about changed date after saving");
        }
        this.editDates.push([originalDateToEdit, date]);
        this.editDates = this.editDates.filter((editTuple) => editTuple[0] !== editTuple[1]);
        this.$emit("edit-dates", this.editDates);
        const newValue = this.modelValue.filter((date) => date !== this.dateToEdit);
        newValue.push(date);
        this.$emit("update:modelValue", newValue.sort());
        this.$emit("changed", {
          dates: newValue.sort(),
          edit_dates: this.editDates,
        });
      }
    },
    emitDateAdding(date) {
      this.$emit("update:modelValue", [...this.modelValue, date].sort());
      this.$emit("changed", {
        dates: [...this.modelValue, date].sort(),
        edit_dates: this.editDates,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.border {
  border: 1px solid #c9c9c9 !important;
}
.v-list__tile__action {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.v-list__tile:hover .show-on-hover {
  display: inline-flex;
}
.show-on-hover {
  display: none;
}
.required:after {
  color: #f44336;
  content: " *";
}
</style>
