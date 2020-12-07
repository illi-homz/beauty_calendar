<template>
  <v-dialog
    v-model="value"
    persistent
    @click:outside="closeDialog"
  >
    <v-card ref="form" class="pa-4">
      <v-text-field
        ref="title"
        v-model="service.title"
        label="Название"
        :color="color"
        :rules="[v => !!v || 'Заплните это поле']"
        autofocus
        required
      ></v-text-field>

      <v-row class="px-2">
        <v-btn
          text
          small
          color="orange"
          @click="cleanForm"
        >
          Сброс
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          small
          @click="closeDialog"
        >
          Отмена
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          small
          @click="submit"
        >
          Ок
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'service-add',
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data: () => ({
    dialog: true,
    service: {
      title: ''
    },
    color: 'pink lighten-4',
    formHasErrors: false,
  }),
  computed: {
    form() {
      return ['title']
    },
  },
  methods: {
    ...mapActions([
      'ADD_SERVICE',
      'GET_SERVICES'
    ]),
    async submit() {
      this.formHasErrors = false

      this.form.forEach(f => {
        if (!this.$refs[f]) this.formHasErrors = true

        if (!this.$refs[f].validate(true)) this.formHasErrors = true
      })
      if (this.formHasErrors) return

      await this.ADD_SERVICE({...this.service})
      this.GET_SERVICES()
      this.closeDialog()
    },
    closeDialog() {
      this.cleanForm()
      this.$emit('input', false)
    },
    cleanForm() {
      this.$refs['title'].reset()
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
