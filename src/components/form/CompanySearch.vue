<template>
  <v-autocomplete
    ref="autocomplete"
    v-model:search="search"
    :error-messages="errorMessages"
    :disabled="disabled"
    :model-value="modelValue"
    :items="companies"
    hide-no-data
    :hide-selected="false"
    item-title="name"
    item-value="id"
    :label="label"
    :counter="counter"
    return-object
    :rules="rules"
    :clearable="clearable"
    persistent-clear
    :placeholder="placeholder"
    :requred="required"
    :background-color="backgroundColor"
    :base-color="baseColor"
    :hide-details="hideDetails"
    :append-icon="appendIcon"
    :variant="variant"
    color="primary"
    @update:model-value="updateCompany($event)"
    @keyup="keyup"
    @keydown="keydown"
  ></v-autocomplete>
</template>

<script>
import { buildHttpQuery } from "@/functions/http";

export default {
  props: {
    rules: {
      type: Array,
      default: () => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: [Object, String],
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    include: {
      type: String,
      default: undefined,
    },
    clauses: {
      type: String,
      default: "",
    },
    companyTypes: {
      type: Array,
      default: () => [],
    },
    exclude: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: "Company",
    },
    clearable: {
      type: Boolean,
      default: () => false,
    },
    forceSelection: {
      type: Boolean,
      default: () => true,
    },
    placeholder: {
      type: String,
      default: "Please start typing",
    },
    counter: {
      type: [Boolean, Number],
      default: 50,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    emitFullData: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "transparent",
    },
    appendIcon: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "underlined",
    },
    baseColor: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      errorMessages: [],
      search: null,
      companies: [],
      typingTimer: null,
      doneTypingInterval: 500,
      endpoint: "companies",
    };
  },
  mounted() {
    if (!this.$store.getters.isAuthenticated) {
      this.endpoint = "public-companies";
    }
    if (this.modelValue) {
      this.companies.push(this.modelValue);
    }
  },
  methods: {
    updateCompany(data) {
      if (data) {
        if (this.include !== undefined || this.emitFullData) {
          this.$emit("update:modelValue", data);
          return;
        }

        if (data.id) {
          this.$emit("update:modelValue", { id: data.id, name: data.name });
          return;
        }

        if (this.forceSelection) {
          const result = this.companies.find(
            (company) => company.name.toLowerCase() === data.toLowerCase().trim()
          );

          if (result) {
            this.$emit("update:modelValue", result);
            return;
          }
        }
        this.$emit("update:modelValue", { id: undefined, name: data });
      } else {
        this.$emit("update:modelValue", null);
      }
    },
    setCompanyValue(value) {
      this.updateCompany(value);
      if (typeof value === "string") {
        this.search = value;
        this.doneTyping();
      }
    },
    keydown() {
      clearTimeout(this.typingTimer);
    },
    keyup() {
      clearTimeout(this.typingTimer);
      this.typingTimer = setTimeout(this.doneTyping, this.doneTypingInterval);
    },
    doneTyping() {
      let queryString = buildHttpQuery({
        take: 15,
        name: this.search,
        include: this.include,
        companyTypes: this.companyTypes,
        exclude: this.exclude,
      });
      if (this.clauses) {
        queryString += `&${this.clauses}`;
      }
      this.axios
        .get(`${this.endpoint}?${queryString}`)
        .then((res) => {
          this.companies = res.data.data;
          this.updateCompany(this.search);
        })
        .catch((error) => this.errors(error.response.data.message));
    },
  },
};
</script>
