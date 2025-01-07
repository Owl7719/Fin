import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VTreeview } from "vuetify/labs/VTreeview";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VTimePicker } from "vuetify/labs/VTimePicker";
import { aliases, md } from "vuetify/iconsets/md";

const lightTheme = {
  dark: false,
  colors: {
    primary: "#016BBF",
    secondary: "#1D2F3D",
    thernary: "#041329",
    quaternary: "#156192",
    accent: "#ffffff",
    error: "#ED4A4B",
    warning: "#f8ac59",
    info: "#2099F2",
    success: "#4caf50",
  },
  variables: {
    // 'border-color': '#000000',
    // 'border-opacity': 0.12,
    // 'high-emphasis-opacity': 0.87,
    // 'medium-emphasis-opacity': 0.60,
    // 'disabled-opacity': 0.38,
    // 'idle-opacity': 0.04,
    // 'hover-opacity': 0.04,
    // 'focus-opacity': 0.12,
    // 'selected-opacity': 0.08,
    // 'activated-opacity': 0.12,
    // 'pressed-opacity': 0.12,
    // 'dragged-opacity': 0.08,
    // 'theme-kbd': '#212529',
    // 'theme-on-kbd': '#FFFFFF',
    // 'theme-code': '#F5F5F5',
    // 'theme-on-code': '#000000',
  },
};

export default createVuetify({
  components: {
    VTreeview,
    VDateInput,
    VTimePicker,
  },
  theme: {
    defaultTheme: "lightTheme",
    themes: {
      lightTheme,
    },
  },
  icons: {
    defaultSet: "md",
    aliases: {
      ...aliases,
      expand: "keyboard_arrow_left",
      clear: "close",
    },
    sets: {
      md,
    },
  },
});
