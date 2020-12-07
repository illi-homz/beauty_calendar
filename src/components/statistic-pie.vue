<template>
  <div class="statistic-pie">
    <v-dialog
      v-model="value"
      @click:outside="$emit('input', false)"
    >
      <v-sheet class="pb-3 pt-2">
        <h3 class="pb-2 text-center pink--text text--lighten-2">Статистика услуг</h3>
        <canvas ref="canvas"></canvas>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {Pie} from 'vue-chartjs'
import colorGenerator from '@/services/colorGenerator.js'

export default {
  name: 'statistic-pie',
  extends: Pie,
  props: {
    value: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    ...mapGetters([
      'EVENTS'
    ]),
  },
  data: () => ({
    events: []
  }),
  watch: {
    async value(v) {
      if (!v) return
      await this.initData()
      this.setup()
    }
  },
  methods: {
    ...mapActions([
      'GET_SERVICES'
    ]),
    async initData() {
      const events = await this.GET_SERVICES()
      this.events = events.map(e => {
        return {
          ...e,
          count: 0,
          color: colorGenerator()
        }
      })
      this.EVENTS.forEach(ev => {
        ev.services.forEach(s => {
          this.events.forEach(e => {
            if (e.id === s) e.count++
          })
        })
      });
    },
    setup() {
      const data = {
        labels: [],
        datasets: [{
          label: 'Hello',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }]
      }
      this.events.forEach(ev => {
        data.labels.push(ev.title)
        data.datasets[0].data.push(ev.count)
        data.datasets[0].backgroundColor.push(`${ev.color}33`)
        data.datasets[0].borderColor.push(`${ev.color}aa`)
      })
      const options = {
        legend: {
          position: 'bottom'
        }
      }
      this.renderChart(data, options)
    }
  },
  async mounted() {
  }
};
</script>

<style lang="scss" scoped>
</style>
