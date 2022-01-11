import Home from "@/pages/Home";
import ThreadShow from "@/pages/ThreadShow";
import ThreadCreate from "@/pages/ThreadCreate";
import ThreadEdit from "@/pages/ThreadEdit";
import Category from "@/pages/Category";
import NotFound from "@/pages/NotFound";
import Forum from "@/pages/Forum";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import SignIn from "@/pages/SignIn";
import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

// import sourceData from "@/data.json";
// import { findById } from "@/helpers";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/me",
    name: "Profile",
    component: Profile,
    meta: { toTop: true, smoothScroll: true },
    beforeEnter() {
      if (!store.state.authId) return { name: "Home" };
    },
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: Profile,
    props: { edit: true },
  },
  { path: "/category/:id", name: "Category", component: Category, props: true },
  { path: "/forum/:id", name: "Forum", component: Forum, props: true },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: ThreadShow,
    props: true,
    // beforeEnter(to, from, next) {
    //   //check if thread exists
    //   const threadExists = findById(sourceData.threads, to.params.id);
    //   //if exists continue
    //   if (threadExists) {
    //     return next();
    //   } else {
    //     next({
    //       name: "NotFound",
    //       // preserve current path and remove the first char to avoid the target URL starting with `//`
    //       params: { pathMatch: to.path.substring(1).split("/") },
    //       // preserve existing query and hash if any
    //       query: to.query,
    //       hash: to.hash,
    //     });
    //   }
    //   //if does not exist redirect to not found
    // },
  },
  {
    path: "/forum/:forumId/thread/create",
    name: "ThreadCreate",
    component: ThreadCreate,
    props: true,
  },
  {
    path: "/thread/:id/edit",
    name: "ThreadEdit",
    component: ThreadEdit,
    props: true,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  { path: "/signin", name: "SignIn", component: SignIn },
  {
    path: "/logout",
    name: "SignOut",
    async beforeEnter() {
      await store.dispatch("signOut");
      return { name: "Home" };
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return scroll;
  },
});

router.beforeEach(() => {
  store.dispatch("unsubscribeAllSnapshots");
});

export default router;
