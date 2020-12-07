<template>
  <v-dialog
    v-model="value"
    persistent
    @click:outside="closeDialog"
  >
    <v-card ref="form" class="pa-4">
      <v-text-field
        ref="name"
        v-model="client.name"
        label="Имя"
        :color="color"
        :rules="[v => !!v || 'Заплните это поле']"
        counter="20"
        maxlength="20"
        autofocus
        required
      ></v-text-field>

      <v-text-field
        ref="lastName"
        v-model="client.lastName"
        label="Фамилия"
        :color="color"
        counter="20"
        maxlength="20"
      ></v-text-field>

      <v-text-field
        ref="tel"
        v-model="client.tel"
        label="Телефон"
        :color="color"
        maxlength="18"
        @input="acceptNumber"
        @click="client.tel = '+7'"
      ></v-text-field>

      <v-menu
        ref="menuDate"
        v-model="menuDate"
        :close-on-content-click="false"
        :return-value.sync="client.birthDay"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            ref="birthDay"
            v-model="client.birthDay"
            label="День рождения"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="client.birthDay"
          no-title
          scrollable
          locale="ru-RU"
          :color="color"
          :weekday-format="getDay"
          :first-day-of-week="1"
          @input="$refs.menuDate.save(client.birthDay)"
        >
        </v-date-picker>
      </v-menu>

      <v-textarea
        ref="notes"
        v-model="client.notes"
        label="Заметки"
        rows="2"
        no-resize
        :color="color"
      ></v-textarea>

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
import phoneFormatter from '@/services/phoneFormatter'

export default {
  name: 'client-add',
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
  },
  data: () => ({
    // dialog: true,
    edit: false,
    client: {
      name: '',
      lastName: '',
      tel: '',
      birthDay: '',
      notes: '',
      color: '',
      history: []
    },
    color: 'pink lighten-4',
    menuDate: false,
    formHasErrors: false,
  }),
  computed: {
    form() {
      return ['name', 'lastName', 'tel', 'birthDay', 'notes']
    },
  },
  methods: {
    ...mapActions([
      'ADD_CLIENT'
    ]),
    async submit() {
      this.formHasErrors = false

      this.form.forEach(f => {
        if (!this.$refs[f]) this.formHasErrors = true

        if (!this.$refs[f].validate(true)) this.formHasErrors = true
      })
      if (this.formHasErrors) return

      this.client.color = '#66BB6A'

      await this.ADD_CLIENT({...this.client})
      this.closeDialog()
    },
    closeDialog() {
      this.cleanForm()
      this.$emit('input', false)
    },
    cleanForm() {
      this.form.forEach(f => {
        if (f !== 'tel') {
          this.$refs[f].reset()
        }
        this.client.tel = ''
      })
    },
    getDay(date){
      const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      let i = new Date(date).getDay()
      return daysOfWeek[i]
    },
    acceptNumber() {
      this.client.tel = phoneFormatter(this.client.tel)
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
