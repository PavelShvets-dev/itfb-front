<template>
  <div>
    <h1>О книге</h1>
    <h2>Название</h2>
    <div v-show="!editMode">
      {{ book.name }}
    </div>
    <div v-show="editMode" class="edit-form">
      <input type="text" v-model="book.name" placeholder="Книга" />
    </div>
    <h2>Авторы</h2>
    <div v-for="author in book.authors" :key="author.id">
      {{ author.name }}
    </div>
    <div v-show="editMode" class="new-item" @click="showAuthorModal = true">
      +
    </div>

    <p class="alert-message" v-show="hasError">Ошибка сохранения!</p>

    <div class="button-wrapper">
      <div
        v-show="editMode"
        class="back-button save-button"
        @click="saveBook()"
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

    <div class="author-modal" v-show="showAuthorModal">
      <div class="close-button" @click="showAuthorModal = false">x</div>
      <div
        :class="[
          'author-item',
          isSelectedAuthor(author) ? 'author-item-selected' : '',
        ]"
        v-for="author in authors"
        :key="author.name"
        @click="selectAuthor(author)"
      >
        {{ author.name }}
      </div>

      <div
        class="select-button"
        v-if="selectedAuthors.length > 0"
        @click="submitAuthorSelection()"
      >
        Выбрать
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import { Book } from "@/models/book.model";
import { Author } from "@/models/author.model";

export default defineComponent({
  name: "BookView",

  data() {
    return {
      book: {} as Book,
      authors: Array<Author>(),
      selectedAuthors: Array<Author>(),
      editMode: false,
      hasError: false,
      showAuthorModal: false,
    };
  },

  mounted() {
    if (this.$route.params.bookId) {
      this.loadBook(Number(this.$route.params.bookId)).then((response) => {
        this.book = response;
      });
    } else if (this.$route.params.addNew) {
      this.editMode = true;
    }

    this.loadAuthors().then((response) => {
      this.authors = response;
    });
  },

  methods: {
    loadBook(id: number): Promise<Book> {
      return new Promise<Book>((resolve) => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/book/${id}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((ex) => {
            console.error("Request error", ex);
            resolve(new Book(-1, "", []));
          });
      });
    },

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

    saveBook(): void {
      if (
        this.emtpyOrNull(this.book.name) ||
        this.emtpyOrNull(this.book.authors)
      ) {
        this.hasError = true;
        return;
      }

      if (this.book.id == null || this.book.id < 0) {
        axios
          .post(`${process.env.VUE_APP_API_URL}api/book`, this.book)
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
            `${process.env.VUE_APP_API_URL}api/book/${this.$route.params.bookId}`,
            this.book
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

    emtpyOrNull(val?: any): boolean {
      return (
        val == undefined ||
        val == null ||
        (typeof val === "string" && val.trim() == "") ||
        (val instanceof Array && val.length == 0)
      );
    },

    goBack() {
      this.$router.go(-1);
    },

    selectAuthor(author: Author): void {
      if (this.isSelectedAuthor(author)) {
        this.selectedAuthors = this.selectedAuthors.filter((a) => {
          return a.name !== author.name;
        });
      } else {
        this.selectedAuthors.push(author);
      }
    },

    isSelectedAuthor(author: Author): boolean {
      return (
        undefined !==
        this.selectedAuthors.find((a) => {
          return a.name == author.name;
        })
      );
    },

    submitAuthorSelection(): void {
      this.showAuthorModal = false;
      this.book.authors = this.selectedAuthors;
      this.selectedAuthors = [];
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

.author-modal {
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
.author-item {
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
.author-item-selected {
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
</style>