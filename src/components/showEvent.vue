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
      @change="logMonth"
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
          <v-checkbox
            v-model="calendarEvent.allDay"
            @change="logCalendarEvent"
            label="全天"
          ></v-checkbox> 
          <!-- {{ allDay }} -->
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
                  v-show="!(calendarEvent.allDay)"
                  v-on="on"
                  @click="editInputStart()"
                  >
                  開始時間
                  {{ calendarEvent.startTime }}
                  </v-btn>
              </template>
              <v-time-picker
                  format="ampm"
                  landscape
                  v-model="calendarEvent.startTime"
                  v-show="startTimeInput"
                  >
                  <v-btn
                  text
                  color="primary"
                  @click="cancelInputStart()"
                  >
                  Cancel
                  </v-btn>
                  <v-btn
                  text
                  color="primary"
                  @click="saveInputStart()"
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
                    v-on="on"
                    v-show="!(calendarEvent.allDay)"
                    @click="editInputEnd()"
                    >
                    結束時間
                    {{ calendarEvent.endTime}}
                    </v-btn>
                </template>
                <v-time-picker
                    format="ampm"
                    landscape
                    v-model="calendarEvent.endTime"
                    v-show="endTimeInput"
                >
                    <v-btn
                    text
                    color="primary"
                    @click="cancelInputEnd()"
                    >
                    Cancel
                    </v-btn>
                    <v-btn
                    text
                    color="primary"
                    @click="saveInputEnd()"
                    >
                    OK
                    </v-btn>
                </v-time-picker>
                </v-menu>
            <v-radio-group              
              v-model="calendarEvent.colorId"
              row
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
            <div>
              開始日期  {{ moment(selectedEvent.start).format('YYYY-MM-DD') }}
            </div>
            <div v-show="!(selectedEvent.allDay)">
              開始時間  {{ moment(selectedEvent.start).format('LT') }}
            </div>
            <div>
              結束日期  {{ moment(selectedEvent.end).format('YYYY-MM-DD') }}
            </div>
            <div v-show="!(selectedEvent.allDay)">
              結束時間  {{ moment(selectedEvent.end).format('LT') }}
            </div>
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
      // display select event
      selectedEvent: {
        start: null,
        end: null,
        allDay: null,
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
        allDay: null,
        itemColor: '',
        colorId: '',
      },
      
      index: '',
      editIndex: '',
      startTimeInput: false,
      endTimeInput: false,
      currentInput: "",
    }),

    mounted () {
      this.$refs.calendar.checkChange();
      // console.log(this.events);
    },

    methods: {
      logCalendarEvent(){
        this.calendarEvent = Object.assign({},this.calendarEvent);
      },
      viewDay ({ date }) {
        this.$store.commit("viewDate", date)
        this.$store.state.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      showEvent ({ nativeEvent, event, eventParsed }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          this.selectedEvent.allDay = eventParsed.allDay
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
          this.index = eventParsed.index; 
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }
        console.log(event)
        console.log(this.selectedEvent)
        nativeEvent.stopPropagation()
      },

      updateItem(){
        this.editIndex = this.index;
        console.log(this.selectedEvent);
        this.calendarEvent = this.selectedEvent
        this.calendarEvent.allDay = this.selectedEvent.allDay;
        this.calendarEvent.itemTitle = this.selectedEvent.name;
        this.calendarEvent.startDate = moment(this.selectedEvent.start).format('YYYY-MM-DD');
        this.calendarEvent.startTime = moment(this.selectedEvent.start).format('HH:mm');
        this.calendarEvent.endDate =  moment(this.selectedEvent.end).format('YYYY-MM-DD');
        this.calendarEvent.endTime = moment(this.selectedEvent.end).format('HH:mm');
        this.calendarEvent.colorId = this.selectedEvent.colorId;
        // this.calendarEvent.itemColor = this.selectedEvent.color;

      },
      saveUpdate(){
        this.$store.dispatch("saveEvent", [this.index,this.calendarEvent])

        // this.selectedOpen = false; 
        // this.calendarEvent.itemTitle = '';
        // this.calendarEvent.startDate = '';
        // this.calendarEvent.startTime = '';
        // this.calendarEvent.endDate = '';
        // this.calendarEvent.endTime = '';
        // this.calendarEvent.itemColor = '';
        // this.editIndex = '';        
        // console.log("save update")
      },
      cancelUpdate(){
        this.selectedOpen = false; 
        this.calendarEvent.itemTitle = '';
        this.calendarEvent.startDate = '';
        this.calendarEvent.startTime = '';
        this.calendarEvent.endDate = '';
        this.calendarEvent.endTime = '';
        this.calendarEvent.itemColor = '';
        this.editIndex = '';
        console.log("cancel update")
      },

      editInputStart(){
        this.startTimeInput = true;
        this.currentInput = this.calendarEvent.startTime
      },
      editInputEnd(){
          this.endTimeInput = true;
          this.currentInput = this.calendarEvent.endTime
      },
      cancelInputStart(){
          this.calendarEvent.startTime = this.currentInput;
          this.startTimeInput = false;
      },
      cancelInputEnd(){
          this.calendarEvent.endTime = this.currentInput;
          this.endTimeInput = false;
      },
      saveInputStart(){
          this.startTimeInput = false;
      },
      saveInputEnd(){
          this.endTimeInput = false;
      },

      
      deleteItem(){        
        this.$store.dispatch("deleteEvent",this.selectedEvent)
        this.events.splice(this.index,1);
        this.selectedOpen = false;        
      },

      logMonth({start}){
        this.$store.commit("displayMonth",[start.year, start.month])
      },

    },
    computed: {
      type(){
        return this.$store.state.type
      },
      focus:{
        get: function(){
          return this.$store.state.focus
        },
        set: function(date){
          this.$store.state.focus = date
        },
      },
      eventColors(){
        return this.$store.state.eventColors
      },
      events(){
        return this.$store.state.events
      },
    },
  
  }
</script>


