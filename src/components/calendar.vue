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
            <v-toolbar-title>
              {{year}} 年 {{ month }} 月
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
      
    }),
    mounted(){

    },

    methods: {
      setToday () {
        this.$store.commit("setToday")
      },
      prev () {
        this.$children[1].$refs.calendar.prev()
      },
      next () {
        this.$children[1].$refs.calendar.next()
      },     

    },
    computed: {
      year(){
        return this.$store.state.currentYear
      },
      month(){
        return this.$store.state.currentMonth
      }
    },
  
  }
</script>


