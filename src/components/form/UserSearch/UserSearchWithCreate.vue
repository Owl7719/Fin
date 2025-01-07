<template>
  <div>
    <div v-if="max > 0" :class="{ 'text-orange': investors > max }">
      <div v-if="investors > max">
        <div>The number of investors surpasses the planned size of the slot.</div>
        <div>
          If you proceed the slot size will be increased from <strong>{{ max }}</strong> to
          <strong>{{ investors }}</strong
          >.
        </div>
      </div>
    </div>
    <v-row>
      <v-col sm="9">
        <user-search
          id="investors"
          ref="investors"
          :model-value="modelValue"
          :rules="rules"
          with-company
          show-company
          search-in-company-too
          hide-selected
          chips
          :search-filters="searchFilters"
          type="investor"
          multiple
          label="Select Investors"
          @update:model-value="$emit('update:model-value', $event)"
          @focus="$emit('focus')"
          @blur="$emit('blur')"
        ></user-search>
      </v-col>
      <v-col class="text-sm-right" sm="3">
        <s-button type="tertiary" class="mr-0 create-investor-button" @click="openCreationDialog">
          Create investor
        </s-button>
      </v-col>
    </v-row>

    <s-create-investor-dialog
      v-model="createInvestorDialog"
      @created="onInvestorCreated"
      @update:model-value="closeCreationDialog"
    ></s-create-investor-dialog>
  </div>
</template>

<script>
import UserSearch from "@/components/form/UserSearch";
import SCreateInvestorDialog from "@/s-components/Investor/CreateInvestor/SCreateInvestorDialog";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, UserSearch, SCreateInvestorDialog },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: -1,
    },
    searchFilters: {
      type: Object,
      default: () => ({}),
    },
    addedUsers: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    "update:model-value",
    "focus",
    "blur",
    "opening-creation-dialog",
    "closing-creation-dialog",
  ],
  data() {
    return {
      createInvestorDialog: false,
    };
  },
  computed: {
    investors() {
      return this.addedUsers + this.modelValue.length;
    },
  },
  methods: {
    openCreationDialog() {
      this.$emit("opening-creation-dialog");
      this.createInvestorDialog = true;
    },
    closeCreationDialog() {
      this.$emit("closing-creation-dialog");
      this.createInvestorDialog = false;
    },
    onInvestorCreated(investor) {
      this.$emit("update:model-value", [...this.modelValue, investor]);
      this.closeCreationDialog();
    },
  },
};
</script>
<style scoped>
.create-investor-button {
  position: relative;
  top: 17px;
}
</style>
