<template>
  <v-btn
    :disabled="disabled"
    :color="color"
    :to="to"
    :variant="variant"
    :size="size"
    :class="buttonClass"
    :style="buttonStyleVariables"
    :height="height"
    :loading="loading"
    :target="target"
    :icon="icon"
    :href="href"
    :ripple="false"
    :block="block"
    :type="btnType"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: "SButton",
  props: {
    type: {
      type: String,
      default: "primary",
      validator(value) {
        return ["primary", "secondary", "tertiary", "tertiary-blue", "error"].includes(value);
      },
    },
    to: {
      type: [String, Object],
      default: null,
    },
    size: {
      type: String,
      default: "default",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "",
    },
    height: {
      type: [String, Number],
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    target: {
      type: String,
      default: "",
    },
    href: {
      type: String,
      default: "",
    },
    defaultHover: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: [String, Boolean],
      default: false,
    },
    submit: {
      type: Boolean,
      default: false,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    variant() {
      if (this.type === "tertiary" || this.type === "tertiary-blue" || this.type === "error") {
        return "text";
      }

      if (this.type === "secondary") {
        return "outlined";
      }

      return "flat";
    },
    buttonClass() {
      return {
        "s-button__primary": this.type === "primary",
        "s-button__secondary": this.type === "secondary",
        "s-button__tertiary":
          this.type === "tertiary" || this.type === "tertiary-blue" || this.type === "error",
      };
    },
    buttonStyleVariables() {
      let color = "#1d2f3d";
      let bgColorOnHover = "#f5f5f5";
      let bgColorOnPress = "#e5e5e5";

      switch (this.type) {
        case "tertiary-blue":
          color = "#016BBF";
          bgColorOnHover = "#F2F8FC";
          bgColorOnPress = "#E6F0F9";
          break;
        case "error":
          color = "#ED4A4B";
          bgColorOnHover = "#FEF6F6";
          bgColorOnPress = "#FEEEED";
          break;
      }

      if (this.defaultHover) {
        bgColorOnHover = "rgba(0, 0, 0, 0.08)";
      }

      return {
        "--button-color": color,
        "--button-hover-bg-color": bgColorOnHover,
        "--button-press-bg-color": bgColorOnPress,
      };
    },
    btnType() {
      return this.submit ? "submit" : this.reset ? "reset" : "button";
    },
  },
};
</script>

<style lang="scss" scoped>
.v-btn {
  text-transform: none !important;

  &:hover {
    &::before {
      opacity: 0;
    }
  }
}

.s-button__primary {
  background-color: #016bbf !important;
  color: #ffffff !important;

  &:hover {
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    background-color: #4090cf !important;
  }

  &:active {
    background-color: #01508f !important;
  }
}

.v-theme--lightTheme.v-btn.v-btn--disabled.s-button__primary {
  color: #ffffff !important;
  background-color: #bfdaef !important;

  &:deep(.v-icon) {
    color: #ffffff !important;
  }
}

.s-button__secondary {
  color: #1d2f3d !important;
  border-color: #a3aab4 !important;
  background-color: #ffffff !important;

  &:hover {
    transition: border 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    border-color: #d1d5da !important;
  }

  &:active {
    background-color: #f5f5f5 !important;
    border-color: #a3aab4 !important;
  }

  &:disabled {
    background-color: #ffffff !important;
    color: #a3aab4 !important;
    border-color: #d1d5da !important;
  }
}

.v-theme--lightTheme.v-btn.v-btn--disabled.s-button__secondary {
  background-color: #ffffff !important;
  color: #a3aab4 !important;
  border-color: #d1d5da !important;

  &:deep(.v-icon) {
    color: #d1d5da !important;
  }
}

.s-button__tertiary {
  color: var(--button-color) !important;

  &:hover {
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.6, 1);
    background-color: var(--button-hover-bg-color) !important;
  }

  &:active {
    background-color: var(--button-press-bg-color) !important;
  }

  &:disabled:not(.v-btn--active) {
    color: #a3aab4 !important;
  }
}

.v-btn--active {
  background-color: var(--button-press-bg-color) !important;
}

.v-theme--lightTheme.v-btn.v-btn--disabled.v-btn--active {
  background-color: var(--button-press-bg-color) !important;
  color: var(--button-color) !important;
}

.v-theme--lightTheme.v-btn--active:hover::before,
.v-theme--lightTheme.v-btn--active::before {
  opacity: 0;
}

.v-theme--lightTheme.v-btn.v-btn--disabled.s-button__tertiary {
  color: #a3aab4 !important;

  &:deep(.v-icon) {
    color: #a3aab4 !important;
  }
}
</style>
