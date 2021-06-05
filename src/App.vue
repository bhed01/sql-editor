<template>
  <router-view />
</template>

<script>
import Dashboard from "./views/Dashboard.vue";
import Login from "./views/Login.vue";

export default {
  name: "App",
  components: {
    Dashboard,
    Login,
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0;
}
#app,
body,
html {
  height: 100%;
}
</style>