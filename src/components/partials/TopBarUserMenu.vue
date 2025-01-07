<template>
  <v-btn variant="text" class="user-menu__btn">
    <div class="pa-1 text-right">
      <span>
        {{ userName }}
      </span>
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <div
            v-show="companyName"
            class="caption text-grey text-truncate"
            style="max-width: 150px"
            v-bind="props"
          >
            {{ companyName }}
          </div>
        </template>
        <span>{{ companyName }}</span>
      </v-tooltip>
    </div>
    <v-icon right>keyboard_arrow_down</v-icon>

    <v-menu activator="parent" transition="slide-y-transition">
      <v-list class="user-profile" density="comfortable">
        <v-list-item active-class="grey-lighten-2" ripple :to="{ name: 'edit-user-profile' }">
          <v-list-item-title>My profile</v-list-item-title>
        </v-list-item>
        <v-list-item active-class="grey-lighten-2" ripple :to="{ name: 'change-password' }">
          <v-list-item-title>Change password</v-list-item-title>
        </v-list-item>
        <v-list-item
          active-class="grey-lighten-2"
          ripple
          :to="{ name: 'two-factor-authentication-settings' }"
        >
          <v-list-item-title> Two factor authentication </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item active-class="grey-lighten-2" ripple to="/help">
          <v-list-item-title>Help</v-list-item-title>
        </v-list-item>
        <v-list-item active-class="" ripple @click.prevent="onLogoutHandle">
          <v-list-item-title>Log out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script>
export default {
  computed: {
    userName() {
      return this.$store.state.user.data.full_name;
    },
    companyName() {
      const user = this.$store.state.user.data;
      return user.company && user.company.name ? user.company.name : "";
    },
  },
  methods: {
    onLogoutHandle() {
      this.logout();
    },
  },
};
</script>

<style scoped lang="sass">
:deep(.user-profile .v-list-item-title)
  font-weight: normal !important
  font-size: 0.928rem !important

.text-grey
  font-size: 12px !important
  font-weight: 400
  letter-spacing: .0333333333em !important
  line-height: 1.25rem

.v-btn:hover:before
  opacity: .08

.v-btn:before
  background-color: currentColor
  border-radius: inherit
  bottom: 0
  color: inherit
  content: ""
  left: 0
  opacity: 0
  pointer-events: none
  position: absolute
  right: 0
  top: 0
  transition: opacity .2s cubic-bezier(.4,0,.6,1)
</style>
