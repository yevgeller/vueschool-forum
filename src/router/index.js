import Home from "@/pages/Home";
import ThreadShow from "@/pages/ThreadShow";
import Category from "@/pages/Category";
import NotFound from "@/pages/NotFound";
import Forum from "@/pages/Forum";
import Profile from "@/pages/Profile";
import { createRouter, createWebHistory } from "vue-router";
import sourceData from "@/data.json";

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
  },
  {
    path: "/me/edit",
    name: "ProfileEdit",
    component: Profile,
    props: { edit: true },
  },
  { path: "/category/id", name: "Category", component: Category, props: true },
  { path: "/forum/:id", name: "Forum", component: Forum, props: true },
  {
    path: "/thread/:id",
    name: "ThreadShow",
    component: ThreadShow,
    props: true,
    beforeEnter(to, from, next) {
      //check if thread exists
      const threadExists = sourceData.threads.find(
        (thread) => thread.id === to.params.id
      );
      //if exists continue
      if (threadExists) {
        return next();
      } else {
        next({
          name: "NotFound",
          // preserve current path and remove the first char to avoid the target URL starting with `//`
          params: { pathMatch: to.path.substring(1).split("/") },
          // preserve existing query and hash if any
          query: to.query,
          hash: to.hash,
        });
      }
      //if does not exist redirect to not found
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const scroll = {};
    if (to.meta.toTop) scroll.top = 0;
    if (to.meta.smoothScroll) scroll.behavior = "smooth";
    return scroll;
  },
});
