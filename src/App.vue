<template>
  <v-app>
    <AppHeader />
    <v-main>
      <div>
        <pre id="content" style="white-space: pre-wrap;"></pre>
      </div>
      <Calendar />
    </v-main>
  </v-app>
</template>

<script>
import Calendar from './components/CalendarContainer.vue';
import AppHeader from './components/AppHeader.vue';

export default {
  name: 'App',

  components: {
    Calendar,
    AppHeader,
  },

  data: () => ({
    isSignedIn: null,
    userName: '',
  }),

  created() {},

  mounted() {
    let that = this;
    //   // (2) Subscribe to authentication status changes
    // is signed in
    this.$gapi
      .listenUserSignIn(isSignedIn => {
        this.isSignedIn = isSignedIn;
      })
      .then(function() {
        that.loadCalendarList();
        that.displayUserName();
      });

    // hasn't signed in
  },

  methods: {
    login() {
      let that = this;
      this.$gapi.login().then(function() {
        that.loadCalendarList();
        that.displayUserName();
      });
    },

    logout() {
      this.$gapi.logout();
      this.userName = '';
      this.$store.commit('clearEvents');
    },

    loadEvent() {
      this.$store.dispatch('loadEvent');
    },

    loadCalendarList() {
      this.$store.dispatch('loadCalendarList').then(() => {
        return this.loadEvent();
      });
    },

    displayUserName() {
      let user = this.$gapi.getUserData();

      if (user) {
        this.userName = user.email;
      }
    },
  },

  computed: {},
};
</script>
