<template>
  <v-menu bottom right>
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
        <span>{{ typeToLabel }}</span>
        <v-icon right>
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="changeRange('day')">
        <v-list-item-title>Day</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRange('week')">
        <v-list-item-title>Week</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRange('month')">
        <v-list-item-title>Month</v-list-item-title>
      </v-list-item>
      <v-list-item @click="changeRange('4day')">
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
    changeRange(rangeType) {
      this.type = rangeType;
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
