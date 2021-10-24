<template>
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
    ></v-calendar>
<!-- open selected event -->
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
            @click="updateItem()">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-toolbar-title 
            v-if="index === editIndex">
            <input 
              type="text" 
              v-model="calendarEvent.itemTitle">
          </v-toolbar-title>              
          <v-toolbar-title 
            v-else v-html="selectedEvent.name">
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- delete item -->
          <v-btn 
          icon
          @click="deleteItem()">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- card at edit mode -->
        <v-card-text  v-if="index === editIndex">
          <!-- start date-->
            <v-menu
              offset-y>
              <template v-slot:activator="{on}">
                <v-btn 
                depressed
                v-on="on">
                開始日期
                {{ calendarEvent.startDate}}
                </v-btn>
              </template>
                <v-row 
                  justify="center">
                  <v-date-picker 
                    show-week
                    show-adjacent-months
                    picker-date
                    v-model="calendarEvent.startDate">
                  </v-date-picker>
                </v-row>
            </v-menu>
            <!-- start time -->
            <v-menu                
              :close-on-content-click="false"
              offset-y>
              <template v-slot:activator="{on}">
                  <v-btn 
                  depressed                    
                  v-on="on"
                  v-show="!calendarItem.allDay"
                  @click="timeInput=true">
                  開始時間
                  {{ calendarEvent.startTime }}
                  </v-btn>
              </template>
              <v-time-picker
                  format="ampm"
                  landscape
                  v-model="calendarEvent.startTime"
                  v-if="timeInput">
                  <v-btn
                  text
                  color="primary"
                  @click="cancelInputTime()"
                  >
                  Cancel
                  </v-btn>
                  <v-btn
                  text
                  color="primary"
                  @click="saveInputTime()"
                  >
                  OK
                  </v-btn>
                </v-time-picker>
              </v-menu>
            <!-- end date -->
               <v-menu
                offset-y>
                <template v-slot:activator="{on}">
                  <v-btn 
                  depressed
                  v-on="on">
                  結束日期
                  {{ calendarEvent.endDate}}
                  </v-btn>
                </template>
                  <v-row justify="center">
                  <v-date-picker 
                  picker-date
                  v-model="calendarEvent.endDate"></v-date-picker>
                  </v-row>
                </v-menu>
            <!-- end time -->
                <v-menu
                :close-on-content-click="false"
                offset-y>
                <template v-slot:activator="{on}">
                    <v-btn 
                    depressed
                    v-show="!calendarItem.allDay"
                    v-on="on"
                    @click="timeInput=true">
                    結束時間
                    {{ calendarEvent.endTime}}
                    </v-btn>
                </template>
                <v-time-picker
                    format="ampm"
                    landscape
                    v-model="calendarEvent.endTime"
                    v-if="timeInput"
                >
                    <v-btn
                    text
                    color="primary"
                    @click="cancelInputTime()"
                    >
                    Cancel
                    </v-btn>
                    <v-btn
                    text
                    color="primary"
                    @click="saveInputTime()"
                    >
                    OK
                    </v-btn>
                </v-time-picker>
                </v-menu>
            <!-- <input v-model="calendarEvent.startDate" type="date" name="" id="">
            <input v-model="calendarEvent.startTime" type="time" name="" id="">
            結束時間<input v-model="calendarEvent.endDate" type="date" name="" id="">
            <input v-model="calendarEvent.endTime" type="time" name="" id=""> -->
            <v-radio-group              
              v-model="calendarEvent.itemColor"
            >活動顏色
              <v-radio 
                v-for="(eventColor,index) in eventColors"
                :key="eventColor.index"
                :label="index"
                :color="eventColor.background"
                :value="index">
              </v-radio>
              <!-- <v-radio
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
              ></v-radio> -->
            </v-radio-group>
          </v-card-text>
          <!-- card at view mode -->
          <v-card-text v-else>
            開始日期  {{ moment(selectedEvent.start).format('YYYY-MM-DD') }}
            開始時間  {{ moment(selectedEvent.start).format('LT') }}
            結束日期  {{ moment(selectedEvent.end).format('YYYY-MM-DD') }}
            結束時間  {{ moment(selectedEvent.end).format('LT') }}
          </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="primary"
            @click="saveUpdate()"
          >
            Save
          </v-btn>
          <v-btn
            text
            color="secondary"
            @click="cancelUpdate()"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-sheet>
</template>

<script>
  import moment from 'moment';

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
      // display select event
      selectedEvent: {
        start: null,
        end: null
      },
      selectedElement: null,
      selectedOpen: false,


      // edit event
      calendarEvent: {
        itemTitle: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        itemColor: ['blue', 'indigo', 'deep-purple'],
      },
      // events: [],
      colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
      names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
      index: '',
      editIndex: '',
      timeInput: false,
    }),
     mounted () {
      this.$refs.calendar.checkChange();
      // console.log(this.events);
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
      
      deleteItem(){
        this.events.splice(this.index,1);
        this.selectedOpen = false;
      },
      updateItem(){
        this.editIndex = this.index;
        console.log(this.selectedEvent);
        this.calendarEvent.itemTitle = this.selectedEvent.name;
        this.calendarEvent.startDate = moment(this.selectedEvent.start).format('YYYY-MM-DD');
        this.calendarEvent.startTime = moment(this.selectedEvent.start).format('hh:mm');
        this.calendarEvent.endDate =  moment(this.selectedEvent.end).format('YYYY-MM-DD');
        this.calendarEvent.endTime = moment(this.selectedEvent.end).format('hh:mm');
        this.calendarEvent.itemColor = this.selectedEvent.color;

      },
      saveUpdate(){
        this.events[this.index]['name'] = this.calendarEvent.itemTitle;
        this.events[this.index]['color'] = this.calendarEvent.itemColor;
        this.selectedOpen = false; 
        this.calendarEvent.itemColor = '';
        this.editIndex = '';        

      },
      cancelUpdate(){
        this.selectedOpen = false; 
        this.editIndex = '';
        this.calendarEvent.itemTitle = '';
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


