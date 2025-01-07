<template>
  <v-autocomplete
    ref="autocomplete"
    v-model:search="search"
    validate-on="blur"
    class="user-search"
    :autofocus="autofocus"
    :rules="rules"
    :multiple="multiple"
    :error-messages="errorMessages"
    :disabled="disabled"
    :model-value="modelValue"
    :menu-props="{ closeOnContentClick: true }"
    :items="users"
    hide-no-data
    no-filter
    :chips="chips"
    closable-chips
    :hide-selected="hideSelected"
    :item-title="itemText"
    :clearable="clearable"
    persistent-clear
    item-value="id"
    :label="label"
    maxlength="50"
    :counter="counter"
    return-object
    :hide-details="counter ? false : true"
    :placeholder="placeholder"
    variant="underlined"
    color="primary"
    @update:model-value="updateUser($event)"
    @keyup="keyup"
    @keydown="keydown"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
    <template v-if="multiple" #chip="{ props, item }">
      <v-chip
        v-bind="props"
        size="small"
        closable
        close-icon="close"
        @click:close="removeUser(item.raw.id)"
      >
        {{ itemText(item.raw) }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script>
import { buildHttpQuery } from "@/functions/http";
import { pick } from "lodash-es";

export default {
  props: {
    modelValue: {
      type: [Array, Object],
      default: () => {},
    },
    type: {
      type: String,
      default: "",
    },
    counter: {
      type: [Boolean, Number],
      default: 50,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    withCompany: {
      type: Boolean,
      default: false,
    },
    validateOnBlur: {
      type: Boolean,
      default: true,
    },
    autofocus: {
      type: Boolean,
      default: true,
    },
    withProfile: {
      type: Boolean,
      default: false,
    },
    hideSelected: {
      type: Boolean,
      default: false,
    },
    showCompany: {
      type: Boolean,
      default: false,
    },
    searchInCompanyToo: {
      type: Boolean,
      default: false,
    },
    searchFilters: {
      type: Object,
      default: () => ({}),
    },
    chips: {
      type: Boolean,
      default: false,
    },
    participants: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "Please start typing",
    },
    additionalFields: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["focus", "blur", "update:model-value"],
  data() {
    return {
      errorMessages: [],
      search: null,
      users: [],
      typingTimer: null,
      doneTypingInterval: 500,
    };
  },
  methods: {
    updateUser(event) {
      if (this.multiple === true) {
        this.$emit(
          "update:model-value",
          event.filter((it) => typeof it === "object")
        );
        this.search = null;
      } else {
        if (event && event.id) {
          let data = {
            id: event.id,
            full_name: event.full_name,
            company: event.company,
          };

          if (this.additionalFields.length) {
            data = { ...data, ...pick(event, this.additionalFields) };
          }
          this.$emit("update:model-value", data);
        } else {
          this.$emit("update:model-value", null);
        }
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
      if (!this.search) return;

      const includes = [];

      if (this.withCompany) {
        includes.push("company");
      }

      if (this.withProfile) {
        includes.push("profile");
      }

      this.axios
        .get(
          "users?limit=30" +
            (this.participants ? "&participants=1" : "") +
            (this.type ? "&" + this.type : "") +
            (includes.length ? "&include=" + includes.join(",") : "") +
            (this.searchInCompanyToo ? "&textSearch=" : "&name=") +
            this.search +
            "&" +
            buildHttpQuery(this.searchFilters)
        )
        .then((res) => {
          this.users = res.data.data;

          if (this.modelValue) {
            this.users.concat(this.modelValue);
          }
        })
        .catch((error) => {
          this.errors(error.response.data.message);
        });
    },
    itemText(user) {
      return this.withCompany && this.showCompany && user.company && user.company.name
        ? `${user.full_name}, ${user.company.name}`
        : user.full_name;
    },
    removeUser(itemId) {
      const users = this.modelValue.filter((user) => user.id !== itemId);
      this.$emit("update:model-value", users);
    },
  },
};
</script>

<style scoped>
:deep(.v-input__slot) {
  min-height: 32px !important;
}
</style>
