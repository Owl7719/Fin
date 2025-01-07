<template>
  <div>
    <div ref="text" class="overflow-hidden" :style="textStyle">
      {{ value }}
    </div>

    <s-button v-if="showButton" class="mt-1" type="tertiary-blue" @click="toggleText">
      <v-icon color="#016BBF">{{ buttonIcon }}</v-icon>
      {{ buttonText }}
    </s-button>
  </div>
</template>

<script>
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: {
    SButton,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    initialHeight: {
      type: [Number, String],
      default: 33,
    },
  },
  data() {
    return {
      isExpanded: false,
      fullHeight: 0,
      showButton: false,
    };
  },
  computed: {
    buttonText() {
      return this.isExpanded ? "Show less" : "Show more";
    },
    buttonIcon() {
      return this.isExpanded ? "expand_less" : "expand_more";
    },
    textStyle() {
      return {
        maxHeight: this.isExpanded ? `${this.fullHeight}px` : `${this.initialHeight}px`,
        transition: "max-height 0.5s ease",
      };
    },
  },
  mounted() {
    this.checkTextOverflow();
  },
  methods: {
    toggleText() {
      this.isExpanded = !this.isExpanded;

      if (this.isExpanded) {
        this.$nextTick(() => {
          this.fullHeight = this.$refs.text.scrollHeight;
        });
      }
    },
    checkTextOverflow() {
      const textElement = this.$refs.text;

      this.fullHeight = textElement.scrollHeight;
      if (textElement.scrollHeight > this.initialHeight) {
        this.showButton = true;
      }
    },
  },
};
</script>

<style></style>
