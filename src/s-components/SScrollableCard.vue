<template>
  <v-container fluid>
    <v-card class="scrollable-card" variant="flat">
      <v-card-actions v-if="!!$slots['header-actions']" class="pa-3">
        <slot name="header-actions"></slot>
      </v-card-actions>

      <v-divider v-if="headerDivider"></v-divider>

      <v-card-text
        ref="should-fit-height"
        :class="!noScroll ? 'scroll-wrapper' : ''"
        @scroll="$emit('scroll', $event)"
      >
        <slot name="scrollable-content"></slot>
      </v-card-text>

      <v-divider v-if="footerDivider"></v-divider>

      <v-card-actions v-if="!!$slots['footer-actions']" id="scroll-window-footer" class="pa-3">
        <slot name="footer-actions"></slot>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "SScrollableCard",
  props: {
    headerDivider: {
      type: Boolean,
      default: false,
    },
    footerDivider: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: Boolean,
      default: false,
    },
    noScroll: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["scroll"],
  mounted() {
    if (!this.noScroll) {
      this.$nextTick(() => {
        this.calculateContainerHeight();
      });
      window.addEventListener("resize", this.calculateContainerHeight);
    }
  },
  beforeUnmount() {
    if (!this.noScroll) {
      window.removeEventListener("resize", this.calculateContainerHeight);
    }
  },
  methods: {
    scrollToTop() {
      if (this.noScroll) {
        this.$refs["should-fit-height"].$el.scrollIntoView();
      } else {
        this.$refs["should-fit-height"].$el.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    calculateContainerHeight() {
      const wrapper = document.querySelector(".scroll-wrapper");

      const viewportHeight = window.innerHeight;
      const distanceFromViewportTop = wrapper.getBoundingClientRect().top;
      const bottomBarHeight = document.querySelector("#bottom-bar").offsetHeight;
      const scrollWindowFooter = document.querySelector("#scroll-window-footer");
      const footerActionsHeight = scrollWindowFooter ? scrollWindowFooter.offsetHeight : 0;
      const paddings = 40;

      let height =
        viewportHeight - distanceFromViewportTop - bottomBarHeight - footerActionsHeight - paddings;

      this.maxHeight
        ? (wrapper.style.maxHeight = height + "px")
        : (wrapper.style.height = height + "px");
    },
  },
};
</script>

<style scoped>
.scroll-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 !important;
  transition: 0.25s ease-out;
}
</style>
