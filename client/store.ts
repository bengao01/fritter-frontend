import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    feed: [],
    followers: [],
    following: [],
    articles: [],
    depolarize: null
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setDepolarize(state, depolarize) {
      /**
       * Update the stored depolarize value to the specified one.
       * @param depolarize - new depolarize to set
       */
      state.depolarize = depolarize;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    updateFollowing(state, following) {
      /**
       * Update the stored list of accounts the user is following to the provided following list.
       * @param following - list of following accounts to store
       */
      if (state.username != null) {
        state.following = following;
      } else {
        state.following = [];
      }
    },
    async refreshFollowing(state, username) {
      /**
       * Request the server for the users the current logged in user is following.
       */
      // If the user is logged in, make the request and update. Otherwise, set following users list to empty
      if (state.username != null) {
        const url = `/api/follow/following?user=${username}`;
        const res = await fetch(url).then(async r => r.json());
        state.following = res;
      } else {
        state.following = [];
      }
    },
    updateFollowers(state, followers) {
      /**
       * Update the stored list of accounts who follow the user
       * @param followers - list of followers to store
       */
       if (state.username != null) {
        state.followers = followers;
      } else {
        state.followers = [];
      }
    },
    async refreshFollowers(state, username) {
      /**
       * Request the server for the users the current logged in user is following.
       */
      // If the user is logged in, make the request and update. Otherwise, set following users list to empty
      if (state.username != null) {
        const url = `/api/follow/followers?followee=${username}`;
        const res = await fetch(url).then(async r => r.json());
        state.followers = res;
      } else {
        state.followers = [];
      }
    },
    updateFeed(state, feed) {
      /**
       * Update the list of freets in the user's feed
       * @param feed - list of freets to store in the feed
       */
       if (state.username != null) {
        state.feed = feed;
      } else {
        state.feed = [];
      }
    },
    async refreshFeed(state, username) {
      /**
       * Request the server for the user's feed
       */
      const url = `/api/follow/feed?user=${username}`;
      const res = await fetch(url).then(async r => r.json());
      state.feed = res;
      console.log("feed is:", res);
      console.log("feed fetched for", username);
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
