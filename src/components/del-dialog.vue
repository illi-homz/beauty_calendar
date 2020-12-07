<template>
  <v-dialog
    v-model="value"
    persistent
    max-width="290"
    @click:outside="dialog = false"
  >
    <v-card>
      <v-card-title class="pb-1">
        <p class="ma-0">{{name}}</p>
      </v-card-title>
      <v-card-text>
        <p class="mb-0"><slot>Удалить?</slot></p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="delEvent(false)"
        >
          Отмена
        </v-btn>
        <v-btn
          color="red darken-1"
          text
          @click="delEvent(id)"
        >
          Да
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-dialog>
</template>

<script>
export default {
  name: 'del-dialog',
  props: {
    value: {
      type: Boolean,
      default: () => false
    },
    name: {
      type: String,
      default: () => ''
    },
    id: {
      type: Number,
      default: () => 0
    },
  },
  data: () => ({
  }),
  methods: {
    delEvent(id) {
      this.$emit('delEvent', id)
      this.$emit('input', false)
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
