import { mapGetters } from "vuex";

// the mixin must have 'company' data object

export default {
  computed: {
    ...mapGetters(["isSuperAdmin", "isSupportAdmin", "isCorporate", "isAuthorized", "userData"]),
    canEditCompany() {
      if (this.isSuperAdmin) {
        return true;
      }
      if (
        this.isSupportAdmin &&
        this.isOfCrmType &&
        this.company.id === this.userData.company_id
      ) {
        return true; // regular admin can not edit other admin's companies, only his own
      }

      if (this.isSupportAdmin && !this.isOfCrmType) {
        return true;
      }

      if (this.isCorporate && this.isAuthorized("edit_company_info")) {
        return true;
      }

      return false;
    },
    isOfCrmType() {
      return [1, 2].includes(this.company.company_type_id);
    },
  },
};
