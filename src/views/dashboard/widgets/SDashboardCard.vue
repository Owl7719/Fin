<template>
  <v-card outlined class="info-card text-center">
    <slot></slot>
  </v-card>
</template>

<style scoped lang="scss">
.info-card {
  border-radius: 4px;
  min-height: 304px;
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
