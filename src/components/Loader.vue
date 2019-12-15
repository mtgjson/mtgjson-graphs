<template lang="pug">
  .loader(v-if="isLoading")
    div
</template>

<script>
export default {
  name: "Loader",
  computed: {
    isLoading() {
      return this.$store.getters.isLoading;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/includes/variables";

.loader {
  display: inline-block;
  width: 64px;
  height: 64px;
  background-color: white;
  border: 1px solid lightgray;
  border-radius: 64px;
  position: absolute;
  left: auto;
  top: auto;
  right: 20px;
  bottom: 20px;
  z-index: 9;
}

@media (min-width: 800px) {
  .loader {
    right: 30px;
    bottom: 30px;
  }
}

.loader div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid $accent-color;
  border-radius: 50%;
  animation: loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: $accent-color transparent transparent transparent;
}

.loader div:nth-child(1) {
  animation-delay: -0.45s;
}

.loader div:nth-child(2) {
  animation-delay: -0.3s;
}

.loader div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
