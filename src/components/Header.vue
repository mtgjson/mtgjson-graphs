<template lang="pug">
  header.graph-header
    h1
      img(class="mtg-icon" src="../assets/images/mtg-pw-icon.svg")
      span Magic: The Gathering Card Graph
    p.intro
      strong This Vue/Chart.js-based data visualization fetches and charts Magic: The Gathering JSON data for a single set of cards.
    p
      strong How to Use:
      span  Select a set from the options below to update the chart with a new data set. You can also select a chart type to visualize the data differently.
    p
      strong The Data:
      span  The data that is visualized is the <pre>types</pre> property from each <pre>card</pre> object from a set. Data is provided by <a href="https://mtgjson.com" target="_blank">MTGJSON.com</a>.

</template>

<style lang="scss" scoped>
@import '../assets/styles/includes/variables';

.graph {
  &-header {
    position: relative;
    margin: 0 auto;

    h1 {
      font-size: 30px;
      font-weight: bold;
      display: flex;
      align-items: center;

      .mtg-icon {
        width: 100%;
        max-width: 30px;
        height: auto;
        margin-right: 20px;
      }
    }

    p {
      margin-top: 15px;

      &.intro {
        color: $accent-color;
      }
    }
  }
}
</style>
