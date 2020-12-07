<template>
  <div class="event-add">
    <v-dialog v-model="value" persistent>
      <!-- @click:outside="closeDialog" -->
      <v-card ref="form" class="pa-4">
        <v-autocomplete
          ref="client"
          v-model="event.client"
          :items="clients"
          label="Клиент"
          :color="color"
          :rules="[(v) => !!v || 'Заплните это поле']"
          required
        ></v-autocomplete>

        <v-autocomplete
          ref="services"
          v-model="event.services"
          :items="services"
          class="pt-0"
          label="Услуги"
          item-color="pink accent-2"
          :color="color"
          :rules="[(v) => v.length !== 0 || 'Выберите услуги']"
          multiple
          required
        ></v-autocomplete>

        <v-textarea
          ref="details"
          v-model="event.details"
          label="Описание"
          rows="1"
          auto-grow
          no-resize
          :color="color"
        ></v-textarea>

        <v-row class="ma-0 d-flex align-center">
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
                  v-model="date"
                  label="Дата"
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
                :color="color"
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
                  :color="event.color"
                >
                </v-btn>
              </template>
              <v-color-picker
                v-model="event.color"
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
                  v-model="time"
                  label="Начало"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  :color="color"
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
                color="pink lighten-2"
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
                  v-model="endTime"
                  label="Конец"
                  prepend-icon="mdi-clock-time-four-outline"
                  readonly
                  :color="color"
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
                color="pink lighten-2"
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

        <v-subheader class="px-0"
          >Стоимость, ≈{{ event.price | currency }}</v-subheader
        >
        <v-slider
          ref="price"
          v-model="event.price"
          min="0"
          max="20000"
          step="100"
        ></v-slider>

        <v-row class="px-2">
          <v-btn text small color="orange" @click="cleanForm"> Сброс </v-btn>
          <v-spacer></v-spacer>
          <v-btn text small @click="closeDialog"> Отмена </v-btn>
          <v-btn color="green darken-1" text small @click="submit"> Ок </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import currencyFilter from "@/filters/currency.filter";

export default {
  name: "event-add",
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
    dateTime: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    dialog: true,
    date: "",
    time: "00:00",
    endTime: "00:00",
    event: {
      services: [],
      details: "",
      client: "",
      // date: '',
      start: null,
      end: null,
      price: 0,
      cost: 0,
      color: '#66BB6A'
    },
    clients: [],
    services: [],
    endTimes: [
      { text: "1 час", value: 1 },
      { text: "2 часа", value: 2 },
      { text: "3 часа", value: 3 },
      { text: "4 часа", value: 4 },
      { text: "5 часов", value: 5 },
      { text: "6 часов", value: 6 },
      { text: "7 часов", value: 7 },
      { text: "8 часов", value: 8 },
      { text: "9 часов", value: 9 },
    ],
    color: "pink lighten-4",
    menuDate: false,
    menuTime: false,
    menuEndTime: false,
    formHasErrors: false,
    menuColor: false,
    swatches: [
      ['#F44336', '#E91E63'],
      ['#9C27B0', '#2196F3'],
      ['#009688', '#66BB6A'],
      ['#CDDC39', '#FFC107'],
      ['#795548', '#607D8B'],
    ],
  }),
  computed: {
    ...mapGetters(["CLIENTS", "SERVICES"]),
    form() {
      return [
        "services",
        "details",
        "client",
        "date",
        "time",
        "endTime",
        "price",
      ];
    },
  },
  watch: {
    CLIENTS() {
      this.clients = this.CLIENTS.map((client) => {
        return {
          text: !client.lastName
            ? client.name
            : `${client.name} ${client.lastName}`,
          value: client.id,
          color: client.color,
        };
      });
    },
    SERVICES(services) {
      this.services = services.map((s) => {
        return {
          text: s.title,
          value: s.id,
        };
      });
    },
    dateTime(d) {
      this.date = d.date
      this.time = d.time
    }
  },
  methods: {
    ...mapActions([
      "GET_CLIENT",
      "GET_CLIENTS",
      "UPDATE_CLIENT",
      "ADD_EVENT",
      "GET_SERVICES",
    ]),
    async submit() {
      this.formHasErrors = false;

      this.form.forEach((f) => {
        if (!this.$refs[f]) this.formHasErrors = true;

        if (!this.$refs[f].validate(true)) this.formHasErrors = true;
      });

      if (this.formHasErrors) return;

      this.event.start = new Date(`${this.date} ${this.time}`).getTime();
      this.event.end = new Date(`${this.date} ${this.endTime}`).getTime();

      const eventId = await this.ADD_EVENT({
        ...this.event
      });
        // color: this.clients.find((c) => c.value === +this.event.client).color,

      this.closeDialog();
    },
    closeDialog() {
      this.cleanForm();
      this.$emit("input", false);
      this.time = "00:00";
      this.endTime = "00:00";
    },
    cleanForm() {
      this.form.forEach((f) => {
        this.$refs[f].reset();
      });
      this.time = "00:00";
      this.endTime = "00:00";
    },
    getDay(date) {
      const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      let i = new Date(date).getDay();
      return daysOfWeek[i];
    },
  },
  async mounted() {
    await this.GET_CLIENTS();
    await this.GET_SERVICES();
  },
};
</script>

<style lang="scss">
.event-add {
}
.v-picker {
  &__title {
    padding: 0;
  }
  .v-time-picker-title {
    &__time {
      margin: 0 auto;
    }
    &__time * {
      font-size: 50px !important;
    }
  }
}

.v-list {
  padding: 0;
}
</style>
