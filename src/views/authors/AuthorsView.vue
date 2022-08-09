<template>
  <div>
    <div class="authors-wrapper">
      <div
        class="author-container new-item"
        @click="addAuthor()"
        v-show="allowEdit()"
      >
        +
      </div>
      <div
        class="author-container"
        v-for="author in authors"
        :key="author.id"
        @click="openAuthorDetails(author.id)"
      >
        <div class="author-img"></div>
        <h1>{{ author.name }}</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import axios from "axios";
import { Author } from "@/models/author.model";
import AccountService from "@/services/account.service";

export default defineComponent({
  name: "AuthorsView",

  setup() {
    const accountService = inject("accountService") as AccountService;

    return {
      accountService,
    };
  },

  data() {
    return {
      authors: Array<Author>(),
    };
  },

  mounted() {
    this.loadAuthors().then((response) => {
      this.authors = response;
    });
  },

  methods: {
    loadAuthors(): Promise<Array<Author>> {
      return new Promise<Array<Author>>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/author/list`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve([]);
          });
      });
    },

    openAuthorDetails(id: number): void {
      this.$router.push({
        name: "author",
        params: {
          authorId: id,
        },
      });
    },

    allowEdit(): boolean {
      return this.accountService.hasAnyAuthority(["admin", "user"]);
    },

    addAuthor(): void {
      this.$router.push({
        name: "author",
        params: {
          addNew: "true",
        },
      });
    },
  },
});
</script>

<style scoped>
.authors-wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-content: flex-start;
}

.author-container {
  background: #3366cc;
  margin-bottom: 40px;
  width: 30vw;
  height: 40vh;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;

  display: flex;
  flex-flow: column;
  justify-content: flex-end;
  align-items: center;
  color: whitesmoke;
  font-family: Roboto;
  cursor: pointer;
}

.author-img {
  background: rgba(255, 255, 255, 0.4);
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
}

.new-item {
  background: rgba(51, 102, 204, 0.5) !important;
  font-size: 3em !important;
  justify-content: center !important;
}
</style>