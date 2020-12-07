<template>
  <v-dialog
    class="statistic"
    v-model="value"
    @click:outside="$emit('input', false)"
  >
    <v-card class="pa-3">
      <v-btn-toggle
        v-model="mode"
        class="btn-filters mb-2"
      >
        <v-row class="ma-0">
          <v-col
            v-for="mod in modes"
            :key="mod.value"
            class="pa-0"
          >
            <v-btn
              :value="mod.value"
              small
              width="100%"
              class="px-3 priority"
              color="pink lighten-2"
              dark
            >
              <span class="font-weight-bold">{{ mod.title }}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-btn-toggle>

      <div class="d-flex justify-space-between px-3 text-caption">
        <span>Общий доход:</span>
        <span class="font-weight-bold">{{ totalPrice }} ₽</span>
      </div>
      <div class="d-flex justify-space-between px-3 text-caption">
        <span>Расходы:</span>
        <span class="font-weight-bold">{{ totalCost }} ₽</span>
      </div>
      <div class="d-flex justify-space-between px-3 text-caption">
        <span>Чистая прибыль:</span>
        <span class="font-weight-bold">{{ profit }} ₽</span>
      </div>

      <div class="mt-2 mb-1 px-3 text-subtitle-2">События ({{ events.length }}):</div>
      <v-simple-table
        fixed-header
        dense
        height="40vh"
        class="statistic-table"
      >
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-center px-0">
                <span class="text-uppercase">Дата</span>
              </th>
              <th class="text-center px-1">
                <span class="text-uppercase">Клиент</span>
              </th>
              <th class="text-center px-0">
                <span class="text-uppercase">Услуги</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ev in events"
              :key="ev.id"
            >
              <td class="text-center text-caption px-0">{{ new Date(ev.start) | date }}</td>
              <td class="text-center text-caption px-1">{{ ev.client }}</td>
              <td class="text-center text-caption px-0">
                <span v-if="ev.services === '-1'" class="red--text">
                  Не пришел
                </span>
                <span v-else>{{ ev.services }}</span>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: 'statistic',
  props: {
    value: {
      type: Boolean,
      default: () => flase
    }
  },
  data: () => ({
    mode: 1,
    modes: [
      {title: 'День', value: 1},
      {title: 'Месяц', value: 2},
      {title: 'Квартал', value: 3},
      {title: 'Год', value: 4}
    ],
    events: [],
    totalPrice: 0,
    totalCost: 0,
    profit: 0
  }),
  computed: {
    ...mapGetters([
      'CLIENTS',
      'SERVICES'
    ]),
  },
  watch: {
    async mode(v) {
      switch(v) {
        case 1:
          await this.getData(1)
          break
        case 2:
          await this.getData(30);
          break
        case 3:
          await this.getData(90);
          break
        case 4:
          await this.getData(365);
          break
        default:
          break
      }
    },
    async value(v) {
      if (!v) this.mode = 1
      this.events = []
      await this.getData(1)
    }
  },
  methods: {
    ...mapActions([
      'GET_EVENTS_BY_DATE',
    ]),
    async getData(days=1) {
      this.totalPrice = 0
      this.totalCost = 0
      this.profit = 0
      const data = await this.GET_EVENTS_BY_DATE(days)
      if (data.length === 0) return
      this.events = data.reverse()

      this.events.forEach(ev => {
        this.totalPrice += +ev.price
        this.totalCost += +ev.cost

        // set client
        const client = this.CLIENTS.find(cl => cl.id === ev.client)
        ev.client = `${client.name} ${client.lastName}`

        // set services
        let services = ''
        if (ev.services !== '-1') {
          ev.services.forEach(s => services += `${this.SERVICES.find(sv => sv.id === s).title}; `)
          ev.services = services
        }
      });
      this.profit = this.totalPrice - this.totalCost
    }
  },
};
</script>

<style lang="scss">
.btn-filters {
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  .v-btn {
    border-radius: 0;
    box-shadow: none;
  }
}
.statistic-table {
  .v-data-table__wrapper {
    border-radius: 5px;
  }
  thead th {
    box-shadow: none !important;
    background-color: #FCE4EC !important;
  }
  tbody tr:nth-child(2n) {
    background-color: #FCE4EC33 !important;
  }
  tbody td {
    border-bottom: none !important;
  }
}
</style>
