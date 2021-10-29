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
              <showRange/>
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
  import showRange from './showRange.vue'

  export default {
  components: { addEvent, showEvent, showRange },
    name: 'calendar',

    data: () => ({
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
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.$store.commit("setToday")
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


