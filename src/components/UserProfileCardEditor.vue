<template>
  <div class="profile-card">
    <VeeForm @submit="save">
      <p class="text-center avatar-edit">
        <label for="avatar">
          <app-avatar-img
            :src="activeUser.avatar || '/user-placeholder.png'"
            :alt="`${user.name} profile picture`"
            class="avatar-xlarge img-update"
          />
          <div class="avatar-upload-overlay">
            <app-spinner v-if="uploadingImage" color="white" />
            <fa
              v-else
              icon="camera"
              size="3x"
              :style="{ color: 'white', opacity: '.8' }"
            />
          </div>

          <input
            v-show="false"
            type="file"
            id="avatar"
            accept="image/*"
            @change="handleAvatarUpload"
          />
        </label>
      </p>
      <user-profile-card-editor-random-avatar
        @hit="activeUser.avatar = $event"
      />
      <AppFormField
        placeholder="Username"
        name="username"
        v-model="activeUser.username"
        :rules="`required|unique:users,username,${user.username}`"
      />

      <AppFormField
        placeholder="Full Name"
        name="fullname"
        v-model="activeUser.fullname"
        rules="required"
      />

      <AppFormField
        label="Bio"
        as="textarea"
        name="bio"
        v-model="activeUser.bio"
        placeholder="Write a few words about yourself."
      />

      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>

      <hr />

      <AppFormField
        label="Website"
        name="website"
        v-model="activeUser.website"
        rules="url"
      />
      <AppFormField
        label="Email"
        name="email"
        v-model="activeUser.email"
        :rules="`required|email|unique:users,email,${user.email}`"
      />
      <AppFormField
        label="Location"
        name="location"
        v-model="activeUser.location"
      />

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import UserProfileCardEditorRandomAvatar from "./UserProfileCardEditorRandomAvatar.vue";
export default {
  components: { UserProfileCardEditorRandomAvatar },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      uploadingImage: false,
      activeUser: { ...this.user },
      locationOptions: [],
    };
  },
  created() {
    this.loadLocationOptions();
  },
  methods: {
    ...mapActions("auth", ["uploadAvatar"]),
    async loadLocationOptions() {
      const res = await fetch("https://restcountries.com/v3/all");
      this.locationOptions = await res.json();
    },
    async handleAvatarUpload(e) {
      this.uploadingImage = true;
      const file = e.target.files[0];
      const uploadedImage = await this.uploadAvatar({ file });
      this.activeUser.avatar = uploadedImage || this.activeUser.avatar;
      this.uploadingImage = false;
    },
    async handleRandomAvatarUpload() {
      const randomAvatarGenerated =
        this.activeUser.avatar.startsWith("https://pixabay");
      if (randomAvatarGenerated) {
        const image = await fetch(this.activeUser.avatar);
        const blob = await image.blob();
        this.activeUser.avatar = await this.uploadAvatar({
          file: blob,
          filename: "random",
        });
      }
    },
    async save() {
      await this.handleRandomAvatarUpload();
      this.$store.dispatch("users/updateUser", { ...this.activeUser });
      this.$router.push({ name: "Profile" });
    },
    cancel() {
      this.$router.push({ name: "Profile" });
    },
  },
};
</script>