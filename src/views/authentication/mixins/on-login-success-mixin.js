import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["homeRouteName"]),
  },
  methods: {
    async loginSuccess(remember) {
      await this.$store.dispatch("authRequest", { remember_me: remember });

      const path = this.getParameterByName("last_path");
      const route = path ? { path } : { name: this.homeRouteName };

      if (this.$router.currentRoute.name !== route.name) {
        this.$router.push(route);
      }
    },
  },
};
