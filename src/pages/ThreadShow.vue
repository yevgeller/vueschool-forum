<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-green btn-small"
        tag="button"
      >
        Edit Thread
      </router-link>
    </h1>
    <p>
      By<a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >,<app-date :timestamp="thread.publishedAt" />

      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} replies by
        {{ thread.contributorsCount }} contributors</span
      >
    </p>
    <post-list :posts="threadPosts"></post-list>
    <post-editor @save="addPost"></post-editor>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import AppDate from "../components/AppDate.vue";
import firebase from "firebase";
//import { findById } from "@/helpers";

export default {
  name: "ThreadShow",
  components: {
    PostList,
    PostEditor,
    AppDate,
  },
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  computed: {
    thread() {
      return this.$store.getters.thread(this.id); // findById(this.threads, this.id); // also available under this.$route.params.id
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
    threads() {
      return this.$store.state.threads;
    },
    posts() {
      return this.$store.state.posts;
    },
  },
  methods: {
    addPost(eventData) {
      console.log(eventData);
      const post = {
        ...eventData.post,
        threadId: this.id,
      };

      this.$store.dispatch("createPost", post);
    },
    editThread() {
      this.$router.push({ name: "ThreadEdit", params: { id: this.id } });
    },
  },
  created() {
    firebase
      .firestore()
      .collection("threads")
      .doc(this.id)
      .onSnapshot((doc) => {
        const thread = { ...doc.data(), id: doc.id };
        this.$store.commit("setThread", { thread });

        firebase
          .firestore()
          .collection("users")
          .doc(thread.userId)
          .onSnapshot((doc) => {
            const user = { ...doc.data(), id: doc.id };
            this.$store.commit("setUser", { user });
          });

        thread.posts.forEach((postId) => {
          firebase
            .firestore()
            .collection("posts")
            .doc(postId)
            .onSnapshot((doc) => {
              const post = { ...doc.data(), id: doc.id };
              this.$store.commit("setPost", { post });

              firebase
                .firestore()
                .collection("users")
                .doc(post.userId)
                .onSnapshot((doc) => {
                  const user = { ...doc.data(), id: doc.id };
                  this.$store.commit("setUser", { user });
                });
            });
        });
      });
  },
};
</script>