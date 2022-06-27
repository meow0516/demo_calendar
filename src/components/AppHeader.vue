<template>
  <v-app-bar app v-if="!isLoading">
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
    isSignedIn: false,
    isLoading: true,
    userName: '',
  }),

  created() {},

  async mounted() {
    await this.$gapi.listenUserSignIn(isSignedIn => {
      this.isSignedIn = isSignedIn;
      if (this.isSignedIn) {
        this.userName = this.$gapi.getUserData().fullName;
      }
    });
    this.isLoading = false;
  },

  methods: {
    async login() {
      try {
        await this.$gapi.login();
        let user = await this.$gapi.getUserData();
        this.updateSigninStatus();
        this.userName = user.fullName;
      } catch (error) {
        console.log(error);
      }
    },
    async logout() {
      try {
        await this.$gapi.logout();
        this.updateSigninStatus();
        this.userName = '';
      } catch (error) {
        console.log(error);
      }
    },
    updateSigninStatus() {
      this.isSignedIn = !this.isSignedIn;
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
    color: $google-blue;
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
