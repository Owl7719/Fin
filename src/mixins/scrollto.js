import { useGoTo } from "vuetify";

export default {
  setup() {
    const goTo = useGoTo();
    return { goTo };
  },
  inject: {
    scrollOptions: {
      default: () => ({
        offset: 130,
      }),
    },
  },
  data() {
    return {
      goTo: useGoTo(),
    };
  },
  created() {
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status == 422) {
          for (var property in error.response.data.errors) {
            if (this.$refs[property] && this.$refs[property].errorMessages) {
              this.goToFirstErrorField();
              if (process.env.NODE_ENV !== "production") {
                // console.log('Scrolling to: ' + property);
              }
              break;
            } else {
              if (process.env.NODE_ENV !== "production") {
                // console.info('Missing: ' + property);
              }
            }
          }
        }

        return Promise.reject(error);
      }
    );
  },
  methods: {
    resetForm() {
      for (var property in this.$refs) {
        if (this.$refs[property] && this.$refs[property].errorMessages) {
          this.$refs[property].errorMessages.pop();
        }
      }
    },
    goToFirstErrorField() {
      const el = this.$el.querySelector(".v-messages__message");

      if (this.showControls) {
        this.goTo(el.parentElement.parentElement.previousElementSibling, { offset: -130 });
      } else {
        if (el.parentElement.parentElement.previousElementSibling) {
          el.parentElement.parentElement.previousElementSibling.scrollIntoView({
            behavior: "smooth",
          });
        } else {
          el.parentElement.parentElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
  },
};
