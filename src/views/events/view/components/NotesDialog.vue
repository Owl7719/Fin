<template>
  <s-dialog v-if="investor" v-model="dialog" :title="title" :max-width="800" :persistent="isEdit">
    <template #header-actions>
      <s-button v-if="!isEdit" type="tertiary-blue" class="edit-button" @click="edit">
        <v-icon class="mr-1 material-icons-outlined">edit</v-icon>
        Edit
      </s-button>
    </template>

    <template #content>
      <interaction
        v-if="interaction && investor"
        ref="interaction"
        v-model="interaction"
        :title="investor.full_name + ' - Notes'"
        :participants-editable="false"
        :show-participants="false"
        :is-edit="isEdit"
        no-edit-actions
        column
        @update:model-value="change"
        @isEdit="isEdit = $event"
      >
      </interaction>
    </template>

    <template v-if="isEdit" #actions>
      <v-spacer></v-spacer>
      <s-button type="tertiary" class="mr-2" @click="closeDialog"> Cancel </s-button>
      <s-button @click="update"> Update </s-button>
    </template>
  </s-dialog>
</template>

<script>
import { bus } from "@/plugins/bus";
import Interaction from "@/views/logs/view/components/InteractionComponent.vue";
import SButton from "@/s-components/Button/SButton.vue";
import SDialog from "@/s-components/Dialog/SDialog.vue";

export default {
  components: { SDialog, SButton, Interaction },
  provide: {
    showEventLink: false, // for InteractionView component
    showGroupNote: false, // for InteractionView component
  },
  data() {
    return {
      dialog: false,
      investor: null,
      interaction: null,
      isEdit: false,
    };
  },
  computed: {
    title() {
      return this.investor.full_name + " - Notes";
    },
  },
  watch: {
    dialog(value) {
      if (value === false) {
        this.investor = null;
        this.interaction = null;
      }
    },
  },
  methods: {
    edit() {
      this.isEdit = true;
    },
    showDialog(interactionLog, investor) {
      this.dialog = true;
      this.interaction = interactionLog;
      this.investor = investor;
    },
    closeDialog() {
      this.dialog = false;
      this.isEdit = false;
    },
    change(data) {
      this.success("Interaction log updated");

      bus.emit("updateInteraction", {
        id: data.id,
        slot_id: data.logable_id,
        comment: data.interaction.ownership_comment,
        notes: data.interaction.notes,
        quality: data.interaction.quality,
        data: data.when.date,
      });
    },
    update() {
      this.$refs["interaction"].update();
    },
  },
};
</script>

<style scoped lang="sass">
button.v-btn.close-button
  margin-right: -20px
  margin-left: 10px
</style>
