<template>
  <nav>
    <router-link to="/">Книги</router-link> |
    <router-link to="/authors">Авторы</router-link> |
    <router-link to="/about">Информация</router-link>
    <span v-show="isAuthentificated"> | </span>
    <router-link to="/users" v-show="isAuthentificated"
      >Пользователи</router-link
    >
  </nav>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "./store";

export default defineComponent({
  computed: {
    isAuthentificated(): boolean {
      return store.getters.authenticated;
    },
  },
});
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #2c3e50;
}
</style>
