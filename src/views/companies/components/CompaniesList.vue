<template>
  <v-container fluid>
    <v-text-field
      v-model="companyName"
      class="pa-0 mt-0 pb-4"
      placeholder="Search company"
      hide-details
      clearable
      persistent-clear
      variant="outlined"
      bg-color="white"
      color="primary"
      density="comfortable"
      base-color="#D1D5DA"
      autofocus
      @update:model-value="debounceTextFilter"
    ></v-text-field>

    <v-data-table-server
      :headers="headers"
      :items="companies"
      :items-per-page-options="[10, 25, 50]"
      :items-length="totalCompanies"
      :mobile-breakpoint="0"
      must-sort
      class="border-sm rounded"
      @update:options="loadCompanies"
    >
      <template #item="{ item }">
        <tr>
          <td class="text-left">
            <router-link :to="{ name: 'view-company', params: { id: item.id } }">
              {{ item.name }}
            </router-link>
          </td>
          <td class="text-left">
            {{ companyTypeName(item.company_type_id) }}
          </td>
          <td v-if="meetingRequestButton" class="text-center">
            <s-button
              type="tertiary-blue"
              :class="{ 'text--secondary': !item.isin && !item.isin2 }"
              @click="showMeetingRequestDialog(item)"
            >
              Show Link
            </s-button>
          </td>
          <td v-if="editButton" class="text-center">
            <s-button
              v-if="editButton"
              type="tertiary-blue"
              :to="{ name: 'admin-companies-edit', params: { id: item.id } }"
            >
              <v-icon class="material-icons-outlined mr-1">edit</v-icon>
              Edit
            </s-button>
          </td>
        </tr>
      </template>
    </v-data-table-server>

    <meeting-request-dialog
      :dialog="meetingRequestDialog.visible"
      :company-isin="meetingRequestDialog.companyIsin"
      :company-name="meetingRequestDialog.companyName"
      @close="meetingRequestDialog.visible = false"
    ></meeting-request-dialog>
  </v-container>
</template>

<script>
import MeetingRequestDialog from "./MeetingRequestDialogInner";
import CompanyApi from "@/api/companies";
import debounce from "lodash-es/debounce";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, MeetingRequestDialog },
  props: {
    editButton: {
      type: Boolean,
      default: false,
    },
    meetingRequestButton: {
      type: Boolean,
      default: false,
    },
    additionalConditions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      typingTimer: null,
      doneTypingInterval: 500,
      companies: [],
      totalCompanies: 0,
      pagination: {
        itemsPerPage: 10,
        page: 1,
        sortBy: [{ key: "name", order: "asc" }],
      },
      companyName: "",
      meetingRequestDialog: {
        visible: false,
        companyIsin: "",
        companyName: "",
      },
    };
  },
  computed: {
    headers() {
      const btnDefault = { sortable: false, align: "center", width: "35%" };
      return [
        { title: "Company name", value: "name", width: "35%", sortable: true },
        { title: "Type", width: "25%", sortable: false },
        ...(this.meetingRequestButton ? [{ title: "Meeting request link", ...btnDefault }] : []),
        ...(this.editButton ? [{ value: "actions", sortable: false }] : []),
      ];
    },
    companyTypes() {
      return this.$store.state.settings.companyTypes;
    },
  },
  created() {
    const { companyName } = this.$hasCachedListFilters()
      ? this.$getListFiltersCache()
      : { companyName: "" };

    this.companyName = companyName;
  },
  methods: {
    companyTypeName(companyTypeId) {
      return (this.companyTypes.find((ct) => ct.id === companyTypeId) || { name: "n/a" }).name;
    },
    showMeetingRequestDialog(company) {
      this.meetingRequestDialog = {
        visible: true,
        companyName: company.name,
        companyIsin: company.isin || company.isin2,
      };
    },
    debounceTextFilter: debounce(function (companyName) {
      this.companyName = companyName;
      this.loadCompanies();
      this.$setListFiltersCache({ companyName });
    }, 500),
    loadCompanies(options) {
      const pagination = options || this.pagination;
      const { page, itemsPerPage, sortBy } = pagination;

      const sort = sortBy[0] ? `${sortBy[0].order === "asc" ? "" : "-"}` + sortBy[0].key : {};
      const name = this.companyName ? { name: this.companyName } : {};

      const params = {
        limit: itemsPerPage,
        page,
        ...name,
        sort,
        ...this.additionalConditions,
      };

      CompanyApi.list(params).then((response) => {
        this.companies = response.data;
        this.totalCompanies = response.meta.total;
      });
    },
  },
};
</script>
