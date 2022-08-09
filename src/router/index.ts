import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import AuthorsView from '../views/authors/AuthorsView.vue'
import AuthorView from '../views/authors/AuthorView.vue'
import BookView from '../views/books/BookView.vue'
import HomeView from '../views/HomeView.vue'
import UsersView from '../views/users/UsersView.vue'
import UserView from '../views/users/UserView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/authors',
    name: 'authors',
    component: AuthorsView
  },
  {
    path: '/author',
    name: 'author',
    component: AuthorView
  },
  {
    path: '/book',
    name: 'book',
    component: BookView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView
  },
  {
    path: '/user',
    name: 'user',
    component: UserView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
