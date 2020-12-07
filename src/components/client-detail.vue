<template>
  <v-dialog
    v-if="!dialog"
    v-model="value"
    max-width="80%"
    @click:outside="$emit('input', false)"
  >
    <v-sheet>
      <v-card>
        <v-toolbar
          :color="currentClient.color"
          class="text-caption"
          dark
          outlined
          flat
          height="40"
        >
          <v-toolbar-title class="mr-2 d-flex align-center">
            <v-icon class="mr-2">mdi-account</v-icon><span class="ma-0">Клиент:</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon height="35" width="35" @click="updateClient" v-if="edit">
            <v-icon>mdi-content-save-outline</v-icon>
          </v-btn>
          <v-btn icon height="35" width="35" @click="cancelEdit" v-if="edit">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
          <v-btn icon height="35" width="35" @click="editClient" v-if="!edit">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon height="35" width="35" @click="requestDelClient" v-if="!edit">
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </v-toolbar>

        <v-sheet class="px-2 py-2">
          <div class="px-3" v-if="!edit">
            <v-row class="ma-0">
              <v-col class="col-4 pa-0 text-body-2">
                <span>Имя:</span>
              </v-col>
              <v-col class="pa-0 text-body-2 text-right">
                <span>{{currentClient.name}}</span>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0 text-body-2">
                <span>Фамилия:</span>
              </v-col>
              <v-col class="pa-0 text-body-2 text-right">
                <span>{{currentClient.lastName}}</span>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0 text-body-2">
                <span>Д.р.:</span>
              </v-col>
              <v-col class="pa-0 text-body-2 text-right">
                <span v-if="currentClient.birthDay">{{new Date(currentClient.birthDay).toLocaleString().substr(0, 10)}}</span>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0 text-body-2">
                <span>Тел.:</span>
              </v-col>
              <v-col class="pa-0 text-body-2 text-right">
                <a :href="`tel:${currentClient.tel}`">{{currentClient.tel}}</a>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0 text-body-2">
                <span>Заметки:</span>
              </v-col>
              <v-col class="pa-0 text-caption text-right">
                <span>{{currentClient.notes}}</span>
              </v-col>
            </v-row>
          </div>

          <div class="px-3" v-else>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0">
                <span class="text-body-2">Имя:</span>
              </v-col>
              <v-col class="pa-0">
                <v-text-field
                  ref="name"
                  v-model="editedClient.name"
                  class="ma-0 pa-0 text-body-2"
                  hide-details
                  dense
                  :rules="[v => !!v]"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0">
                <span class="text-body-2">Фамилия:</span>
              </v-col>
              <v-col class="pa-0">
                <v-text-field
                  v-model="editedClient.lastName"
                  class="ma-0 pa-0 text-body-2"
                  hide-details
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0">
                <span class="text-body-2">Д.р.:</span>
              </v-col>
              <v-col class="pa-0">
                <v-menu
                  ref="menuDate"
                  v-model="menuDate"
                  :close-on-content-click="false"
                  :return-value.sync="editedClient.birthDay"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      ref="birthDay"
                      v-model="editedClient.birthDay"
                      prepend-icon="mdi-calendar"
                      class="text-body-2"
                      readonly
                      hide-details
                      dense
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedClient.birthDay"
                    no-title
                    scrollable
                    locale="ru-RU"
                    color="blue"
                    :weekday-format="getDay"
                    :first-day-of-week="1"
                    @input="$refs.menuDate.save(editedClient.birthDay)"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0">
                <span class="text-body-2">Телефон:</span>
              </v-col>
              <v-col class="pa-0">
                <v-text-field
                  v-model="editedClient.tel"
                  class="ma-0 pa-0 text-body-2"
                  hide-details
                  dense
                  maxlength="18"
                  @input="acceptNumber"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="ma-0">
              <v-col class="col-4 pa-0">
                <span class="text-body-2">Заметки:</span>
              </v-col>
              <v-col class="pa-0">
                <v-textarea
                  v-model="editedClient.notes"
                  class="ma-0 pa-0 text-body-2"
                  rows="2"
                  no-resize
                  hide-details
                ></v-textarea>
              </v-col>
            </v-row>
          </div>

          <div class="mb-1 mt-2 px-3 font-weight-bold d-flex align-center justify-space-between">
            <span>История:</span>
            <v-btn
              class="ma-0 pa-0 text-caption"
              x-small
              text
              @click="requestClearHistory"
            >
              <v-icon>mdi-broom</v-icon>
              Очистить
            </v-btn>
          </div>
          <div class="client-history">
            <div
              class="text-caption"
              v-for="(event, i) in currentClient.history"
              :key="i"
              :class="{'red--text' : event.services === '-1'}"
            >
              <v-row class="ma-0">
                <v-col cols="1" class="pa-0 font-weight-bold">{{ i+1 }}.</v-col>
                <v-col class="pa-0">
                  <div>
                    <p class="ma-0">{{ new Date(event.start) | date }} ({{ event.price }} ₽, <span class="text-decoration-line-through">{{ event.cost }}</span> ₽)</p>
                    <p
                      class="ma-0"
                      v-if="event.services !== '-1'"
                    >
                      <span
                        v-for="s in event.services"
                        :key="s.id"
                      >
                        {{ s.title }};
                      </span>
                    </p>
                    <p v-else class="ma-0">Клиент не пришел</p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-sheet>
      </v-card>
    </v-sheet>
  </v-dialog>
  <DelDialog
    v-else-if="dialog"
    v-model="dialog"
    :name="dialogData.name"
    :id="dialogData.id"
    @delEvent="dialogData.function"
  >
    {{ dialogData.text }}
  </DelDialog>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import phoneFormatter from '@/services/phoneFormatter'

