<template>
  <div class="user-view">
    <h1>Пользователь</h1>
    <div v-show="!editMode">
      {{ user.username }}
    </div>
    <div v-show="editMode" class="login-form">
      <input
        type="text"
        v-model="user.username"
        placeholder="Имя пользователя"
      />
      <input type="password" v-model="user.password" placeholder="Пароль" />
      <input
        type="password"
        v-model="passwordConfirm"
        placeholder="Пароль еще раз"
      />
    </div>
    <h1>Группы прав</h1>
    <div v-for="authority in user.authorities" :key="authority">
      {{ authority }}
    </div>
    <div v-show="editMode" class="new-item" @click="showAuthorityModal = true">
      +
    </div>

    <p class="alert-message" v-show="hasError">
      Ошибка, попробуйте другой логин и пароль!
    </p>

    <div class="button-wrapper">
      <div
        v-show="editMode"
        class="back-button save-button"
        @click="saveUser()"
      >
        Сохранить
      </div>
      <div
        v-show="!editMode"
        class="back-button save-button"
        @click="editMode = true"
      >
        Редактировать
      </div>
      <div class="back-button" @click="goBack()">Назад</div>
    </div>

    <div class="authority-modal" v-show="showAuthorityModal">
      <div class="close-button" @click="showAuthorityModal = false">x</div>
      <div
        :class="[
          'authority-item',
          isSelectedAuthoriry(authority) ? 'authority-item-selected' : '',
        ]"
        v-for="authority in allAuthorities"
        :key="authority.name"
        @click="selectAuthoriry(authority)"
      >
        {{ authority.name }}
      </div>

      <div
        class="select-button"
        v-if="selectedAuthorities.length > 0"
        @click="submitAuthoritySelection()"
      >
        Выбрать
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { User } from "@/models/user.model";
import { Authority } from "@/models/authority.model";

export default defineComponent({
  name: "UserView",

  data() {
    return {
      user: {} as User,
      allAuthorities: Array<Authority>(),
      selectedAuthorities: Array<Authority>(),
      passwordConfirm: "",
      editMode: false,
      hasError: false,
      showAuthorityModal: false,
    };
  },

  mounted() {
    if (this.$route.params.userId) {
      this.loadUser(Number(this.$route.params.userId)).then((response) => {
        this.user = response;
      });
    } else if (this.$route.params.addNew) {
      this.editMode = true;
    }

    this.loadAuthorities().then((response) => {
      this.allAuthorities = response;
    });
  },

  methods: {
    loadUser(id: number): Promise<User> {
      return new Promise<User>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/auth/user/${id}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve(new User(-1, "", []));
          });
      });
    },

    loadAuthorities(): Promise<Array<Authority>> {
      return new Promise<Array<Authority>>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/auth/role/list`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve([]);
          });
      });
    },

    saveUser(): void {
      if (
        this.emtpyOrNull(this.user.username) ||
        this.emtpyOrNull(this.user.password) ||
        this.emtpyOrNull(this.passwordConfirm) ||
        this.user.password !== this.passwordConfirm
      ) {
        this.hasError = true;
        return;
      }

      if (this.user.id == null || this.user.id < 0) {
        axios
          .post(`${process.env.VUE_APP_API_URL}api/auth/user`, this.user)
          .then(() => {
            this.goBack();
          })
          .catch((ex) => {
            console.log("Request error", ex);
            this.hasError = true;
          });
      } else {
        axios
          .put(
            `${process.env.VUE_APP_API_URL}api/auth/user/${this.$route.params.userId}`,
            this.user
          )
          .then(() => {
            this.goBack();
          })
          .catch((ex) => {
            console.log("Request error", ex);
            this.hasError = true;
          });
      }
    },

    emtpyOrNull(val?: string): boolean {
      return val == undefined || val == null || val.trim() == "";
    },

    selectAuthoriry(authority: Authority): void {
      if (this.isSelectedAuthoriry(authority)) {
        this.selectedAuthorities = this.selectedAuthorities.filter((a) => {
          return a.name !== authority.name;
        });
      } else {
        this.selectedAuthorities.push(authority);
      }
    },

    isSelectedAuthoriry(authority: Authority): boolean {
      return (
        undefined !==
        this.selectedAuthorities.find((a) => {
          return a.name == authority.name;
        })
      );
    },

    submitAuthoritySelection(): void {
      this.showAuthorityModal = false;
      this.user.authorities = [];

      this.selectedAuthorities.forEach((a) => {
        this.user.authorities.push(a.name);
      });

      this.selectedAuthorities = [];
    },

    goBack() {
      this.$router.go(-1);
    },
  },
});
</script>

<style scoped>
.user-view {
  position: relative;
}
.button-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.back-button {
  margin: 5vh 20px;
  height: 40px;
  border-radius: 25px;
  background: rgb(24, 24, 24);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  max-width: 70%;
  min-width: 30%;
}
.save-button {
  background: rgb(82, 172, 79);
  min-width: 40%;
}
.new-item {
  background: rgba(51, 102, 204, 0.5) !important;
  height: 10vh;
  border-radius: 15px;
  margin: 2% 30%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em !important;
  cursor: pointer;
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
.login-form {
  margin: 0 30%;
  display: flex;
  flex-flow: column;
}
.alert-message {
  color: rgb(167, 51, 51);
}
.authority-modal {
  z-index: 100;
  width: 50vw;
  height: 60vh;
  background: rgb(124, 123, 123);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  display: flex;
  flex-flow: column;
}
.close-button {
  color: white;
  font-weight: bold;
  font-size: 1.5em;
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
  z-index: 200;
}
.authority-item {
  background: rgba(51, 102, 204, 0.5);
  height: 10vh;
  border-bottom: 1px solid whitesmoke;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
}
.authority-item-selected {
  background: rgba(51, 102, 204, 1) !important;
}
.select-button {
  height: 60px;
  background: rgb(82, 172, 79);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100% !important;
  font-weight: bold;
  font-size: 1.2em;
}
</style>