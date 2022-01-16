<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="thread.userId === authUser?.id"
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
    <post-editor v-if="authUser" @save="addPost"></post-editor>
    <div v-else class="text-center" style="margin-bottom: 50px">
      <router-link :to="{ name: 'SignIn', query: { redirectTo: $route.path } }"
        >Sign In</router-link
      >
      or
      <router-link
        :to="{ name: 'Register', query: { redirectTo: $route.path } }"
        >Register</router-link
      >
      to reply.
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList";
import PostEditor from "@/components/PostEditor";
import AppDate from "../components/AppDate.vue";
import { mapActions, mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  name: "ThreadShow",
  mixins: [asyncDataStatus],
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
    ...mapGetters("auth", ["authUser"]),
    thread() {
      return this.$store.getters["threads/thread"](this.id); // findById(this.threads, this.id); // also available under this.$route.params.id
    },
    threadPosts() {
      return this.posts.filter((post) => post.threadId === this.id);
    },
    threads() {
      return this.$store.state.threads.items;
    },
    posts() {
      return this.$store.state.posts.items;
    },
  },
  methods: {
    ...mapActions("posts", ["createPost", "fetchPosts"]),
    ...mapActions("threads", ["fetchThread"]),
    ...mapActions("users", ["fetchUsers"]),
    addPost(eventData) {
      console.log(eventData);
      const post = {
        ...eventData.post,
        threadId: this.id,
      };

      this.createPost(post);
    },
    editThread() {
      this.$router.push({ name: "ThreadEdit", params: { id: this.id } });
    },
  },
  async created() {
    //fetch the thread
    const thread = await this.fetchThread({ id: this.id });
    //fetch the posts
    const posts = await this.fetchPosts({
      ids: thread.posts,
    });
    //fetch the users associated with the posts
    const users = posts.map((post) => post.userId).concat(thread.userId);
    await this.fetchUsers({ ids: users });
    this.asyncDataStatus_fetched();
  },
};
</script>