export default {
  name: 'client-detail',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'CURRENT_CLIENT'
    ]),
    // form() {
    //   return ['name']
    // },
  },
  watch: {
    async CURRENT_CLIENT(cl) {
      if (cl === {}) return
      this.currentClient = {...cl}
      const events = await this.GET_EVENTS_BY_CLIENT_ID(cl.id)
      await events.forEach(async ev => {
        if (ev.services !== '-1') {
          const services = []
          ev.services.forEach(async s => {
            services.push(await this.GET_SERVICE(s))
          })
          ev.services = services
        }
      });
      this.currentClient.history = events.reverse()
    },
    value(v) {
      if (!v) {
        this.editedClient = {}
        this.edit = false
      }
    }
  },
  data: () => ({
    currentClient: {},
    dialog: false,
    dialogData: {
      id: null,
      name: null,
      text: null,
      function: () => {}
    },
    edit: false,
    editedClient: {},
    menuDate: false,
    form: ['name'],
    formHasErrors: false
  }),
  methods: {
    ...mapActions([
      'GET_SERVICE',
      'UPDATE_CLIENT',
      'DEL_CLIENT',
      'GET_EVENTS_BY_CLIENT_ID',
      'DEL_EVENTS_BY_CLIENT_ID',
      'GET_EVENTS',
      'GET_CLIENTS'
    ]),
    ...mapMutations([
      'SET_CURRENT_CLIENT'
    ]),
    editClient() {
      this.edit = true
      this.editedClient = {...this.currentClient}
    },
    cancelEdit() {
      this.edit = false
      this.editedClient = {}
    },
    async updateClient() {
      this.formHasErrors = false

      this.form.forEach(f => {
        if (!this.$refs[f]) this.formHasErrors = true

        if (!this.$refs[f].validate(true)) this.formHasErrors = true
      })
      if (this.formHasErrors) return

      const changes = {
        name: this.editedClient.name,
        lastName: this.editedClient.lastName,
        tel: this.editedClient.tel,
        birthDay: this.editedClient.birthDay,
        notes: this.editedClient.notes
      }
      await this.UPDATE_CLIENT({id: this.editedClient.id, changes})
      this.SET_CURRENT_CLIENT(this.editedClient)
      await this.GET_CLIENTS()
      await this.GET_EVENTS()
      this.edit = false
    },
    requestClearHistory() {
      this.dialogData.id = this.currentClient.id
      this.dialogData.name = this.currentClient.name
      this.dialogData.text = 'Очистить историю?'
      this.dialogData.function = this.clearHistory
      this.dialog = true
    },
    async clearHistory(id) {
      if (!id) return
      await this.UPDATE_CLIENT({
        id: id,
        changes: {
          history: []
        }
      })
      this.currentClient.history = []
    },
    requestDelClient() {
      this.dialogData.id = this.currentClient.id
      this.dialogData.name = this.currentClient.name
      this.dialogData.text = 'Удалить клиента и его записи?'
      this.dialogData.function = this.delClient
      this.dialog = true
    },
    async delClient(id) {
      if (!id) return
      await this.DEL_CLIENT(id)
      await this.DEL_EVENTS_BY_CLIENT_ID(id)
      await this.GET_EVENTS()

      this.$emit('delClient', id)

      setTimeout(() => {
        this.$emit('input', false)
      }, 10)
    },
    getDay(date){
      const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      let i = new Date(date).getDay()
      return daysOfWeek[i]
    },
    acceptNumber() {
      this.editedClient.tel = phoneFormatter(this.editedClient.tel)
    },
  },
};
</script>

<style lang="scss">
.client-history {
  max-height: 30vh;
  overflow: scroll;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  padding: 5px;
}
</style>
