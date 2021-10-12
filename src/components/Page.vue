<template lang="pug">
  .page-wrapper
    .content-wrapper
      section.section-wrapper
        Header
      section.section-wrapper
        Graph
</template>

<script>
import Header from './Header';
import Graph from './Graph.vue';

export default {
  name: 'Page',
  components: { Header, Graph }
}
</script>

<style lang="scss" scoped>
$padding: 2rem;
$max-width: 800px;

.section-wrapper {
  padding: $padding;
  max-width: calc(#{$max-width} - #{$padding});
  margin: 0 auto;
}
</style>
