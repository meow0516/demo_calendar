import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment';



Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    events: [],
    focus: '',
    calendarLists: [],
    calendarColors: {},
    eventColors: {},
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days',       
    },
    currentYear: '',
    currentMonth: '',
  },

  mutations: {
    setCalendarList(state, calendarListItems){
      calendarListItems.forEach(calendarListItem => {
        state.calendarLists.push(calendarListItem)
        // console.log(state.calendarLists)
      });
      
    },

    setColor(state, [calendarColors, eventColors]){
      state.calendarColors = Object.assign({},calendarColors)
      state.eventColors = Object.assign({},eventColors)
    },
 
    setEvents(state, [calendarEvents, calendarId, calendarColorId]){
      calendarEvents.forEach(calendarEvent => {
        // console.log(calendarEvent)
        calendarEvent.calendarId = calendarId
        calendarEvent.name = calendarEvent.summary
        calendarEvent.calendarColorId = calendarColorId
        calendarEvent.color = calendarEvent.colorId? state.eventColors[calendarEvent.colorId]['background']:state.calendarColors[calendarEvent.calendarColorId]['background']
        calendarEvent.timed = function(){
          let timeString = calendarEvent.start
          // specific-time event: timed = true
          if ( 'dateTime' in timeString){
            return true
          }
          // all-day event: timed = false
          else{
            return false
          }
        }()
        calendarEvent.start = function(){
          let timeString = calendarEvent.start
          if ( 'dateTime' in timeString){
            return moment(calendarEvent.start.dateTime).format('YYYY-MM-DD')+'T'+moment(calendarEvent.start.dateTime).format('HH:mm')
          }
          else{
            return calendarEvent.start.date
          }
        }()
        calendarEvent.end = function(){
          let timeString = calendarEvent.end
          if ( 'dateTime' in timeString){
            return moment(calendarEvent.end.dateTime).format('YYYY-MM-DD')+'T'+moment(calendarEvent.end.dateTime).format('HH:mm')
          }
          else{
            let dt = new Date(calendarEvent.end.date)
            return (
              dt.setDate(dt.getDate()-1)
            )
          }
        }()
        

        state.events.push(calendarEvent)
      });
      // console.log(state.events)
    
    },

    addEvent(state, [calendarItem, calendarId, id]){
      let index = calendarItem.calendarIndex
      let calendar = state.calendarLists[index]
      let calendarColorId = calendar['colorId']
      state.events.push(
       {
            name: calendarItem.itemTitle,
            start: function(){
              if( calendarItem.allDay ){
                return calendarItem.startDate
              }
              else{
                return calendarItem.startDate +"T"+ calendarItem.startTime
              }
            }(),
            end: function(){
              if( calendarItem.allDay ){
                return calendarItem.endDate
              }
              else{
                return calendarItem.endDate +"T"+ calendarItem.endTime
              }
            }(),
            color: function(){
              if( !calendarItem.itemColorId ){
                return  state.calendarColors[calendarColorId]['background']
                // that.state.calendarLists[calendarItem.calendarIndex]['colorId']
              }
              else{
                return state.eventColors[calendarItem.itemColorId]['background']
              }
            }(),
           
            timed: calendarItem.allDay,
            calendarId: calendarId,
            id: id,
          }
      )
      console.log(state.events)
    },

    changeRange(state, type){
      state.type = type;
    },
    setToday(state) {    
      state.focus = ''
    },
    viewDate(state, date){
      state.focus = date
    },

    saveEvent(state, [index, calendarItem]){
      state.events[index].name = calendarItem.itemTitle
      state.events[index].start = function(){
        if(calendarItem.allDay){
          return calendarItem.startDate
        }
        else{
          return calendarItem.startDate + "T" + calendarItem.startTime
        }
        }();
      state.events[index].end = function(){
        if(calendarItem.allDay){
          return calendarItem.endDate
        }
        else{
          return calendarItem.endDate + "T" + calendarItem.endTime;
        }
        }();
      state.events[index].color = calendarItem.colorId? state.eventColors[calendarItem.colorId].background: state.events[index].color;
      
    },
    deleteEvent(state,index){
      state.events.splice(index,1);
    },
    clearEvents(state){
      state.events = [];
      state.calendarLists = [];
      state.calendarColors = {};
      state.eventColors = {};
    },
    displayMonth(state,[year, month]){
      state.currentYear = year;
      state.currentMonth = month;
    }
  },
  actions: {    
    loadCalendarList(){
      return new Promise((resolve)=>{
        let that = this;
        let googleCalendarApi = this._vm.$gapi.clientProvider.client
  
        let promiseCalendarList = new Promise ((resolve)=>{        
            googleCalendarApi.gapi.client.calendar.calendarList.list({
              'calendarId': 'primary',
            })
            .then(function(response) {
                let calendarListItems = response.result.items
                that.commit('setCalendarList',calendarListItems)
                resolve ()
            });
        }
        );
  
        let promiseEvent = new Promise((resolve)=>{
          googleCalendarApi.gapi.client.calendar.colors.get({
          }).then(function(response){
            let calendarColor = response.result.calendar
            let eventColor = response.result.event
            that.commit('setColor', [calendarColor, eventColor])
            resolve ()
          });
        });
  
        Promise.all([promiseCalendarList,promiseEvent]).then(()=> {
          resolve()
        })

      })
    },

    loadEvent(){
      let that = this;
      let googleCalendarApi = this._vm.$gapi.clientProvider.client
      // console.log(googleCalendarApi)
      for (let i = 0; i < this.state.calendarLists.length; i++) {
       
        googleCalendarApi.gapi.client.calendar.events.list({
            'calendarId': this.state.calendarLists[i].id,
            'timeMax': (new Date(2024,1,1)).toISOString(),
            'timeMin': (new Date(2021,9,1)).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 20,
            'orderBy': 'startTime'
          }).then(function(response) {
            // console.log(response)
            let calendarEvents = response.result.items
            let calendarId = that.state.calendarLists[i].id
            let calendarColorId = that.state.calendarLists[i].colorId
            // console.log(calendarEvents)          
            that.commit('setEvents',[calendarEvents, calendarId, calendarColorId]);  
          });
        
      }
    },

    addEvent({commit},calendarItem){
      let that = this;      
      let googleCalendarApi = this._vm.$gapi.clientProvider.client

      googleCalendarApi.gapi.client.calendar.events.insert({
        "calendarId": that.state.calendarLists[calendarItem.calendarIndex]['id'],
        "resource": {
          "summary": calendarItem.itemTitle,
          "start": function(){
              if ( calendarItem.allDay){                
                return { 
                  "date": calendarItem.startDate
                }
              }
              else
              {
                return {
                  "dateTime": new Date(calendarItem.startDate +" "+ calendarItem.startTime).toISOString()
                }
              } 
            }(),
          "end": function(){
              if ( calendarItem.allDay){
                return { 
                  "date": moment(calendarItem.endDate).add(1,'days').format('YYYY-MM-DD')                  
                }
              }
              else
              {
                return {
                  "dateTime": new Date(calendarItem.endDate +" "+ calendarItem.endTime).toISOString()
                }
              } 
            }(),
          "colorId": 
          function(){
            if (calendarItem.itemColorId){
              return calendarItem.itemColorId
            }
            // if( !calendarItem.itemColorId ){
            //   // return that.state.calendarLists[calendarItem.calendarIndex]['colorId']
            //   return ''
            // }
            // else{
            //   return calendarItem.itemColorId
            // }
          }(),
        }
      })
      
      .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        // console.log("Response", response)
        let calendarId = that.state.calendarLists[calendarItem.calendarIndex]['id']
        let id = response.result.id
        commit('addEvent',[calendarItem, calendarId, id])
      },
      function(err) { console.error("Execute error", err); });
      
    },

    saveEvent({commit},[index,calendarItem]){
      let googleCalendarApi = this._vm.$gapi.clientProvider.client
      googleCalendarApi.gapi.client.calendar.events.update({
        "calendarId": calendarItem.calendarId,
        "eventId": calendarItem.id,
        "resource": {
          "summary": calendarItem.itemTitle,
          "start": function(){
              if ( calendarItem.allDay){
                return { 
                  "date": calendarItem.startDate
                }
              }
              else
              {
                return {
                  "dateTime": new Date(calendarItem.startDate +" "+ calendarItem.startTime).toISOString()
                }
              } 
            }(),
          "end": function(){
              if ( calendarItem.allDay){
                return { 
                  "date": moment(calendarItem.endDate).add(1,'days').format('YYYY-MM-DD')
                }
              }
              else
              {
                return {
                  "dateTime": new Date(calendarItem.endDate +" "+ calendarItem.endTime).toISOString()
                }
              } 
            }(),
          "colorId": function(){
            if(calendarItem.colorId){
              return calendarItem.colorId
            }
            else{
              return calendarItem.colorId
            }
          }(),
        }
      })
      .then(function() {
        commit('saveEvent',[index,calendarItem])
      },
      function(err) { console.error("Execute error", err); });

      // console.log(calendarItem)
      
    },

    deleteEvent({commit},[calendarItem,index]){
      let googleCalendarApi = this._vm.$gapi.clientProvider.client
      googleCalendarApi.gapi.client.calendar.events.delete({
        "calendarId": calendarItem.calendarId,
        "eventId": calendarItem.id,
      }).then(function() {
        // Handle the results here (response.result has the parsed body).
        // console.log("Response", response);
        commit('deleteEvent',index)
      },
      function(err) { console.error("Execute error", err); });
    },
  },
  getters: {

  },
  modules: {
  }
})
