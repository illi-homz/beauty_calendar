<template>
  <div class="cleinats-list">
    <v-dialog
      v-if="!isClientDetail"
      v-model="value"
      max-width="80%"
      @click:outside="$emit('input', false)"
    >
      <v-sheet class="pa-2">
        <v-row class="ma-0 mb-2 d-flex align-center">
          <v-col cols="9" class="pa-0">
            <v-text-field
              v-if="CLIENTS.length > 0"
              v-model="clientFilter"
              color="green"
              outlined
              dense
              hide-details
              autofocus
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col class="pa-0 text-right">
            <v-btn
              outlined
              height="40"
              color="green"
              @click="$emit('addClient')"
            >
              <v-icon class="mr-2">mdi-account-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div class="clients-list">
          <v-card
            class="pa-2 mb-1"
            style="cursor: pointer"
            outlined
            v-for="(client, i) in clients"
            :key="client.id"
            @click="openClientData(client)"
          >
            <div class="d-flex align-center">
              <h4>
                {{i+1}}. {{client.name}} {{client.lastName}}
              </h4>
            </div>
          </v-card>
        </div>
      </v-sheet>
    </v-dialog>

    <ClientDetail
      v-model="isClientDetail"
    />
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import ClientDetail from '../components/client-detail'

export default {
  name: 'cleinats-list',
  components: {
    ClientDetail
  },
  props: {
    value: {
      type: Boolean,
      default: () => false,
    }
  },
  computed: {
    ...mapGetters([
      'CLIENTS'
    ]),
    clients() {
      return this.CLIENTS.filter(cl => {
        if (cl.lastName) {
          return cl.name.toLowerCase().includes(this.clientFilter.toLowerCase())
            || cl.lastName.toLowerCase().includes(this.clientFilter.toLowerCase())
            || cl.tel.replace('+7', '8').replace(/\D/g, '').includes(this.clientFilter)
        }
        return cl.name.toLowerCase().includes(this.clientFilter)
          || cl.tel.replace('+7', '8').replace(/\D/g, '').includes(this.clientFilter)
      })
    }
  },
  data: () => ({
    isClientDetail: false,
    clientFilter: '',
  }),
  methods: {
    ...mapActions([
      'GET_CLIENTS',
    ]),
    ...mapMutations([
      'SET_CURRENT_CLIENT'
    ]),
    openClientData(client) {
      this.isClientDetail = true
      this.SET_CURRENT_CLIENT({})
      this.SET_CURRENT_CLIENT(client)
    },
  },
  async mounted() {
    await this.GET_CLIENTS()
  },
};
</script>

<style lang="scss">
.clients-list {
  max-height: 50vh;
  overflow: scroll;
}
</style>
