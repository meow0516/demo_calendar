<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        Demo_Calendar
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>

      <!-- <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess">login</GoogleLogin> -->
      
       <div>
        <div v-if="isSignedIn">
          <button @click="logout()" type="button">Logout</button>
          {{ userName }}
        </div>
        <button
          :disabled="isSignedIn === null"
          @click="login()"
          type="button"
          v-if="!isSignedIn"
        >
          Login
        </button>

      </div>
      <div>
        <button @click="loadCalendarList()">load calendar list</button>
        <button @click="loadEvent()">load event</button>
        <button @click="showEvents()">show events</button>
        <button @click="getColor()">get color</button>
      </div>
      <div>
        <pre id="content" style="white-space: pre-wrap;"></pre>
      </div>
      <calendar/>
    </v-main>
  </v-app>
</template>


<script>

// import GoogleLogin from 'vue-google-login';
import calendar from './components/calendar.vue';
// import axios from 'axios';

export default {
  name: 'App',

  components: {
    calendar,
  },

  data: () => ({
    isSignedIn: null,
    // token: null,

  }),

  created() {
  //   // (2) Subscribe to authentication status changes
      this.$gapi.listenUserSignIn((isSignedIn) => {
      this.isSignedIn = isSignedIn
    })
  },

  methods: {
    login() {
        this.$gapi.login().then(
          ({ currentUser, gapi, hasGrantedScopes }) => {
          console.log({ currentUser, gapi, hasGrantedScopes })
          // call a mutation
          this.$store.state.token = currentUser['$b']['access_token']
          // console.log(this.$store.state.token);
        })
      },

    logout() {
      this.$gapi.logout()
      this.$store.commit("clearEvents")
    },

    loadEvent(){
      this.$store.dispatch("loadEvent");
    },
    
    loadCalendarList(){
      this.$store.dispatch("loadCalendarList");
    },
    showEvents(){
      console.log(this.$store.state.events)
    },
    getColor(){
      this.$store.dispatch("getColor")
    },

  },

  computed: {
    userName() {
    //   // (4) Display authenticated user name
     let user = this.$gapi.getUserData()

      if (user) {
        return user.email
      }
      else{
        return '';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
button{
  padding: 5px;
  border: 1px solid black;
}
</style>
