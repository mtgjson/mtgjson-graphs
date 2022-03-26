import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    setData: {},
    setsData: [],
    graphData: {},
    isLoading: true,
  },
  getters: {
    setData: state => state.setData,
    setsData: state => state.setsData,
    graphData: state => state.graphData,
    isLoading: state => state.isLoading,
  },
  actions: {
    UPDATE_SET_DATA: (store, object) => {
      store.commit('SET_SET_DATA', object);
    },
    UPDATE_SETS_DATA: async (store, url) => {
      try {
        const awaited = await fetch(url);
        const { data } = await awaited.json();

        return store.commit('SET_SETS_DATA', data);
      } catch (err) {
        console.error(err);
      }
    },
    UPDATE_GRAPH_DATA: (store, object) => {
      store.commit('SET_GRAPH_DATA', object);
    },
    UPDATE_LOADER: (store, value) => {
      store.commit('SET_LOADER', value);
    },
  },
  mutations: {
    SET_SET_DATA: (state, { setCode, setData }) => {
      state.setData[setCode] = setData;
    },
    SET_SETS_DATA: (state, data) => {
      state.setsData = data;
    },
    SET_GRAPH_DATA: (state, data) => {
      state.graphData = data;
    },
    SET_LOADER: (state, value) => {
      state.isLoading = value;
    },
  },
});
