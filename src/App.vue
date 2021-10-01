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
      <GoogleLogin :params="params" :renderParams="renderParams" :onSuccess="onSuccess">login</GoogleLogin>
      <calendar/>
    </v-main>
  </v-app>
</template>


<script>

// import Signin from './components/signin.vue'
import GoogleLogin from 'vue-google-login';
import Calendar from './components/calendar.vue';

export default {
  name: 'App',

  components: {
    // Signin,
    GoogleLogin,
    Calendar,
  },

  data: () => ({
    params: {
      client_id: "642199378747-62svnibd4medlgj1ptd685ol8vf5l322.apps.googleusercontent.com"
    },
    renderParams: {
      width: 250,
      height: 50,
      longtitle: true
    }
  }),

  methods: {
    onSuccess(googleUser) {
      console.log(googleUser);
      console.log(googleUser.getBasicProfile());
    },
  },
};
</script>
