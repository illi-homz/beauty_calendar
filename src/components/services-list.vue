<template>
  <div class="services-list">
    <v-dialog
      v-model="value"
      max-width="80%"
      @click:outside="closeDialog"
    >
      <v-sheet class="pa-2">
        <div class="clients-list">
          <v-card
            class="pa-0 pl-2 mb-2"
            style="cursor: pointer"
            outlined
            v-for="(service, i) in services"
            :key="service.id"
          >
            <v-row class="ma-0" dense>
              <v-col cols="7">
                <span v-if="!(isServiceEdit && service.id === editedService.id)">{{service.title}}</span>
                <v-textarea
                  v-else
                  v-model="editedService.title"
                  class="services-list__textarea"
                  autofocus
                  dense
                  hide-details
                  rows="1"
                  auto-grow
                  no-resize
                ></v-textarea>
              </v-col>
              <v-col class="d-flex justify-end">
                <!-- <v-spacer></v-spacer> -->
                <v-btn icon v-if="isServiceEdit && service.id === editedService.id" @click="saveService" height="30" width="30">
                  <v-icon>mdi-content-save-outline</v-icon>
                </v-btn>
                <v-btn icon @click="editService(service)" height="30" width="30">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="requestDelService(service)" height="30" width="30">
                  <v-icon>mdi-trash-can-outline</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
        <v-btn
          block
          outlined
          class="mt-2"
          color="green"
          @click="$emit('addSevice')"
        >
          <v-icon class="mr-2">mdi-cash-plus</v-icon>
        </v-btn>
      </v-sheet>
    </v-dialog>

    <DelDialog
      v-model="dialog"
      :name="editedService.title"
      :id="editedService.id"
      @delEvent="delService"
    />
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
  name: 'services-list',
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters([
      'SERVICES'
    ]),
  },
  watch: {
    SERVICES(s) {
      if (s.length) {
        this.services = s
      }
    }
  },
  data: () => ({
    dialog: false,
    services: [],
    isServiceEdit: false,
    edit: null,
    editedService: {}
  }),
  methods: {
    ...mapActions([
      'GET_SERVICES',
      'UPDATE_SERVICE',
      'DEL_SERVICE',

    ]),
    async saveService() {
      await this.UPDATE_SERVICE({
        id: this.editedService.id,
        changes: {
          title: this.editedService.title
        }
      })
      await this.GET_SERVICES()
      this.isServiceEdit = false
    },
    editService(service) {
      this.isServiceEdit = true
      this.editedService = {...service}
    },
    closeDialog() {
      this.isServiceEdit = false
      this.$emit('input', false)
    },
    requestDelService(service) {
      this.editedService = {...service}
      this.dialog = true
    },
    async delService(id) {
      if (!id) return
      await this.DEL_SERVICE(id)
      await this.GET_SERVICES()
      this.dialog = false
      this.editedService = {}
    }
  },
  async mounted() {
    await this.GET_SERVICES()
  },
};
</script>

<style lang="scss">
.services-list {
  &__textarea textarea {
    line-height: 22px !important;
  }
}
</style>
