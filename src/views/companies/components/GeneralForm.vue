<template>
  <v-form ref="form" lazy-validation>
    <section-header title="Main info"></section-header>
    <v-text-field
      v-if="isVisible('name')"
      id="name"
      ref="name"
      :rules="[rules.required]"
      :model-value="modelValue.name"
      :counter="50"
      maxlength="50"
      label="Company Name"
      class="required"
      variant="underlined"
      color="primary"
      :disabled="formDisabled"
      :error-messages="errors.name || []"
      @update:model-value="changed({ name: $event })"
    ></v-text-field>

    <company-type
      v-if="isVisible('company_type_id')"
      v-show="showCompanyType"
      id="company_type_id"
      ref="company_type_id"
      :rules="[rules.required]"
      :model-value="modelValue.company_type_id"
      class="required"
      :disabled="formDisabled || isCompanyTypeDisabled"
      :error-messages="errors.company_type_id || []"
      @update:model-value="changed({ company_type_id: $event })"
    ></company-type>

    <country
      id="country"
      ref="country"
      :model-value="modelValue.country"
      label="Country"
      class="required"
      :rules="[rules.required]"
      :disabled="formDisabled"
      :validation-errors="errors.country || []"
      @update:model-value="changed({ country: $event })"
    ></country>

    <div v-if="!isCompanyTypeCorporate">
      <section-header title="Company description"></section-header>
      <editor
        v-if="!formDisabled"
        ref="description"
        :model-value="modelValue.description"
        :height="400"
        @update:model-value="changed({ description: $event })"
      ></editor>
      <div v-else v-sanitize="modelValue.description || 'n/a'" class="wysiwyg_text"></div>
      <input-validation-errors :errors="errors.description || []"></input-validation-errors>
      <div class="text-right">
        <char-counter class="mt-1" :text="modelValue.description" :max-chars="5000"></char-counter>
      </div>
    </div>

    <div v-if="isCompanyTypeCorporate">
      <section-header title="Share details, market cap, liquidity"></section-header>

      <v-text-field
        v-if="isVisible('isin')"
        id="isin"
        ref="isin"
        :model-value="modelValue.isin"
        :disabled="formDisabled"
        :label="modelValue.isin || modelValue.isin2 ? 'Primary ISIN No.' : 'ISIN No.'"
        :error-messages="errors.isin || []"
        variant="underlined"
        color="primary"
        @update:model-value="changedIsin1($event)"
      ></v-text-field>

      <v-text-field
        v-if="isVisible('isin2')"
        v-show="modelValue.isin || modelValue.isin2"
        id="isin2"
        ref="isin2"
        :model-value="modelValue.isin2"
        :disabled="formDisabled"
        label="Secondary ISIN No."
        :error-messages="errors.isin2 || []"
        variant="underlined"
        color="primary"
        @update:model-value="changed({ isin2: $event })"
      ></v-text-field>

      <s-number-text-field
        v-if="isVisible('shares_outstanding')"
        id="shares_outstanding"
        ref="shares_outstanding"
        :model-value="modelValue.shares_outstanding || ''"
        :disabled="formDisabled"
        label="Shares outstanding"
        :error-messages="errors.shares_outstanding || []"
        @update:model-value="changed({ shares_outstanding: $event })"
      ></s-number-text-field>

      <market-cap
        id="market_cap_id"
        ref="market_cap_id"
        :model-value="modelValue.market_cap_id"
        :rules="[rules.required]"
        :disabled="formDisabled"
        :validation-errors="errors.market_cap_id || []"
        @update:model-value="changed({ market_cap_id: $event })"
      ></market-cap>

      <market-liquidity
        id="average_market_liquidity_id"
        ref="average_market_liquidity_id"
        :model-value="modelValue.average_market_liquidity_id"
        label="Average trading liquidity (in m)"
        :rules="[rules.required]"
        class="required"
        :disabled="formDisabled"
        :validation-errors="errors.average_market_liquidity_id || []"
        @update:model-value="changed({ average_market_liquidity_id: $event })"
      ></market-liquidity>

      <section-header title="Sectors" required></section-header>
      <sector
        id="sector_id"
        ref="sector_id"
        :rules="[rules.required]"
        :model-value="modelValue.sector_id"
        :disabled="formDisabled"
        :validation-errors="errors.sector_id || []"
        @update:model-value="changed({ sector_id: $event })"
      ></sector>

      <stock-country
        id="stock_market_country_id"
        ref="stock_market_country_id"
        :model-value="modelValue.stock_market_country_id"
        label="Stock listing country"
        :rules="[rules.required]"
        class="required"
        :disabled="formDisabled"
        :validation-errors="errors.stock_market_country_id || []"
        @update:model-value="changed({ stock_market_country_id: $event })"
      ></stock-country>
    </div>

    <aum-option
      v-if="isCompanyTypeInvestment && isVisible('aum_option_id')"
      id="aum_option_id"
      ref="aum_option_id"
      :rules="[rules.required]"
      :model-value="modelValue.aum_option_id"
      label="Company total managed AuM (in CHF m)"
      class="required"
      :disabled="formDisabled"
      :validation-errors="errors.aum_option_id || []"
      @update:model-value="changed({ aum_option_id: $event })"
    ></aum-option>

    <v-text-field
      v-if="isVisible('aum')"
      v-show="isCompanyTypeInvestment"
      id="aum"
      ref="aum"
      :model-value="modelValue.aum"
      :counter="150"
      maxlength="150"
      label="Company total AuM (optional disclosure, CHF m)"
      :disabled="formDisabled"
      :error-messages="errors.aum || []"
      variant="underlined"
      color="primary"
      @update:model-value="changed({ aum: $event })"
    ></v-text-field>
  </v-form>
