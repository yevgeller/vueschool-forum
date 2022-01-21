<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
        class="btn-green btn-small"
      >
        Start a thread
      </router-link>
    </div>
  </div>
  0722
  <div class="col-full push-top">
    <ThreadList :threads="threads" />
    <v-pagination
      v-model="page"
      :pages="totalPages"
      active-color="#57AD8D"
      @update:modelValue="updateHandler"
    />
  </div>
</template>

<script>
import ThreadList from "@/components/ThreadList";
import { findById } from "@/helpers";
import { mapActions } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  components: { ThreadList },
  mixins: [asyncDataStatus],
  props: {
    id: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      page: 1,
      perPage: 10,
    };
  },
  methods: {
    ...mapActions("forums", ["fetchForum"]),
    ...mapActions("threads", ["fetchThreads"]),
    ...mapActions("users", ["fetchUsers"]),
  },
  computed: {
    forum() {
      return findById(this.$store.state.forums.items, this.id);
    },
    threads() {
      if (!this.forum) return [];
      return this.forum.threads.map((threadId) =>
        this.$store.getters["threads/thread"](threadId)
      );
    },
    threadCount() {
      return this.forum.threads.length;
    },
    totalPages() {
      if (!this.threadCount) return 0;
      return Math.ceil(this.threadCount / this.perPage);
    },
  },
  async created() {
    const forum = await this.fetchForum({ id: this.id });
    const threads = await this.fetchThreads({
      ids: forum.threads,
    });
    await this.fetchUsers({
      ids: threads.map((thread) => thread.userId),
    });
    this.asyncDataStatus_fetched();
  },
};
</script>

<style scoped>
</style>
