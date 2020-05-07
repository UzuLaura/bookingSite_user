import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Preview from "../views/Preview.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Pay from "../views/Pay.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
      // {
      //     path: "/",
      //     redirect: '/login'
      //
      // },
      {
          path: "/",
          name: "Home",
          component: Home,
      },
      {
          path: "/preview/id/:id",
          name: "Preview",
          component: Preview
      },
      {
          path: "/login",
          name: "Login",
          component: Login,
      },
      {
          path: "/register",
          name: "Register",
          component: Register,
      },
      {
          path: "/preview/id/:id/pay",
          name: "Pay",
          component: Pay
      },

  ]
});

export default router;
