<template>

  <div class="container"> 
    <v-row class="fill-height">
      <v-col>
        <v-sheet height="64">
          <v-toolbar
            flat
          >
          <!-- set to today -->
            <v-btn
              outlined
              class="mr-4"
              color="grey darken-2"
              @click="setToday"
            >
              Today
            </v-btn>
            <!-- btn prev -->
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="prev"
            >
              <v-icon small>
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <!-- btn next -->
            <v-btn
              fab
              text
              small
              color="grey darken-2"
              @click="next"
            >
              <v-icon small>
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- menu: add item-->
            <addEvent/>
            <!-- change show range -->
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
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>
                    mdi-menu-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="type = 'day'">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'week'">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = 'month'">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
                <v-list-item @click="type = '4day'">
                  <v-list-item-title>4 days</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
          <!-- open selected event -->
          <showEvent/>
        <!-- </v-sheet> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
  // import moment from 'moment';
  import addEvent from './addEvent.vue'
  import showEvent from './showEvent.vue'

  export default {
  components: { addEvent, showEvent },
    name: 'calendar',

    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      // // display select event
      // selectedEvent: {
      //   start: null,
      //   end: null
      // },
      // selectedElement: null,
      // selectedOpen: false,


      // // edit event
      // calendarEvent: {
      //   itemTitle: '',
      //   startDate: '',
      //   startTime: '',
      //   endDate: '',
      //   endTime: '',
      //   itemColor: ['blue', 'indigo', 'deep-purple'],
      // },
      // // events: [],
      // colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      // names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      // index: '',
      // editIndex: '',
      // timeInput: false,
    }),

    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$children[1].$refs.calendar.prev()
      },
      next () {
        this.$children[1].$refs.calendar.next()
      },

      popFunctionList(){
        console.log('popFunnctionList');
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
    computed: {
      events(){
        return this.$store.state.events
      },
    },
  
  }
</script>


