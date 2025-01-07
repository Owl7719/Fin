<template>
  <vue-draggable-next
    class="s-nested-list__parent"
    v-bind="getOptions"
    :list="items"
    tag="ol"
    @change="onChange"
  >
    <li v-for="row in items" :key="row.name" class="nested-sortable">
      <slot :item="row"></slot>
      <s-nested-list
        v-if="row.children"
        class="s-nested-list__child"
        :items="row.children"
        @change="onChange"
      >
        <template #default="{ item }">
          <slot :item="item"></slot>
        </template>
      </s-nested-list>
    </li>
  </vue-draggable-next>
</template>

<script>
import { VueDraggableNext } from "vue-draggable-next";

export default {
  name: "SNestedList",
  components: {
    VueDraggableNext,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  emits: ["change"],
  computed: {
    getOptions() {
      return {
        handle: ".nested-list-drag-handler",
        animation: 200,
        ghostClass: "ghost",
        group: {
          name: "draggable-list",
          pull: (to, from, dragEl) => {
            let toLvl = 0;
            let currentElement = to.el;

            while (currentElement.parentNode) {
              if (
                currentElement.parentNode.classList &&
                currentElement.parentNode.classList.contains("nested-sortable")
              ) {
                toLvl++;
              }

              currentElement = currentElement.parentNode;
            }

            const hasChildren = dragEl.querySelector(".s-nested-list__child").children.length;

            if (toLvl > 1 || hasChildren) {
              return false;
            }

            return true;
          },
        },
      };
    },
  },
  methods: {
    onChange(event) {
      this.$emit("change", event);
    },
  },
};
</script>

<style scoped>
ol {
  list-style-type: none;
}

.s-nested-list__parent {
  padding: 0 !important;
}

.s-nested-list__child {
  margin-left: 24px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
