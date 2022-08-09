<template>
  <div>
    <div class="user-item new-item" @click="addUser()">+</div>
    <div class="users-wrapper">
      <div
        class="user-item"
        v-for="user in users"
        :key="user.id"
        @click="openUserDetails(user.id)"
      >
        {{ user.username }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { User } from "@/models/user.model";

export default defineComponent({
  name: "UsersView",

  data() {
    return {
      users: Array<User>(),
    };
  },

  mounted() {
    this.loadUsers().then((response) => {
      this.users = response;
    });
  },

  methods: {
    loadUsers(): Promise<Array<User>> {
      return new Promise<Array<User>>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/auth/user/list`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve([]);
          });
      });
    },

    openUserDetails(id: number): void {
      this.$router.push({
        name: "user",
        params: {
          userId: id,
        },
      });
    },

    addUser(): void {
      this.$router.push({
        name: "user",
        params: {
          addNew: "true",
        },
      });
    },
  },
});
</script>

<style scoped>
.user-item {
  background: rgb(51, 102, 204);
  height: 10vh;
  border-radius: 15px;
  margin: 2% 30%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  cursor: pointer;
}
.new-item {
  background: rgba(51, 102, 204, 0.5) !important;
  font-size: 2em !important;
}
.users-wrapper {
  max-height: 50vh;
  overflow: scroll;
}
</style>