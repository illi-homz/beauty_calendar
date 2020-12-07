<template>
  <v-app class="home">
    <v-row class="d-flex flex-column ma-0 pa-0">
      <v-col class="pa-1 py-0 d-flex flex-grow-1 flex-shrink-0">
        <MyCalendar
          @clickTime="clickTime"
        />
      </v-col>
      <v-col class="pa-0 flex-grow-0 flex-shrink-1">
        <Navbar
          @clientList="isClientsList = true"
          @servicesList="isServicesList = true"
          @addTask="isAddTask = true"
          @openStatistic="isStatistic = true"
          @openStatisticPie="isStatisticPie = true"
        />
      </v-col>
    </v-row>
    <ServicesList
      v-model="isServicesList"
      @addSevice="isServiceAdd = true"
    />
    <ServicesAdd v-model="isServiceAdd"/>
    <ClientAdd v-model="isAddClient"/>
    <ClientsList
      v-model="isClientsList"
      @addClient="isAddClient = true"/>
    <EventAdd
      v-model="isAddTask"
      :dateTime="dateTime"
    />

    <Statistic v-model="isStatistic"/>
    <StatisticPie v-model="isStatisticPie"/>
  </v-app>
</template>

<script>
import Navbar from '@/components/navbar';
import MyCalendar from '@/components/my-calendar';
import EventAdd from '@/components/event-add';
import ClientAdd from '@/components/client-add';
import ClientsList from '@/components/cleints-list';
import ServicesList from '@/components/services-list';
import ServicesAdd from '@/components/service-add';
import Statistic from "@/components/statistic";
import StatisticPie from "@/components/statistic-pie";

export default {
  name: 'Home',
  components: {
    Navbar,
    MyCalendar,
    EventAdd,
    ClientAdd,
    ClientsList,
    ServicesList,
    ServicesAdd,
    Statistic,
    StatisticPie
  },
  data: () => ({
    isAddClient: false,
    isClientsList: false,
    isAddTask: false,
    isServicesList: false,
    isServiceAdd: false,
    isStatistic: false,
    isStatisticPie: false,
    dateTime: {}
  }),
  methods: {
    clickTime(data) {
      this.dateTime = data
      this.isAddTask = true
    }
  },
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: flex;
}
</style>
