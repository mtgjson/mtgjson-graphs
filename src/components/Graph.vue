<template lang="pug">
  section.graph
    .content-wrapper
      .graph-header
        h1 <img class="mtg-icon" src="../assets/images/mtg-pw-icon.svg" /> Magic: The Gathering Card Graph
        p.intro
          strong This Vue/Chart.js-based data visualization fetches and charts <strong>Magic: The Gathering JSON</strong> data for a single set of cards.
        p <strong>How to Use:</strong> Click on any tab button below to update the chart with a new data set.
        p <strong>The Data:</strong> Currently the only data that is visualized is the <pre>types</pre> key from each <pre>card</pre> object and only from pre-selected endpoints (though many are available).

      .graph-content
        .graph-tabs
          button.graph-tabs--tab(
          v-for="(value, key) in endpoints"
          ref="graph-tab"
          @click.prevent="selectTab($event, value)") {{ value.label }}
        h6(v-if="!chartData") Loading...
        canvas#graph-container(:class="{isLoading}")

</template>

<script>
import { generatePieChart, getDOMSiblings } from "../helpers.js";

export default {
  name: "Graph",
  data() {
    return {
      // Load data on creation
      endpointBase: "https://mtgjson.com/json",
      comparisonKey: "types",
      chartData: undefined,
      // Data refetch.
      // true => real-time data updates by fetching from the API again.
      // false => render graph data from the store after the first fetch.
      shouldRefetch: false,
      autoLoad: true,
      inited: false,
      endpoints: [
        {
          file: "WAR",
          label: "War of the Spark"
        },
        {
          file: "DOM",
          label: "Dominaria"
        },
        {
          file: "V17",
          label: "From the Vault: Transform"
        },
        {
          file: "MM3",
          label: "Modern Masters 2017"
        }
      ]
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
    }
  },
  methods: {
    async fetchFromEndpoint({ file, label }) {
      const pathToFetch = `${this.endpointBase}/${file}.json`;

      try {
        await this.$store.dispatch("update loader", true);

        let headers = {};

        // Ensure that if we have enabled refetch
        // that our fetch request acts like it
        if(this.shouldRefetch){
          headers = new Headers();
          headers.append('pragma', 'no-cache');
          headers.append('cache-control', 'no-cache');
        }

        const toFetch = await fetch(pathToFetch, headers);
        const data = {
          file,
          data: await toFetch.json()
        };

        await this.$store.dispatch("update set data", data);

        await this.calculateGraphData(this.setData[file].cards, label);
      } catch (e) {
        // Bad fetch, reset the loader
        await this.$store.dispatch("update loader", false);

        throw new Error(e);
      }
    },
    calculateGraphData(data, label) {
      if (data) {
        const graphData = {};
        // For each card in our data
        // Big O is not great: O(n^2)
        data.forEach(dataObject => {
          const dataArray = dataObject[this.comparisonKey];

          // For each array of data to check for in a single card
          dataArray.forEach(dataLabel => {
            // Did we already begin weighting?
            const isStored = graphData[dataLabel];
            const value = isStored ? graphData[dataLabel].value + 1 : 1;

            graphData[dataLabel] = {
              label: dataLabel,
              value
            };
          });
        });

        this.createGraph(graphData, label);

        this.$store.dispatch("update loader", false);
      }
    },
    async createGraph(graphData, label) {
      try {
        await this.$store.dispatch("update graph data", graphData);
        // Clean out the last stored graph instance
        if (this.chartData) await this.chartData.destroy();
        // Get and store new chart data on the Vue instance
        this.chartData = await generatePieChart(this.graphData, label);
      } catch (e) {
        throw new Error(e);
      }
    },
    selectTab(event, endpoint) {
      // Ensure dont we target the children of the main node
      const $el = event.currentTarget;
      const siblings = getDOMSiblings($el);

      siblings.forEach($sibling => $sibling.classList.remove("active"));
      $el.classList.add("active");

      // Let's not fetch data from an endpoint if we
      // have it already in the store
      const isStored = this.$store.getters.setData[endpoint.file];
      const shouldRefetch = this.shouldRefetch;
      
      if (shouldRefetch || !isStored) {
        this.fetchFromEndpoint(endpoint);
      } else {
        this.calculateGraphData(
          this.setData[endpoint.file].cards,
          endpoint.label
        );
      }
    }
  },
  mounted() {
    // Select the first tab
    if (this.autoLoad) this.$refs["graph-tab"][0].click();
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/includes/variables";

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

  &-tabs {
    display: flex;
    flex-wrap: wrap;
    margin: 15px;
    grid-gap: 15px;

    &--tab {
      position: relative;
      border: 1px solid lightgray;
      padding: 10px;
      background-color: white;
      border-radius: 3px;
      appearance: none;
      font-family: $font-family;
      font-size: 16px;
      font-weight: bold;
      flex: 0 0 100%;
      text-align: center;
      cursor: pointer;
      transition: all 0.25s ease-in-out;

      &:hover,
      &.active {
        border-color: $copy-color;
        background-color: $copy-color;
        color: white;
        transform: translateY(3px);
      }

      &.active {
        & {
          position: relative;
          background: $copy-color;
          border: 1px solid $copy-color;
        }

        &:after,
        &:before {
          top: 100%;
          left: 50%;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          position: absolute;
          pointer-events: none;
          border-color: transparent;
          border-top-color: $copy-color;
        }

        &:after {
          border-width: 10px;
          margin-left: -10px;
        }

        &:before {
          border-width: 10px;
          margin-left: -10px;
        }
      }
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

@media (min-width: 570px) {
  .graph-tabs {
    &--tab {
      flex: 1;
    }
  }
}
</style>
