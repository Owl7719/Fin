<template>
  <div class="s-table__overflow">
    <table :class="tableClasses">
      <caption v-if="caption" class="py-2">
        {{
          caption
        }}
      </caption>
      <thead v-if="headers.length > 0">
        <tr class="s-simple-table__row">
          <th
            v-for="header in headers"
            :key="header.value || header.text"
            class="text-left"
            :width="header.width || ''"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <slot name="items" :item="item"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    caption: {
      type: String,
      default: "",
    },
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      required: true,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    tableClasses() {
      return {
        "s-simple-table": true,
        "s-simple-table--border": !this.noBorder,
      };
    },
  },
};
</script>

<style lang="scss">
.s-table__overflow {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.s-simple-table--border {
  border: 1px solid #cbcbcb;
}

.s-simple-table {
  width: 100%;
  border-collapse: collapse;

  caption {
    text-align: left;
    color: #676b70;
    font-weight: bold;
  }

  tr {
    border-bottom: 1px solid #cbcbcb;

    th {
      white-space: nowrap;
      font-weight: 500;
      color: #8e979e;
    }

    td {
      font-weight: 400;
      color: #475669;
    }

    td,
    th {
      font-size: 12px;
      padding: 20px;
    }
  }

  tr:last-child {
    border-bottom: none;
  }
}
</style>