</template>

<script>
import CompanyType from "@/components/form/CompanyType";
import AumOption from "@/components/form/AumOption";
import MarketCap from "@/components/form/MarketCap";
import MarketLiquidity from "@/components/form/MarketLiquidity";
import Sector from "@/components/form/SectorComponent.vue";
import StockCountry from "@/components/form/StockCountry";
import SectionHeader from "@/views/companies/components/bridge/SectionHeader";
import Editor from "@/components/TinyMCEField.vue";
import InputValidationErrors from "@/components/form/InputValidationErrors.vue";
import CharCounter from "@/components/form/CharCounter.vue";
import SNumberTextField from "@/s-components/SNumericSeparatorInput.vue";
import { mapGetters } from "vuex";
import Country from "@/components/form/CountryInput.vue";

export default {
  components: {
    CompanyType,
    AumOption,
    MarketCap,
    MarketLiquidity,
    Sector,
    StockCountry,
    SectionHeader,
    Editor,
    InputValidationErrors,
    CharCounter,
    SNumberTextField,
    Country,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    formDisabled: {
      type: Boolean,
      default: false,
    },
    showCompanyType: {
      type: Boolean,
      default: true,
    },
    errors: {
      type: Object,
      default: () => ({}),
    },
    hiddenInputs: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:model-value"],
  data() {
    return {
      rules: {
        required: (value) => !!value || "This field is required",
      },
    };
  },
  computed: {
    ...mapGetters(["isAnyAdmin"]),
    isCompanyTypeCorporate() {
      return +this.modelValue.company_type_id === 3;
    },
    isCompanyTypeInvestment() {
      return this.modelValue.company_type_id > 3;
    },
    isCompanyTypeDisabled() {
      return !this.isAnyAdmin;
    },
  },
  methods: {
    isVisible(inputId) {
      return !this.hiddenInputs.includes(inputId);
    },
    changedIsin1(isin) {
      const isin2 = this.modelValue.isin2;
      this.changed({ isin });

      if (isin === "" && isin2 !== "") {
        this.$nextTick(() => {
          this.changed({ isin: isin2, isin2: "" });
        });
      }
    },
    changed(changes) {
      this.$emit("update:model-value", { ...this.modelValue, ...changes });
    },
    validate() {
      return this.$refs.form.validate();
    },
  },
};
</script>
