<template>
  <div>
    <keep-alive>
      <component :is="$store.state.user.component"></component>
    </keep-alive>

    <v-dialog v-if="!lock" v-model="dialog" width="400">
      <v-card>
        <v-card-title class="headline">{{ headline }}</v-card-title>

        <v-card-text>
          {{ message }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-else :value="true" fullscreen width="400">
      <v-card color="#f1f1f1">
        <v-row>
          <v-col cols="10" offset="1" sm="6" offset-sm="3" class="mt-4">
            <div class="inner-message">
              <div class="header mb-3">
                {{ headline }}
              </div>
              <v-divider dark></v-divider>
              <div class="text mt-3">
                {{ message }}
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Investor from "./InvestorPage.vue";
import Company from "./CompanyPage.vue";
import Admin from "./AdminPage.vue";

export default {
  components: { Investor, Company, Admin },
  data() {
    return {
      dialog: false,
      headline: false,
      message: null,
      type: null,
      lock: false,
    };
  },
  created() {
    this.message = this.getParameterByName("message");
    this.headline = this.getParameterByName("headline");
    this.type = this.getParameterByName("type") ? this.getParameterByName("type") : "success";
    this.lock = this.getParameterByName("lock") == 1 || false;
    if (this.message != null && this.headline != null) {
      this.dialog = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.inner-message {
  background-color: #4caf50;
  color: white;
  padding: 20px;
  border: 1px solid #eaeaea;

  .header {
    font-size: 1.6em;
  }
}
</style>
