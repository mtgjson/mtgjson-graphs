<template lang='pug'>
  main#app
    Loader
    Graph
</template>

<script>
import Graph from "./components/Graph";
import Loader from "./components/Loader";

export default {
  name: "app",
  components: {
    Graph,
    Loader
  }
};
</script>

<style lang="scss">
@import "./assets/styles/main";
</style>

