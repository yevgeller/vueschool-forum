<template>
  <VeeForm>
    <AppFormField
      name="reauth-email"
      label="Email"
      v-model="email"
      rules="email"
    />
    <AppFormField
      name="reauth-password"
      label="Password"
      v-model="password"
      type="password"
    />
    <button class="btn btn-green btn-small">Login</button>
  </VeeForm>
</template>
<script>
export default {
  data() {
    return { email: "", password: "" };
  },
};
</script>