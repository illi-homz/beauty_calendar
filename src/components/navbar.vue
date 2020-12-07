<template>
  <div class="navbar bottom-toolbar">
    <v-toolbar
      dense
    >
      <v-btn icon @click="$emit('servicesList')">
        <v-icon>mdi-cash-multiple</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('clientList')">
        <v-icon>mdi-account-supervisor</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('addTask')">
        <v-icon>mdi-calendar-plus</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-menu
        :offset-y="offset"
        top
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            icon
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in menuItems"
            :key="i"
            @click="menuFunctions(item.id)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';

export default {
  name: 'navbar',
  data: () => ({
    menuItems: [
      { title: 'Статистика', id: 1 },
      { title: 'Статистика услуг', id: 2 },
    ],
    offset: true
  }),
  methods: {
    ...mapMutations([
      'CHANGE_IS_SIDEBAR'
    ]),
    openSidebar() {
      this.CHANGE_IS_SIDEBAR(true)
    },
    menuFunctions(id) {
      switch(id) {
        case 1:
          this.openStatistic();
          break
        case 2:
          this.clearHistory();
          break
        default: console.log('hell');
      }
    },
    openStatistic() {
      this.$emit('openStatistic')
    },
    clearHistory() {
      this.$emit('openStatisticPie')
    },
  },
};
</script>

<style lang="scss">
.bottom-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
