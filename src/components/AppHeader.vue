<template>
  <v-app-bar app color="primary" dark>
    <h2 class="d-flex align-center">
      Demo Calendar
    </h2>

    <v-spacer></v-spacer>

    <div>
      {{ userName }}
    </div>
    <div>
      <div v-if="isSignedIn">
        <button class="google-btn d-flex" @click="logout()" type="button">
          <div class="google-icon-wrapper">
            <img
              class="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
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
          <img
            class="google-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          />
        </div>
        <div class="btn-text"><b>Login</b></div>
      </button>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppHeader',

  data: () => ({
    isSignedIn: null,
    userName: '',
  }),

  created() {},

  mounted() {
    let that = this;
    this.$gapi
      .listenUserSignIn(isSignedIn => {
        this.isSignedIn = isSignedIn;
      })
      .then(function() {
        that.loadCalendarList();
        that.displayUserName();
      });
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
};
</script>

<style lang="scss" scoped>
$white: #fff;
$google-blue: #4285f4;
$button-active-blue: #1669f2;

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
    font-family: 'Roboto';
  }
  &:hover {
    box-shadow: 0 0 6px $google-blue;
  }
  &:active {
    background: $button-active-blue;
  }
}
</style>
