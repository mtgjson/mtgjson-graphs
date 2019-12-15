import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * @todo - Instead of doing an fetch for every endpoint,
 * once the data is stored, it should be looked up first.
 * If the data cant be located in our store then we should
 * fetch it from its proper endpoint. A library structure
 * would be more ideal where the endpoint/file is the key
 */
export const store = new Vuex.Store({
  state: {
    setData: {},
    graphData: {},
    isLoading: true,
  },
  getters: {
    setData: state => state.setData,
    graphData: state => state.graphData,
    isLoading: state => state.isLoading,
  },
  actions: {
    'update set data': async (store, object) => {
      return await store.commit('UPDATE_SET_DATA', object);
    },
    'update graph data': async (store, object) => {
      return await store.commit('UPDATE_GRAPH_DATA', object);
    },
    'update loader': async (store, value) => {
      return await store.commit('UPDATE_LOADER', value);
    },
  },
  mutations: {
    UPDATE_SET_DATA: (state, {file, data}) => {
      state.setData[file] = data;
    },
    UPDATE_GRAPH_DATA: (state, data) => {
      state.graphData = data;
    },
    UPDATE_LOADER: (state, value) => {
      state.isLoading = value;
    },
  },
});
