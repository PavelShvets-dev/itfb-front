<template>
  <div>
    <h1 v-show="!editMode">Об авторе</h1>
    <h1 v-show="editMode">Редактирование автора</h1>
    <div v-show="!editMode">
      {{ author.name }}
    </div>
    <div v-show="editMode" class="edit-form">
      <input type="text" v-model="author.name" placeholder="Автор" />
    </div>

    <p class="alert-message" v-show="hasError">
      Ошибка. Некорректное имя автора!
    </p>

    <div class="button-wrapper">
      <div
        v-show="editMode"
        class="back-button save-button"
        @click="saveAuthor()"
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

    <div class="books-wrapper">
      <div class="book-item" v-for="book in books" :key="book.id">
        {{ book.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { Author } from "@/models/author.model";
import { Book } from "@/models/book.model";

export default defineComponent({
  name: "AuthorView",

  data() {
    return {
      author: {} as Author,
      books: Array<Book>(),
      editMode: false,
      hasError: false,
    };
  },

  mounted() {
    if (this.$route.params.authorId) {
      this.loadAuthor(Number(this.$route.params.authorId)).then((response) => {
        this.author = response;

        this.loadBooks(this.author.name).then((response) => {
          this.books = response;
        });
      });
    } else if (this.$route.params.addNew) {
      this.editMode = true;
    }
  },

  methods: {
    loadBooks(authorName: string): Promise<Array<Book>> {
      return new Promise<Array<Book>>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/book/findBooks/${authorName}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve([]);
          });
      });
    },

    loadAuthor(id: number): Promise<Author> {
      return new Promise<Author>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/author/${id}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve(new Author(-1, ""));
          });
      });
    },

    saveAuthor(): void {
      if (this.emtpyOrNull(this.author.name)) {
        this.hasError = true;
        return;
      }

      if (this.author.id == null || this.author.id < 0) {
        axios
          .post(`${process.env.VUE_APP_API_URL}api/author`, this.author)
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
            `${process.env.VUE_APP_API_URL}api/author/${this.$route.params.authorId}`,
            this.author
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

    goBack() {
      this.$router.go(-1);
    },
  },
});
</script>

<style scoped>
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
.edit-form {
  margin: 0 30%;
  display: flex;
  flex-flow: column;
}
.alert-message {
  color: rgb(167, 51, 51);
}

.books-wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-content: flex-start;
}

.book-item {
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
  justify-content: center;
  align-items: center;
  color: whitesmoke;
  font-family: Roboto;
  font-size: 1.5em;
}
</style>