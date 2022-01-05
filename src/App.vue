<template>
  <the-navbar />
  <div class="container">
    <router-view v-show="showPage" @ready="showPage = true" />
    <AppSpinner v-show="!showPage" />
  </div>
</template>

<script>
import TheNavbar from "@/components/TheNavbar";
import { mapActions } from "vuex";
export default {
  name: "App",
  data() {
    return {
      showPage: false,
    };
  },
  components: {
    TheNavbar,
  },
  methods: {
    ...mapActions(["fetchAuthUser"]),
  },
  created() {
    this.fetchAuthUser();
    this.$router.beforeEach(() => {
      this.showPage = false;
    });
  },
};
</script>

<style>
@import "assets/style.css";
</style>
