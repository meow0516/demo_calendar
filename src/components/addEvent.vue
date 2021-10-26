<template>
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
            <!-- add item input -->
            <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
            >
            <v-card-title>
                新增活動
            </v-card-title>
            <v-card-text>
                <!-- title -->
                <v-text-field
                 v-model="calendarItem.itemTitle" 
                 type="text" 
                 placeholder="活動標題"
                ></v-text-field>
                <v-checkbox
                    v-model="calendarItem.allDay"
                    label="全天"
                ></v-checkbox>  
                <!-- start date -->
                <v-menu
                offset-y>
                <template v-slot:activator="{on}">
                    <v-btn 
                    depressed
                    v-on="on">
                    開始日期
                    {{ calendarItem.startDate}}
                    </v-btn>
                </template>
                    <v-row justify="center">
                    <v-date-picker 
                    show-week
                    show-adjacent-months
                    picker-date
                    v-model="calendarItem.startDate"></v-date-picker>
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
                    {{ calendarItem.startTime}}
                    </v-btn>
                </template>
                <v-time-picker
                    format="ampm"
                    landscape
                    v-model="calendarItem.startTime"
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
                <!-- end date -->
                <v-menu
                offset-y>
                <template v-slot:activator="{on}">
                    <v-btn 
                    depressed
                    v-on="on">
                    結束日期
                    {{ calendarItem.endDate}}
                    </v-btn>
                </template>
                    <v-row justify="center">
                    <v-date-picker 
                    picker-date
                    v-model="calendarItem.endDate"></v-date-picker>
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
                    {{ calendarItem.endTime}}
                    </v-btn>
                </template>
                <v-time-picker
                    format="ampm"
                    landscape
                    v-model="calendarItem.endTime"
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
                <!-- calendar ID -->
                <v-radio-group              
                v-model="calendarItem.calendarIndex"
                >日曆名稱
                <v-radio v-for="(calendarList) in calendarLists"
                    :key="calendarList.index"
                    :label="calendarList.summary"
                    :value="calendarList.index"
                    :color="calendarList.backgroundColor">
                </v-radio>
                <!-- :value="calendarList.id" -->
                </v-radio-group>
                <!-- calendar color -->
                <v-radio-group              
                v-model="calendarItem.itemColorId"
                row
                >活動顏色
                <v-radio v-for="(eventColor,index) in eventColors"
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
            <v-card-actions>
                <v-btn
                depressed
                color="primary"
                @click="addItem()"
                >
                SAVE
                </v-btn>
                <v-btn
                text
                color="secondary"
                @click="cancelAdd()"
            >
                Cancel
            </v-btn>
            </v-card-actions>
            </v-card>  
    </v-menu>
</template>

<script>
  export default {
    name: 'addEvent',

data: () => ({
    timeInput: false,
      // add item
    addItemOpen: false,
    calendarItem: {
        itemTitle: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        calendarIndex: '',
        // calendarId: '',
        itemColorId: '',
        allDay: false,  
    },


    }),
mounted () {
      
},
methods: {
    addItem(){
    console.log(this.calendarItem);
     this.$store.dispatch("addEvent",this.calendarItem)
    },
    cancelInputTime(){
        this.calendarItem.startTime = '';
        this.calendarItem.endTime = '';
        this.timeInput = false;

    },
    saveInputTime(){
        this.timeInput = false;
    },
    cancelAdd(){
        this.calendarItem.itemTitle = '';
        this.calendarItem.startDate = '';
        this.calendarItem.startTime = '';
        this.calendarItem.endDate = '';
        this.calendarItem.endTime = '';
        this.calendarId= '';
        this.calendarItem.itemColorId = '';
        this.allDay= false;
        this.addItemOpen = false;
    },

},

computed: {
    calendarLists(){
        return this.$store.state.calendarLists
    },
    eventColors(){
        return this.$store.state.eventColors
    },
},

  
}
</script>