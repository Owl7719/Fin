<template>
  <s-dashboard-card>
    <div class="info-card__number">{{ number }}</div>
    <div class="info-card__title">{{ title }}</div>
    <div class="info-card__action">
      <s-button type="tertiary-blue">Show all</s-button>
    </div>
  </s-dashboard-card>
</template>

<script>
import SDashboardCard from "@/views/dashboard/widgets/SDashboardCard";
import SButton from "@/s-components/Button/SButton.vue";

export default {
  components: { SButton, SDashboardCard },
  props: {
    number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.info-card {
  border-radius: 4px;
  min-height: 210px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info-card__number {
  font-size: 64px;
  font-weight: 300;
}
.info-card__title {
  font-size: 16px;
  color: #737373;
  font-weight: 400;
}
.info-card__link {
  font-weight: 500;
  font-size: 14px;
}
.info-card__link:hover {
  color: #4a82af;
}

@media (max-width: 599px) {
  .info-card {
    min-height: 140px;
  }
  .info-card__number {
    font-size: 48px;
    font-weight: 300;
  }
}
</style>
