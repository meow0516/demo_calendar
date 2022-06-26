<template>
  <!-- show range -->
  <v-menu bottom right>
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
        <!-- <span>{{ typeToLabel[type] }}</span> -->
        <span>{{ typeToLabel }}</span>
        <v-icon right>
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="changeRangeDay()">
        <v-list-item-title>Day</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRangeWeek()">
        <v-list-item-title>Week</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRangeMonth()">
        <v-list-item-title>Month</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRange4Day()">
        <v-list-item-title>4 days</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'CalendarRange',

  data: () => ({}),
  mounted() {},
  methods: {
    changeRangeDay() {
      this.type = 'day';
      this.$store.commit('changeRange', this.type);
    },
    changeRangeWeek() {
      this.type = 'week';
      this.$store.commit('changeRange', this.type);
    },
    changeRangeMonth() {
      this.type = 'month';
      this.$store.commit('changeRange', this.type);
    },
    changeRange4Day() {
      this.type = '4day';
      this.$store.commit('changeRange', this.type);
    },
  },

  computed: {
    typeToLabel() {
      return this.$store.state.typeToLabel[this.$store.state.type];
    },
  },
};
</script>
