<template>
  <div class="about">
    <h1 v-show="!isAuthentificated">Вы не авторизованы</h1>
    <div v-show="!isAuthentificated" class="login-form">
      <label>Логин</label>
      <input type="text" placeholder="Логин" v-model="username" />
      <label>Пароль</label>
      <input type="password" placeholder="Пароль" v-model="password" />

      <p class="alert-message" v-show="hasError">
        Ошибка входа, проверьте логин и пароль
      </p>

      <button
        class="login-button"
        @click="signin()"
        :disabled="username.trim() == '' || password.trim() == ''"
      >
        Вход
      </button>
    </div>

    <div v-show="isAuthentificated" class="login-form">
      <h1>Вы вошли, как {{ user.username }}</h1>
      <h2>Роли:</h2>
      <div v-for="authority in user.authorities" :key="authority">
        {{ authority }}
      </div>
      <button class="login-button" @click="signout()">Выход</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { User } from "@/models/user.model";
import store from "@/store";

export default defineComponent({
  name: "AboutView",

  data() {
    return {
      user: {} as User,
      username: "",
      password: "",
      hasError: false,
    };
  },

  mounted() {
    this.username = "";
    this.password = "";
    this.user = store.getters.account || {};
  },

  computed: {
    isAuthentificated(): boolean {
      return store.getters.authenticated;
    },
  },

  watch: {
    username(oldVal: string, newVal: string) {
      if (oldVal !== newVal) this.hasError = false;
    },
    password(oldVal: string, newVal: string) {
      if (oldVal !== newVal) this.hasError = false;
    },
  },

  methods: {
    signin(): void {
      axios
        .post(`${process.env.VUE_APP_API_URL}api/signin`, {
          username: this.username.toLowerCase(),
          password: this.password,
        })
        .then((response) => {
          this.user = response.data;
          store.commit("authenticate");
          store.commit("authenticated", this.user);
        })
        .catch((ex) => {
          console.error("Request error", ex);
          this.hasError = true;
        });
    },

    signout(): void {
      axios
        .post(`${process.env.VUE_APP_API_URL}api/logout`)
        .then(() => {
          store.commit("logout");
        })
        .catch((ex) => {
          console.error("Request error", ex);
        });
    },
  },
});
</script>

<style scoped>
.login-form {
  margin: 0 30%;
  display: flex;
  flex-flow: column;
}
input {
  display: block;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  border-width: 1px;
  padding: 0 10px;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 300;
}
::placeholder {
  color: rgba(48, 48, 48, 0.4);
}
label {
  display: block;
  margin-top: 30px;
  font-size: 16px;
  font-weight: bold;
  align-self: flex-start;
}
.login-button {
  margin: 10vh 10%;
  height: 40px;
  border-radius: 25px;
  border-style: none;
  background: rgb(24, 24, 24);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
}
.login-button:disabled {
  background: rgba(24, 24, 24, 0.5);
}
.alert-message {
  color: rgb(167, 51, 51);
}
</style>