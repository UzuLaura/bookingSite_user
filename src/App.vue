<template>
  <div id="app">
    <!-- NAVBAR -->
    <div id="navbar" class="container">
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link class="brand" to="/">
            <img src="./assets/logo.png">
          </router-link>

          <a role="button"  class="navbar-burger burger" v-on:click="showNav = !showNav" :class="{ 'is-active': showNav }">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <!-- User -->
        <div v-if="user" :class="{ 'is-active': showNav }" class="navbar-menu">
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-light" v-on:click.prevent="logout">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- Not User -->
        <div v-else class="navbar-menu" :class="{ 'is-active': showNav }">
          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <router-link to="/register" class="button primary-color">
                  <strong>Register</strong>
                </router-link>
                <router-link to="/login" class="button is-light">
                  Login
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <Hero />
    <router-view class="has-background-light" />
    <Footer />
  </div>
</template>

<script>
    import firebase from 'firebase/app';
    import 'firebase/auth';
    import 'firebase/firestore';
    import Hero from './components/Hero.vue'
    import Footer from './components/Footer.vue'

    export default {
      name: 'App',
      components: {Hero, Footer},
      data () {
          return {
              user: '',
              showNav: false
          }
      },
      methods: {
          logout () {
              firebase
                  .auth()
                  .signOut()
                  .then(() => {
                      this.user = ''
                      localStorage.removeItem('bookingInfo')
                      localStorage.removeItem('user')
                      localStorage.removeItem('username')
                      this.$router.push({name: "Login"})
                  })
          }
      },
      beforeMount () {
          firebase
              .auth()
              .onAuthStateChanged(user => {
                  if (user) {
                      this.user = user
                      localStorage.setItem('user', user.uid)
                      localStorage.setItem('username', user.displayName)
                  } else {
                      localStorage.removeItem('user')
                      localStorage.removeItem('username')
                  }
              })
      }
  }
</script>

<style>
  .brand img {
    height: 50px;
    transform: translate(0, 10%);
  }
  .primary-color {
    background: #2e58a6 !important;
    color: white !important;
  }
</style>
