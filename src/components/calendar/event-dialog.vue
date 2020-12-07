<template>
  <v-dialog
    v-model="value"
    persistent
    max-width="80%"
    @click:outside="$emit('input', false)"
  >
    <v-card
      color="grey lighten-4"
      flat
    >
      <v-toolbar
        :color="editedEvent.services !== '-1' ? editedEvent.color : 'red'"
        class="text-caption"
        dark
        flat
        height="40"
      >
        <v-toolbar-title class="mr-2">
          <span>{{editedEvent.name}}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon height="35" width="35" @click="updateEvent" v-if="isEventEdit">
          <v-icon>mdi-content-save-outline</v-icon>
        </v-btn>
        <v-btn icon height="35" width="35" @click="isEventEdit = false" v-if="isEventEdit">
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
        <v-btn icon @click="editEvent" height="35" width="35" v-if="!isEventEdit">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="selectedEvent.services !== '-1' && !isEventEdit"
          icon
          height="35"
          width="35"
          @click="requestDidntCome"
        >
          <v-icon>mdi-account-off</v-icon>
        </v-btn>
        <v-btn icon @click="requestDelEvent" height="35" width="35" v-if="!isEventEdit">
          <v-icon>mdi-trash-can-outline</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-3 pt-1">
        <div
          v-if="selectedEvent.client"
        >
          <div class="mt-1 text-body-2" v-if="!isEventEdit">
            {{ editedEvent.start | date('datetime') }} - {{ editedEvent.end | date('time') }}
          </div>
          <div class="mb-2" v-else>
            <v-row class="ma-0 mt-2">
              <v-col cols="10" class="pa-0">
                <v-menu
                  ref="menuDate"
                  v-model="menuDate"
                  :close-on-content-click="false"
                  :return-value.sync="date"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      ref="date"
                      class="text-body-2"
                      v-model="date"
                      hide-details
                      dense
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[(v) => !!v || 'Выберите дату']"
                      required
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    scrollable
                    locale="ru-RU"
                    color="pink lighten-4"
                    :weekday-format="getDay"
                    :first-day-of-week="1"
                    @input="$refs.menuDate.save(date)"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="pa-0 text-right">
                <v-menu
                  ref="Color"
                  v-model="menuColor"
                  :close-on-content-click="false"
                  :return-value.sync="color"
                  transition="scale-transition"
                  offset-y
                  min-width="300px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      depressed
                      :color="editedEvent.color"
                    >
                    </v-btn>
                  </template>
                  <v-color-picker
                    v-model="editedEvent.color"
                    hide-inputs
                    :swatches="swatches"
                    show-swatches
                  ></v-color-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="pb-0">
                <v-menu
                  ref="menuTime"
                  v-model="menuTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="time"
                  transition="scale-transition"
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      ref="time"
                      class="text-body-2"
                      v-model="time"
                      label="Начало"
                      hide-details
                      dense
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      color="pink lighten-4"
                      v-bind="attrs"
                      v-on="on"
                      :rules="[(v) => !!v || 'Выберите время']"
                      required
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuTime"
                    v-model="time"
                    format="24hr"
                    scrollable
                    full-width
                    color="pink"
                  >
                    <!-- @click:minute="$refs.menuTime.save(event.time)" -->
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menuTime = false">
                      Отмена
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menuTime.save(time)">
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-menu>
              </v-col>

              <v-col class="pb-0">
                <v-menu
                  ref="menuEndTime"
                  v-model="menuEndTime"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="endTime"
                  transition="scale-transition"
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      ref="endTime"
                      class="text-body-2"
                      v-model="endTime"
                      label="Конец"
                      hide-details
                      dense
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      color="pink lighten-4"
                      v-bind="attrs"
                      v-on="on"
                      :rules="[
                        (v) => !!v || 'Выберите время',
                        (v) => v !== '00:00' || 'Выберите время',
                        (v) => v > time || 'Некорректное время',
                      ]"
                      required
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="menuEndTime"
                    v-model="endTime"
                    format="24hr"
                    scrollable
                    full-width
                    color="pink"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menuEndTime = false">
                      Отмена
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menuEndTime.save(endTime)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>

          <div class="my-2"><a :href="`tel:${selectedEvent.tel}`">
            {{ selectedEvent.tel }}
          </a></div>

          <div class="mb-0 d-flex align-center"><span class="mr-2">Доход, ₽:</span>
            <span v-if="!isEventEdit" class="font-weight-bold">{{ editedEvent.price }}</span>
            <v-text-field
              v-else
              v-model="editedEvent.price"
              class="col-4 ma-0 pa-0 text-body-2"
              hide-details
              dense
              reverse
            ></v-text-field>
          </div>

          <div class="mb-2 d-flex align-center"><span class="mr-2">Расход, ₽:</span>
            <span v-if="!isEventEdit">{{ editedEvent.cost }}</span>
            <v-text-field
              v-else
              v-model="editedEvent.cost"
              class="col-4 ma-0 pa-0 text-body-2"
              hide-details
              dense
              reverse
            ></v-text-field>
          </div>
          <p
            v-if="selectedEvent.services === '-1'"
            class="ma-0 red--text"
          >Клиент не пришел</p>
          <div
            v-else
          >
            <p class="ma-0 font-weight-bold">Услуги:</p>
            <p
              v-for="(service, i) in editedEvent.services"
              :key="i"
              class="ma-0"
            >
              {{i+1}}. {{service}}
            </p>
          </div>
          <p class="ma-0 mt-2 font-weight-bold">Дополнительно:</p>
          <div>
            <p class="ma-0" v-if="!isEventEdit">
              {{ editedEvent.details }}
            </p>
            <v-textarea
              v-else
              v-model="editedEvent.details"
              dense
              hide-details
              rows="1"
              auto-grow
              no-resize
            ></v-textarea>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <DelDialog
      v-model="dialog"
      :name="selectedEvent.name"
      :id="selectedEvent.id"
      @delEvent="delEvent"
    />
    <DelDialog
      v-model="dialogDidntCome"
      :name="selectedEvent.name"
      :id="selectedEvent.id"
      @delEvent="didntCome"
    >Не пришел?</DelDialog>
  </v-dialog>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'event-dialog',
  props: {
    value: {
      type: Boolean,
      default: () => true
    },
    selectedEvent: {
      type: Object,
      default: () => {}
    },
  },
  data: () => ({
    date: '',
    menuDate: false,
    color: '',
    menuColor: false,
    time: '',
    menuTime: false,
    endTime: '',
    menuEndTime: false,
    dialog: false,
    dialogDidntCome: false,
    isEventEdit: false,
    editedEvent: {},
    formHasErrors: false,
    form: ['date', 'time', 'endTime'],
    swatches: [
      ['#F44336', '#E91E63'],
      ['#9C27B0', '#2196F3'],
      ['#009688', '#66BB6A'],
      ['#CDDC39', '#FFC107'],
      ['#795548', '#607D8B'],
    ],
  }),
  watch: {
    value(v) {
      if(!v) {
        this.isEventEdit = false
      }
    },
    selectedEvent(e) {
      if (e === {}) return
      this.editedEvent = {...e}
      const date = new Date(e.start)
      this.date = date.toISOString().substring(0, 10)
      this.time = date.toLocaleString().substring(12, 17)
      this.endTime = new Date(e.end).toLocaleString().substring(12, 17)
    }
  },
  methods: {
    ...mapActions([
      'GET_EVENTS',
      'UPDATE_EVENT',
      'DEL_EVENT'
    ]),
    editEvent() {
      this.isEventEdit = true
      // this.editedEvent = {...this.selectedEvent}
    },
    async updateEvent() {
      this.formHasErrors = false

      this.form.forEach(f => {
        if (!this.$refs[f]) this.formHasErrors = true

        if (!this.$refs[f].validate(true)) this.formHasErrors = true
      })
      if (this.formHasErrors) return

      this.editedEvent.start = new Date(`${this.date} ${this.time}`).getTime()
      this.editedEvent.end = new Date(`${this.date} ${this.endTime}`).getTime()
      const changes = {
        title: this.editedEvent.name,
        details: this.editedEvent.details,
        price: this.editedEvent.price,
        cost: this.editedEvent.cost,
        start: this.editedEvent.start,
        end: this.editedEvent.end,
        color: this.editedEvent.color
      }
      await this.UPDATE_EVENT({
        id: this.editedEvent.id,
        changes
      })
      await this.GET_EVENTS()
      this.isEventEdit = false
      // this.$emit('input', false)
    },
    requestDelEvent() {
      this.dialog = true
    },
    async delEvent(id) {
      if (!id) return
      await this.DEL_EVENT(id)
      await this.GET_EVENTS()

      setTimeout(() => {
        this.$emit('input', false)
      }, 10)
    },
    requestDidntCome() {
      this.dialogDidntCome = true
    },
    async didntCome(id) {
      if (!id) return
      await this.UPDATE_EVENT({
        id: id,
        changes: {
          services: '-1',
          price: 0,
          cost: 0
        }
      })
      await this.GET_EVENTS()
      this.$emit('input', false)
    },
    getDay(date) {
      const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      let i = new Date(date).getDay();
      return daysOfWeek[i];
    },
  },
};
</script>

<style lang="scss">
</style>
