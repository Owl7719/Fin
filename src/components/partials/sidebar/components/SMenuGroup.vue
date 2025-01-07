<template>
  <div class="s-menu-group" :class="{ 's-menu-group--active': visible }">
    <sidebar-item
      class="s-menu-group__activator"
      :title="title"
      :icon="icon"
      @click="toggleGroup"
    />

    <!-- SLOT FOR ITEMS -->
    <div :id="'sch-sidebar-group-' + groupKey" class="sch-sidebar-group">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SidebarItem from "@/components/partials/sidebar/components/SMenuItem";
import permissionsMixin from "./permissions-mixin";

export default {
  components: { SidebarItem },
  mixins: [permissionsMixin],
  props: {
    value: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    ifCan: {
      type: String,
      default: null,
    },
    groupKey: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    this.visible = this.active;
    this.toggleGroupStyle();
  },
  methods: {
    toggleGroup() {
      this.visible = !this.visible;
      this.toggleGroupStyle();
    },
    toggleGroupStyle() {
      const group = document.querySelector(`#sch-sidebar-group-${this.groupKey}`);

      if (!group) return;

      if (!this.visible) {
        group.style.maxHeight = 0;
        group.style.overflow = "hidden";
      } else {
        group.style.maxHeight = "100vh";
      }
    },
  },
};
</script>

<style scoped>
.sch-sidebar-group {
  -webkit-transition: max-height 0.2s ease-out;
  -moz-transition: max-height 0.2s ease-out;
  -o-transition: max-height 0.2s ease-out;
  -ms-transition: max-height 0.2s ease-out;
  transition: max-height 0.2s ease-out;
}

.sch-sidebar-group {
  padding-left: 22px;
}
</style>
