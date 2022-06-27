<template>
  <v-menu :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn class="mx-2" color="primary" v-on="on">
        <v-icon dark>
          mdi-plus
        </v-icon>
        Create Event
      </v-btn>
    </template>
    <CreateEventDialog />
  </v-menu>
</template>

<script>
import CreateEventDialog from './CreateEventDialog.vue';
export default {
  name: 'CreateEvent',
  data: () => ({}),
  mounted() {},
  methods: {},
  computed: {
    calendarLists() {
      return this.$store.state.calendarLists;
    },
    eventColors() {
      return this.$store.state.eventColors;
    },
  },
  components: { CreateEventDialog },
};
</script>
<style lang="scss" scoped>
.inputtime-container {
  padding-bottom: 20px;
}
.daytime-input {
  width: 80%;
}
.input-subtitle {
  font-size: 18px;
  display: block;
}
</style>
