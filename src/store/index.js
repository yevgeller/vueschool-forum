import { createStore } from "vuex";
import sourceData from "@/data";

export default createStore({
  state: { ...sourceData, authId: "VXjpr2WHa8Ux4Bnggym8QFLdv5C3" },
  getters: {
    authUser: (state) => {
      const user = state.users.find((user) => user.id === state.authId);
      if (!user) return null;
      return {
        ...user,

        get postsCount() {
          return this.posts.length;
        },
        get posts() {
          return state.posts.filter((post) => post.userId === user.id);
        },
        get threadsCount() {
          return this.threads.length;
        },
        get threads() {
          return state.threads.filter((post) => post.userId === user.id);
        },
      };
    },
  },
  actions: {
    createPost(context, post) {
      post.id = "abcdefghi" + Math.random();
      context.commit("setPost", { post });
      context.commit("appendPostToThread", {
        postId: post.id,
        threadId: post.threadId,
      });
    },
  },
  mutations: {
    setPost(state, { post }) {
      state.posts.push(post);
    },
    appendPostToThread(state, { postId, threadId }) {
      const thread = state.threads.find((thread) => thread.id === threadId);
      thread.posts.push(postId);
    },
  },
});
