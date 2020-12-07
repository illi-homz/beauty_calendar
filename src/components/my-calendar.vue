<template>
  <v-row
    class="d-flex ma-0"
  >
    <v-col class="pa-0 d-flex flex-column">
      <v-sheet
        class="top-toolbar"
        outlined
      >
        <v-toolbar
          flat
        >
          <v-menu
            bottom
            right
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span class="text-caption">{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list class="py-0">
              <v-list-item
                v-for="(title, key, i) of typeToLabel"
                :key="i"
                @click="changeType(key)"
              >
                <v-list-item class="text-body-2">{{title}}</v-list-item>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <v-toolbar-title class="text-body-1 text-capitalize" v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn
            fab
            text
            x-small
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            x-small
            color="grey darken-2"
            @click="next"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>

      <v-calendar
        class="flex-grow-1 flex-shrink-0 pt-14 pb-12"
        ref="calendar"
        v-model="focus"
        color="red accent-1"
        locale="ru"
        weekdays="1,2,3,4,5,6,0"
        :events="events"
        :type="type"
        :event-color="getEventColor"
        :event-ripple="false"
        @click:date="viewDay"
        @change="updateRange"
        @click:event="showEvent"
        @click:time="clickTime"
        v-touch="{
          left: () => next(),
          right: () => prev()
        }"
      ></v-calendar>

      <EventDialog
        v-model="isEventDialog"
        :selectedEvent="selectedEvent"
      />
    </v-col>
  </v-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import EventDialog from '../components/calendar/event-dialog'
export default {
  name: 'calendar',
  components: {
    EventDialog
  },
  data: () => ({
    isEventDialog: false,
    focus: '',
    events: [],
    selectedEvent: {},
    selectedElement: null,
    type: 'month',
    typeToLabel: {
      month: 'Месяц',
      week: 'Неделя',
      day: 'День',
      '4day': '4 Дня'
    },

    dragTime: null,
    dragEvent: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null
  }),
  computed: {
    ...mapGetters([
      'EVENTS'
    ])
  },
  watch: {
    async EVENTS(events) {
      this.events = events.map(e => {
        const event = {
          name: '',
          start: e.start,
          end: e.end,
          color: e.color,
          timed: true,
          details: e.details,
          client: e.client,
          created: e.createDate,
          id: e.id,
          services: e.services,
          tel: '',
          price: e.price,
          cost: e.cost
        }
        return event
      })
      this.events.forEach(async e => {
        let services = []
        if (e.services != '-1') {
          e.services.forEach(async s => {
            const service = await this.GET_SERVICE(s)
            services.push(service.title)
          })
          e.services = services
        }

        const client = await this.GET_CLIENT(e.client).then(c => c)
        e.name = `${client.name} ${client.lastName}`
        e.tel = client.tel
      });
    }
  },
  methods: {
    ...mapActions([
      'GET_EVENTS',
      'GET_CLIENT',
      'GET_SERVICE'
    ]),
    async showEvent({ nativeEvent, event }) {
      const open = async () => {
        this.selectedEvent = {...event}
        setTimeout(() => {
          this.isEventDialog = true
        }, 10)
      }

      open()
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    changeType(type) {
      this.type = type
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    async updateRange () {
      await this.GET_EVENTS()
    },
    getEventColor (event) {
      return event.services !== '-1' ? event.color : 'red'
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    clickTime(data) {
      setTimeout(() => {
        if (!this.isEventDialog) {
          this.$emit('clickTime', data)
        }
      }, 10)

    }
  },
  async mounted() {
  },
};
</script>

<style lang="scss">
.top-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.v-calendar {
  height: auto;
  border: 0px !important;
  .v-btn--round {
    height: 30px;
    width: 30px;
  }
  .v-event-timed-container {
    margin-right: 0;
  }
  .v-event {
    width: 90% !important;
    height: auto !important;
    padding: 2px 0;
    margin: 1px auto 0 auto !important;
    font-size: 10px;
    line-height: 10px;
    display: flex;
    align-items: center;
  }
  .v-calendar-weekly {
    &__head-weekday {
      padding-top: 4px;
    }
  }
}
</style>
