<template>
  <div class="app">
      <h1>App {{ name }}</h1>
  </div>
</template>

<style lang="scss" scoped>
 .app {
   text-align: center;
 }
</style>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'

    @Component
    export default class App extends Vue {
      private name: string = "CVLinked"
    }
</script>