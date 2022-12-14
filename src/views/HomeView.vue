<template>
  <div class="home">
    <div class="books-wrapper">
      <div
        class="book-container new-item"
        @click="addBook()"
        v-show="allowEdit()"
      >
        +
      </div>
      <div
        class="book-container"
        v-for="book in books"
        :key="book.id"
        @click="openBookDetails(book.id)"
      >
        <div class="author-wrapper">
          <p v-for="author in book.authors" :key="author.id">
            {{ author.name }}
          </p>
        </div>
        <h1>{{ book.name }}</h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import { Book } from "@/models/book.model";
import axios from "axios";
import AccountService from "@/services/account.service";

export default defineComponent({
  name: "HomeView",

  setup() {
    const accountService = inject("accountService") as AccountService;

    return {
      accountService,
    };
  },

  data() {
    return {
      books: Array<Book>(),
    };
  },

  mounted() {
    this.loadBooks().then((response) => {
      this.books = response;
    });
  },

  methods: {
    loadBooks(): Promise<Array<Book>> {
      return new Promise<Array<Book>>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/book/list`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve([]);
          });
      });
    },

    openBookDetails(id: number): void {
      this.$router.push({
        name: "book",
        params: {
          bookId: id,
        },
      });
    },

    allowEdit(): boolean {
      return this.accountService.hasAnyAuthority(["admin", "user"]);
    },

    addBook(): void {
      this.$router.push({
        name: "book",
        params: {
          addNew: "true",
        },
      });
    },
  },
});
</script>

<style scoped>
.books-wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-content: flex-start;
}

.book-container {
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
  justify-content: flex-start;
  align-items: center;
  color: whitesmoke;
  font-family: Roboto;
  cursor: pointer;
}

.author-wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  width: 50%;
}

.new-item {
  background: rgba(51, 102, 204, 0.5) !important;
  font-size: 3em !important;
  justify-content: center !important;
}
</style>