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

      <div>
        {{ userName }}          
      </div>
      <div>
        <div v-if="isSignedIn">
          <button 
            class="google-btn d-flex"
            @click="logout()" 
            type="button"
            >
            <div class="google-icon-wrapper">
              <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
            </div>
            <div class="btn-text"><b>Logout</b></div>
          </button>
        </div>
        <button
          class="google-btn d-flex"
          :disabled="isSignedIn === null"
          @click="login()"
          type="button"
          v-if="!isSignedIn"
        >
          <div class="google-icon-wrapper">
            <img class="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
          </div>
          <div class="btn-text"><b>Login</b></div>
        </button>

      </div>
    </v-app-bar>

    <v-main>     
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
$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669F2;

.google-btn {
  margin-left: 10px;
  width: 150px;
  height: 40px;
  justify-content: space-around;
  align-items: center;
  border: 1px solid $google-blue;
  border-radius: 2px;

  .google-icon-wrapper {
    border-radius: 2px;
  }
  .google-icon {
    width: 18px;
    height: 18px;
    position: relative;
    top: 2px;
  }
  .btn-text {
    color: $white;
    font-size: 20pxpx;
    letter-spacing: 0.2px;
    font-family: "Roboto";
  }
  &:hover {
    box-shadow: 0 0 6px $google-blue;
  }
  &:active {
    background: $button-active-blue;
  }
}

</style>
