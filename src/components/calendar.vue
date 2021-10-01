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
            <v-menu
            v-model="addItemOpen"
            :close-on-content-click="false"
            offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mx-2"
                  depressed
                  fab
                  normal
                  tabindex="-1"
                  color="blue"
                  v-on="on"
                  >
                  <v-icon dark>
                      mdi-plus
                  </v-icon>
                </v-btn>
              </template>
              <v-card
                color="grey lighten-4"
                min-width="350px"
                flat
              >
                <v-card-title
                  class="addItemCard">新增活動
                </v-card-title>
                <v-card-text>
                  <input v-model="itemTitle" type="text" placeholder="活動標題">
                  開始時間<input v-model="startDate" type="date" name="" id="">
                  <input v-model="startTime" type="time" name="" id="">
                  結束時間<input v-model="endDate" type="date" name="" id="">
                  <input v-model="endTime" type="time" name="" id="">
                  <v-radio-group              
                    v-model="itemColor"
                  >活動顏色
                    <v-radio
                      label="紅色"
                      color="red"
                      value="red"
                    ></v-radio>
                    <v-radio
                      label="粉紅色"
                      color="pink"
                      value="pink"
                    ></v-radio>
                    <v-radio
                      label="紫色"
                      color="purple"
                      value="purple"
                    ></v-radio>
                    <v-radio
                      label="靛藍色"
                      color="indigo"
                      value="indigo"
                    ></v-radio>
                    <v-radio
                      label="青色"
                      color="cyan"
                      value="cyan"
                    ></v-radio>
                    <v-radio
                      label="綠色"
                      color="green"
                      value="green"
                    ></v-radio>
                  </v-radio-group>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    depressed
                    color="primary"
                    @click="addItem()"
                  >
                    SAVE
                  </v-btn>
                </v-card-actions>
              </v-card>  
            </v-menu>

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
        <v-sheet height="600">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getEventColor"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <v-card
              color="grey lighten-4"
              min-width="350px"
              flat
            >
              <v-toolbar
                :color="selectedEvent.color"
                dark
              >
                <v-btn 
                  icon
                  @click="editTitle()">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <!-- <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title> -->
                <v-toolbar-title>
                  <input type="text" v-model="calendarEvent.eventTitle">
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn 
                icon
                @click="deleteItem()">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn 
                icon
                @click="popFunctionList()">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <span v-html="selectedEvent.details"></span>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  text
                  color="secondary"
                  @click="selectedOpen = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
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
      addItemOpen: false,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      itemTitle: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      itemColor: '',
      events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      calendarEvent: {
        eventTitle: 'event title',
        eventColor: ['blue', 'indigo', 'deep-purple'],
      },
      index: '',
    }),
    mounted () {
      this.$refs.calendar.checkChange();
      console.log(this.events);
    },
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
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event, eventParsed }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
          this.index = eventParsed.index; 
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      addItem(){
        console.log('additem');
        this.events.push({
            name: this.itemTitle,
            start: this.startDate + 'T' + this.startTime,
            end: this.endDate + 'T' + this.endTime,
            color: this.itemColor,
            timed: true,
          })
          this.itemTitle = '';
          this.startDate = '';
          this.startTime = '';
          this.endDate = '';
          this.endTime = '';
          this.itemColor = '';
        this.addItemOpen = false;
      },

      deleteItem(){
        this.events.splice(this.index,1);
        this.selectedOpen = false;
      },
      editTitle(){
        console.log('editTitle');
      },

      popFunctionList(){
        console.log('popFunnctionList');
      },
      updateRange ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events
        console.log(this.events);
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    },
  
  }
</script>


