<template>
  <div>
    <div class="app">
      <h1>App {{ name }}</h1>
    </div>
    <code contenteditable="false" tabindex="0" spellcheck="false">
      {{ profile ? profile.userProfile.fullName : '' }}
    </code>
  </div>
</template>

<style lang="scss" scoped>
 .app {
   text-align: center;
   background: $main-color;
 }
</style>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import Profile from './model/profile';
    import { ProfileActions } from './store/modules/profile/actions'

    @Component
    export default class App extends Vue {
      private name: string = "CVLinked"

      mounted() {
        this.$store.dispatch(ProfileActions.PROFILE_FROM, 'christiangelone')
      }

      get profile(): Profile {
        return this.$store.getters.getProfile;
      }
    }
</script>