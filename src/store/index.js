import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // isSignedIn: null,
    token: null,
    events: [],
    calendarLists: [],
    // {
    //   id: [],
    //   colorId: [],
    //   backgroundColor: [],
    // },
    calendarColors: {},
    eventColors: {},
    // calendarItems: [],
    // calendarEvent: [],
    // calendarEvent: [],
    // calendarEvent: {
    //   itemTitle: '',
    //   startDate: '',
    //   startTime: '',
    //   endDate: '',
    //   endTime: '',
    //   itemColor: ['blue', 'indigo', 'deep-purple'],
    // },
  },
  mutations: {
    setCalendarList(state, calendarListItems){
      calendarListItems.forEach(calendarListItem => {
        state.calendarLists.push(calendarListItem)
      });
      // console.log(state.calendarLists)
    },

    setColor(state, [calendarColors, eventColors]){
      
      state.calendarColors = Object.assign({},calendarColors)
      state.eventColors = Object.assign({},eventColors)
      // console.log(state.eventColors)
      // console.log(state.calendarColors)
    },
 
    setEvents(state,calendarEvents){
      calendarEvents.forEach(calendarEvent => {
        // console.log(calendarEvent)
        calendarEvent.name = calendarEvent.summary
        // console.log(calendarEvent.colorId);
        // console.log(state.calendarColors[calendarEvent.colorId]);
        calendarEvent.color = calendarEvent.colorId? state.calendarColors[calendarEvent.colorId]['background']:'blue'
        // calendarEvent.color = 'blue'
        // calendarEvent.start = moment(calendarEvent.start.dateTime).format('YYYY-MM-DD')+'T'+moment(calendarEvent.start.dateTime).format('HH:mm')
        calendarEvent.timed = function(){
          let timeString = calendarEvent.start
          if ( 'date' in timeString){
            return false
          }
          else{
            return true
          }
        }()
        calendarEvent.start = function(){
          let timeString = calendarEvent.start
          if ( 'date' in timeString){
            return calendarEvent.start.date
          }
          else{
            return moment(calendarEvent.start.dateTime).format('YYYY-MM-DD')+'T'+moment(calendarEvent.start.dateTime).format('HH:mm')
          }
        }()
        calendarEvent.end = function(){
          let timeString = calendarEvent.end
          if ( 'date' in timeString){
            return calendarEvent.end.date - 1
          }
          else{
            return moment(calendarEvent.end.dateTime).format('YYYY-MM-DD')+'T'+moment(calendarEvent.end.dateTime).format('HH:mm')
          }
        }()
        

        state.events.push(calendarEvent)
        
      });
      // // console.log(state.events)
    
    },
  actions: {    
    loadCalendarList(){
      let that = this;
      let googleCalendarApi = this._vm.$gapi.clientProvider.client
      // console.log(googleApi.gapi)
      googleCalendarApi.gapi.client.calendar.calendarList.list({
        'calendarId': 'primary',
      }).then(function(response) {
          console.log(response);
          let calendarListItems = response.result.items
          that.commit('setCalendarList',calendarListItems)
      });

      googleCalendarApi.gapi.client.calendar.colors.get({
      }).then(function(response){
        // console.log(response)
        // let calendarColors = response.result
        let calendarColor = response.result.calendar
        let eventColor = response.result.event
        that.commit('setColor', [calendarColor, eventColor])

        // console.log(response)
        
      })
    },

    loadEvent(){
      let that = this;
      let googleCalendarApi = this._vm.$gapi.clientProvider.client
      // console.log(googleCalendarApi)
      for (let i = 0; i < this.state.calendarLists.length; i++) {
       
        googleCalendarApi.gapi.client.calendar.events.list({
            'calendarId': this.state.calendarLists[i].id,
            // 'timeMin': (new Date()).toISOString(),
            'timeMax': (new Date(2024,1,1)).toISOString(),
            'timeMin': (new Date(2021,9,1)).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 20,
            'orderBy': 'startTime'
          }).then(function(response) {
            // console.log(response)
            let calendarEvents = response.result.items
            // // console.log(calendarEvents)          
            that.commit('setEvents',calendarEvents);
  
          });
        
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
