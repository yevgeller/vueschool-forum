<template>
  <div class="col-full text-center"><h1>Page not Found</h1></div>
  <router-link :to="{ name: 'Home' }">Back to main page</router-link>
</template>

<script>
export default {
  created() {
    this.$emit("ready");
  },
};
</script>