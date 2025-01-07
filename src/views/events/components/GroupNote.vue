<template>
  <div>
    <s-button type="tertiary" @click="openDialog">
      <v-icon class="material-icons-outlined mr-1">insert_drive_file</v-icon>
      Group notes
    </s-button>

    <s-dialog v-model="dialog" :persistent="isEdit" max-width="800" title="Group notes">
      <template #header-actions>
        <s-button v-show="!isEdit" type="tertiary-blue" class="mr-0" @click="isEdit = true">
          <v-icon class="mr-1 material-icons-outlined">edit</v-icon>
          Edit
        </s-button>
      </template>

      <template #content>
        <v-textarea
          v-if="isEdit"
          v-model="newText"
          class="group-notes__notes"
          placeholder="You can add a note here..."
          :counter="maxLength"
          rows="7"
          autofocus
          auto-grow
          variant="underlined"
          color="primary"
        ></v-textarea>
        <div v-else class="my-2 note-preview" @dblclick="isEdit = true">
          {{ eventSlot.group_note }}
        </div>
      </template>

      <template #actions>
        <template v-if="!isEdit">
          <v-spacer></v-spacer>
          <s-button v-if="!isEdit" type="tertiary" @click="closeDialog"> Close </s-button>
        </template>

        <template v-else>
          <s-confirm
            v-if="eventSlot.group_note"
            v-model="confirmDialog"
            confirm-label="Remove"
            @confirm="remove"
          >
            <template #activator="{}">
              <s-button type="error" @click="confirmDialog = !confirmDialog"> Remove </s-button>
            </template>
            <span>Really delete the note?</span>
          </s-confirm>
          <v-spacer></v-spacer>
          <s-button v-if="eventSlot.group_note" type="tertiary" @click="cancel"> Cancel </s-button>
          <s-button v-else type="tertiary" @click="closeDialog"> Close </s-button>
          <s-button :disabled="!canSave" @click="save">
            {{ !eventSlot.group_note ? "Add note" : "Update" }}
          </s-button>
        </template>
      </template>
    </s-dialog>
  </div>
</template>

<script>
import SConfirm from "@/s-components/Dialog/SConfirm.vue";
import SDialog from "@/s-components/Dialog/SDialog.vue";
import EventSlotApi from "@/api/event-slots";
import SButton from "@/s-components/Button/SButton.vue";
export default {
  components: {
    SButton,
    SConfirm,
    SDialog,
  },
  props: {
    eventSlot: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      maxLength: 6000,
      isEdit: false,
      dialog: false,
      newText: "",
      confirmDialog: false,
    };
  },
  computed: {
    canSave() {
      return this.newText && this.newText.length > 2 && this.newText.length <= this.maxLength;
    },
  },
  methods: {
    openDialog() {
      if (!this.eventSlot.group_note) {
        this.isEdit = true;
      }
      this.newText = this.eventSlot.group_note;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    save() {
      this.isEdit = false;
      this.updateNote(this.newText);
    },
    cancel() {
      this.newText = this.eventSlot.group_note;
      this.isEdit = false;
    },
    updateNote(newText) {
      EventSlotApi.updateResource(this.eventSlot.event_id, this.eventSlot.id, {
        group_note: newText,
      }).then(() => {
        this.eventSlot.group_note = this.newText = newText;
      });
    },
    remove() {
      this.updateNote("");
    },
  },
};
</script>

<style scoped lang="scss">
.note-preview {
  white-space: pre-line;
  font-size: 14px;
  line-height: 16px;
}

.group-notes__notes :deep(textarea.v-field__input) {
  font-size: 14px;
  line-height: 16px;
  color: #1d2f3d !important;
}
</style>
