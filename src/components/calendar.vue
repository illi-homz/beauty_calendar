<template>
  <div class="calendar">
    <h1>Calendar</h1>
    <v-sheet
      tile
      height="54"
      class="d-flex"
    >
      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn
        icon
        class="ma-2"
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="тип"
      ></v-select>
    </v-sheet>

    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        locale="ru"
        v-model="focus"
        :type="type"
        :weekdays="weekday"
        :now="today"

        :events="events"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="getEvents"

        @click:day="clickDay"
        @click:event="clickEvent"
      ></v-calendar>

      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          min-width="250px"
          flat
        >
          <v-toolbar
            :color="selectedEvent.color"
            dark
          >
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn> -->
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <span v-html="selectedEvent.details"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              Отмена
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import {db} from '@/main';
// import firebase from 'firebase/app';

export default {
  name: 'calendar',
  data: () => ({
    type: 'month',
    types: [
      {text: 'Месяц', value: 'month'},
      {text: 'Неделя', value: 'week'},
      {text: 'День', value: 'day'},
      {text: '4 дня', value: '4day'},
    ],
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),

    name: null,
    details: null,
    start: null,
    end: null,
    color: '#1976D2',
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false,

    events: [],
    tests: [],
    weekday: [1, 2, 3, 4, 5, 6, 0],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
  }),
  computed: {
  },
  methods: {
    async getEvents ({ start, end }) {
      let snapshot = await db.collection('calEvent').get()
      // console.log('getEvents -> snapshot', snapshot)
      snapshot.forEach(doc => {
        this.events.push(doc.data())
      //   console.log(doc.id, doc.data())
        // this.tests.push(doc)
      })
    },
    getEventColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },

    clickDay({date}) {
      this.focus = date
      this.type = 'day'
    },
    clickEvent({nativeEvent, event}) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
h1 {
  text-align: center;
}
</style>
