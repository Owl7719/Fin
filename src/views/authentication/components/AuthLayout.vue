<template>
  <v-container fluid height="100%" class="pa-0 auth-container">
    <v-row no-gutters class="fill-height">
      <v-col md="8">
        <v-row no-gutters class="flex-column">
          <v-col class="pt-5 pl-5 pt-sm-11 pl-sm-11">
            <router-link to="/login">
              <img src="@/assets/auth-logo.svg" alt="crm" title="crm" />
            </router-link>
          </v-col>
          <v-col class="auth-main">
            <v-row no-gutters class="pt-3 justify-center">
              <v-col cols="11" sm="6" md="5" lg="4">
                <slot></slot>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="4" fill-height class="right-side hidden-sm-and-down"></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>

<style scoped>
.auth-main {
  margin-top: 60px;
}

.auth-logo {
  margin-top: 10px;
  margin-left: 20px;
}

@media screen and (min-width: 600px) {
  .auth-logo {
    margin-top: 55px;
    margin-left: 42px;
  }
}

.right-side {
  background-image: url("./../../../assets/auth-background.png");
  background-size: cover;
}

.auth-container {
  background-color: #fff;
  align-items: normal !important;
}

:deep(.auth-link) {
  color: #176192;
  font-weight: 500;
  text-decoration: underline;
}
:deep(.auth-help) {
  color: #737373;
}
</style>
