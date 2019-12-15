<template lang="pug">
  section.graph
    .content-wrapper
      .graph-header
        h1 <img class="mtg-icon" src="../assets/images/mtg-pw-icon.svg" /> Magic: The Gathering Card Graph
        p.intro
          strong This Vue/Chart.js-based data visualization fetches and charts <strong>Magic: The Gathering JSON</strong> data for a single set of cards.
        p <strong>How to Use:</strong> Select a set from the options below to update the chart with a new data set. Hover over the chart for a count of each card type.
        p <strong>The Data:</strong> The data that is visualized is the <pre>types</pre> property from each <pre>card</pre> object.

      .graph-content
        .graph-select
          p Select a Set:
          select(v-if="setsData.length > 0" v-model="selectedSet" @change.prevent="selectOption" ref="graphSelect")
            option(v-for="(set, key) in setsData"
            :value="set") {{ set.name }}
          select(v-else)
            option Loading...
        h6(v-if="!chartData") Loading...
        canvas#graph-container(:class="{isLoading}")

</template>

<script>
import { generatePieChart } from '../helpers.js';

export default {
  name: 'Graph',
  data() {
    return {
      endpointBase: 'https://mtgjson.com/json',
      comparisonKey: 'types',
      chartData: null,
      selectedSet: {},
      autoLoad: true,
      inited: false,
      colorSeed: 3432, // Random number seed to change chart colors tonally, default: 5
      shouldRefetch: false // true: fetch every call, false: use store
    };
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading;
    },
    graphData() {
      return this.$store.getters.graphData;
    },
    setData() {
      return this.$store.getters.setData;
    },
    setsData() {
      return this.$store.getters.setsData;
    },
  },
  async created() {
    // Get all the set endpoints as an array
    await this.$store.dispatch('UPDATE_SETS_DATA', 'https://www.mtgjson.com/files/SetList.json');

    this.selectedSet = this.$store.getters.setsData[0];
    this.selectOption();
  },
  methods: {
    selectOption() {
      // const $firstOption = Array.from(this.$refs['graphSelect'])[0];
      const setCode = this.selectedSet.code; // || $firstOption.dataset.value;
      const setLabel = this.selectedSet.name; // || $firstOption.innerText;
      // Let's not fetch data from an endpoint if we
      // have it already in the store
      const isStored = this.$store.getters.setData[setCode];

      if (this.shouldRefetch || !isStored) {
        this.fetchFromEndpoint(setCode, setLabel);
      } else {
        this.calculateGraphData(this.setData[setCode].cards, setLabel);
      }
    },
    async fetchFromEndpoint(setCode, setLabel) {
      try {
        await this.$store.dispatch('UPDATE_LOADER', true);
        let headers = {};

        // Ensure that if we have enabled refetch
        // that our fetch request acts like it
        if (this.shouldRefetch) {
          headers = new Headers();
          headers.append('pragma', 'no-cache');
          headers.append('cache-control', 'no-cache');
        }

        const awaited = await fetch(`${this.endpointBase}/${setCode}.json`, headers);
        const promised = await awaited.json();

        const newSetData = {
          setCode,
          setData: promised,
        };

        await this.$store.dispatch('UPDATE_SET_DATA', newSetData);

        await this.calculateGraphData(this.setData[setCode].cards, setLabel);
      } catch (err) {
        // Bad fetch, reset the loader
        await this.$store.dispatch('UPDATE_LOADER', false);

        throw new Error(err);
      }
    },
    async calculateGraphData(setCards) {
      if (setCards) {
        const graphData = {};
        // For each card in our data
        setCards.forEach(card => {
          const types = card[this.comparisonKey];

          // For each array of data to check for in a single card
          types.forEach(type => {
            // Did we already begin weighting?
            const isStored = graphData[type];
            const value = isStored ? graphData[type].value + 1 : 1;

            graphData[type] = {
              type,
              value,
            };
          });
        });

        // Store the graph data
        await this.$store.dispatch('UPDATE_GRAPH_DATA', graphData);
        // Clear out the last instance of chartData
        if (this.chartData) await this.chartData.destroy();
        // Make a new chart
        this.chartData = await generatePieChart(this.graphData, this.colorSeed);
        // Hide the loader
        this.$store.dispatch('UPDATE_LOADER', false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/includes/variables';

.graph {
  position: relative;
  padding: 50px 0 80px;
  max-width: 800px;
  margin: 0 auto;

  &-header {
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
        color: purple;
      }
    }
  }

  &-select {
    text-align: center;
    margin-top: 30px;

    p {
      font-weight: bold;
    }

    select {
      margin: 5px auto 0;
      padding: 5px;
      font-size: 16px;
    }
  }

  &-content {
    position: relative;
    box-sizing: border-box;
    border: 1px solid lightgray;
    border-radius: 3px;
    background-color: white;
    margin-top: 30px;
    z-index: 2;

    h6 {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0 auto;
      display: table; // Force auto centering on a text element
      transform: translateY(-50%);
      font-family: $font-stack;
      font-weight: bold;
      font-size: 20px;
      text-align: center;
    }

    canvas {
      position: relative;
      flex: 0 0 100%;
      border-radius: 5px;
    }
  }
}
</style>
