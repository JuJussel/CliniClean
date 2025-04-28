import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import medicalHome from "@/views/medicalHome.vue"

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/medical",
    name: "Medical",
    component: medicalHome,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;