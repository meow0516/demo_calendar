<template>
  <!-- add item input -->
  <v-card color="grey lighten-4" min-width="350px" max-width="600px" flat>
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
      <v-checkbox v-model="calendarItem.allDay" label="全天"></v-checkbox>
      <div class="inputtime-container">
        <div class="daytime-input">
          <!-- start date -->
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn depressed v-on="on">
                開始日期
                {{ calendarItem.startDate }}
              </v-btn>
            </template>
            <v-row justify="center">
              <v-date-picker
                show-week
                show-adjacent-months
                picker-date
                v-model="calendarItem.startDate"
              ></v-date-picker>
            </v-row>
          </v-menu>
          <!-- start time -->
          <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                depressed
                v-on="on"
                v-show="!calendarItem.allDay"
                @click="editInputStart()"
              >
                開始時間
                {{ calendarItem.startTime }}
              </v-btn>
            </template>
            <v-time-picker
              format="ampm"
              landscape
              v-model="calendarItem.startTime"
              v-show="startTimeInput"
            >
              <v-btn text color="primary" @click="cancelInputStart()">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="saveInputStart()">
                OK
              </v-btn>
            </v-time-picker>
          </v-menu>
        </div>
        <div class="daytime-input">
          <!-- end date -->
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn depressed v-on="on">
                結束日期
                {{ calendarItem.endDate }}
              </v-btn>
            </template>
            <v-row justify="center">
              <v-date-picker
                picker-date
                v-model="calendarItem.endDate"
              ></v-date-picker>
            </v-row>
          </v-menu>
          <!-- end time -->
          <v-menu :close-on-content-click="false" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                depressed
                v-show="!calendarItem.allDay"
                v-on="on"
                @click="editInputEnd()"
              >
                <!-- @click="timeInput=true" -->
                結束時間
                {{ calendarItem.endTime }}
              </v-btn>
            </template>
            <v-time-picker
              format="ampm"
              landscape
              v-model="calendarItem.endTime"
              v-show="endTimeInput"
            >
              <v-btn text color="primary" @click="cancelInputEnd()">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="saveInputEnd()">
                OK
              </v-btn>
            </v-time-picker>
          </v-menu>
        </div>
      </div>
      <!-- calendar ID -->
      <div class="input-subtitle">
        日曆名稱
      </div>
      <v-radio-group v-model="calendarItem.calendarIndex">
        <v-radio
          v-for="calendarList in calendarLists"
          :key="calendarList.index"
          :label="calendarList.summary"
          :value="calendarList.index"
          :color="calendarList.backgroundColor"
        >
        </v-radio>
      </v-radio-group>
      <!-- calendar color -->
      <div class="input-subtitle">
        活動顏色
      </div>
      <v-radio-group v-model="calendarItem.itemColorId" row>
        <v-radio
          v-for="(eventColor, index) in eventColors"
          :key="eventColor.index"
          :label="index"
          :color="eventColor.background"
          :value="index"
        >
        </v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-actions>
      <v-btn depressed color="primary" @click="addItem()">
        SAVE
      </v-btn>
      <v-btn text color="secondary" @click="cancelAdd()">
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CreateEventDialog',

  data: () => ({
    startTimeInput: false,
    endTimeInput: false,
    currentInput: '',
    // add item
    addItemOpen: false,
    calendarItem: {
      itemTitle: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      calendarIndex: '',
      itemColorId: '',
      allDay: false,
    },
  }),
  mounted() {},
  methods: {
    addItem() {
      this.$store.dispatch('addEvent', this.calendarItem);

      this.addItemOpen = false;
    },
    editInputStart() {
      this.startTimeInput = true;
      this.currentInput = this.calendarItem.startTime;
    },
    editInputEnd() {
      this.endTimeInput = true;
      this.currentInput = this.calendarItem.endTime;
    },
    cancelInputStart() {
      this.calendarItem.startTime = this.currentInput;
      this.startTimeInput = false;
    },
    cancelInputEnd() {
      this.calendarItem.endTime = this.currentInput;
      this.endTimeInput = false;
    },
    saveInputStart() {
      this.startTimeInput = false;
    },
    saveInputEnd() {
      this.endTimeInput = false;
    },
    cancelAdd() {
      this.clearInput();
      this.addItemOpen = false;
    },
    clearInput() {
      this.calendarItem.itemTitle = '';
      this.calendarItem.startDate = '';
      this.calendarItem.startTime = '';
      this.calendarItem.endDate = '';
      this.calendarItem.endTime = '';
      (this.calendarItem.calendarIndex = ''),
        (this.calendarItem.itemColorId = '');
      this.calendarItem.allDay = false;
    },
  },

  computed: {
    calendarLists() {
      return this.$store.state.calendarLists;
    },
    eventColors() {
      return this.$store.state.eventColors;
    },
  },
};
</script>
<style lang="scss" scoped>
.inputtime-container {
  padding-bottom: 20px;
}
.daytime-input {
  width: 80%;
}
.input-subtitle {
  font-size: 18px;
  display: block;
}
</style>
