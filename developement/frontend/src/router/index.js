import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import HomeV2 from "@/views/HomeV2.vue"

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: HomeV2,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;