<template lang='pug'>
  main#app
    Graph
</template>

<script>
import Graph from './components/Graph';

export default {
  name: 'app',
  components: { Graph },
};
</script>

<style lang="scss">
@import './assets/styles/main';
</style>

