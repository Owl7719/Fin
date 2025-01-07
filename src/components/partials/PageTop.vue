<template>
  <v-container class="page-top" fluid>
    <v-row class="align-center">
      <!-- PAGE TITLE  -->
      <v-col cols="auto">
        <v-row class="flex-column">
          <v-col
            class="top-page-title font-weight-regular text-grey-darken-2"
            :class="{ 'pb-0': isSubtitleExists }"
          >
            {{ $store.getters.pageTitle }}
            {{ $store.getters.pageTitleSeparator }}
            {{ $store.getters.pageTitleSuffix }}
          </v-col>
          <v-col v-if="isSubtitleExists" class="top-page-sub-title text-grey">
            {{ $store.getters.pageSubTitle }}
          </v-col>
        </v-row>
      </v-col>

      <v-spacer></v-spacer>

      <!-- BUTTONS  -->
      <v-col v-if="buttons" class="text-sm-right pl-1" cols="auto">
        <template v-for="(button, index) in buttons">
          <v-tooltip
            v-if="button.help"
            :key="index + 'tooltip'"
            location="bottom"
            max-width="200"
            open-on-click
          >
            <template #activator="{ props }">
              <v-btn variant="text" class="ml-2" icon v-bind="props">
                <v-icon color="silver">far fa-question-circle</v-icon>
              </v-btn>
            </template>
            <span>{{ button.help }}</span>
          </v-tooltip>
          <s-button
            v-if="button.callback"
            :key="index"
            :type="button.type || 'primary'"
            class="ml-2 my-1 elevation-0 pr-3 pl-3"
            :disabled="button.disabled"
            @click="emit(button.callback)"
          >
            <v-icon
              v-if="button.icon"
              class="mr-1"
              :class="{ 'material-icons-outlined': button.iconOutlined }"
            >
              {{ button.icon }}
            </v-icon>
            {{ button.slot }}
          </s-button>

          <template v-else-if="button.is">
            <component :is="button.is" :key="index" v-bind="button"></component>
          </template>
        </template>

        <v-menu v-if="additionalActions.length > 0" offset-y eager>
          <template #activator="{ props }">
            <s-button type="tertiary" class="ml-2 mr-0" size="small" icon v-bind="props">
              <v-icon class="material-icons-outlined">more_horiz</v-icon>
            </s-button>
          </template>
          <v-list>
            <v-list-item
              v-for="({ text, handler }, index) in additionalActions"
              :key="index"
              @click="emit(handler)"
            >
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { bus } from "@/plugins/bus";
import { downloadFile } from "@/functions/http";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton },
  data() {
    return {
      end: {},
      buttons: null,
      additionalActions: [],
    };
  },
  computed: {
    isSubtitleExists() {
      return this.$store.getters.pageSubTitle;
    },
  },
  watch: {
    $route: "setPageTitleFromRoute",
  },
  mounted() {
    this.setPageTitleFromRoute();

    bus.on("setPageTopButtons", (payload) => {
      this.buttons = payload;
    });
    bus.on("setPageTopAdditionalActions", (payload) => {
      this.additionalActions = payload;
    });
  },
  methods: {
    setPageTitleFromRoute() {
      this.$setPageTitle(this.$route.meta.title);
      this.$setPageSubTitle(this.$route.meta.subtitle);
    },
    emit(event) {
      if (typeof event === "string") {
        bus.emit(event);
        return;
      }
      if (event.url) {
        let getUrl = (url) => {
          let type = typeof url;
          if (type === "function") return url();
          if (type === "string") return url;
          throw new Error("Unsupported URL resolver");
        };
        downloadFile(getUrl(event.url));
        return;
      }
      if (typeof event.route === "object") {
        this.$router.push(event.route);
      }
      if (typeof event.action == "function") {
        event.action();
      }
      if (typeof event == "function") {
        event();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.top-page-title {
  font-size: 24px;
  line-height: 28px;
  color: #1d2f3d !important;
  font-weight: 400;
}

.top-page-sub-title {
  padding-top: 0 !important;
  font-weight: 400;
  font-size: 1em;
}

@media screen and (max-width: 600px) {
  .page-top > .row > .col {
    padding: 0 !important;
  }
}
</style>
