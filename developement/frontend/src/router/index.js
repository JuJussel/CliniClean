import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import MedicalHome from "@/views/Home.vue"

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/clinicare/app",
    name: "CliniCare",
    component: MedicalHome,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;