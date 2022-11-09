<template>
    <main>
      <section v-if="$route.params.username">
        <header>
          <h1>Welcome @{{ $route.params.username }}</h1>
        </header>
        <header>
          <div class="left">
            <h2>
              Viewing {{ $route.params.username }}'s feed
              <span v-if="$store.state.filter">
                by @{{ $store.state.filter }}
              </span>
            </h2>
          </div>
          <div class="right">
            <GetFreetsForm
              ref="getFreetsForm"
              value="author"
              placeholder="🔍 Filter by author (optional)"
              button="🔄 Get freets"
            />
          </div>
        </header>

        <div id="depolarize" v-if="$store.state.username === $route.params.username">
          <div>
            Depolarize Value: {{this.$store.state.depolarize}}
          </div>
          <button 
            @click="toggleDepolarizeValue"
          >
            Toggle Depolarize Value
          </button>
        </div>

        <div class="follow">
          <div class="left">
            {{ this.$store.state.followers.length }} {{ this.$store.state.followers.length == 1 ? "Follower" : "Followers"}}
          </div>
          <div class="right">
            {{ this.$store.state.following.length }} {{ "Following"}}

          </div>
        </div>

        <section
          v-if="$store.state.feed.length"
        >
          <FreetComponent
            v-for="freet in $store.state.feed"
            :key="freet.id"
            :freet="freet"
          />
        </section>
        <article
          v-else
        >
          <h3>{{ $route.params.username }}'s feed is empty.</h3>
        </article>
      </section>
    </main>
  </template>
  
  <script>
  import FreetComponent from '@/components/Freet/FreetComponent.vue';
  import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
  
  export default {
    name: 'FreetPage',
    components: {FreetComponent, GetFreetsForm},
    mounted() {
      this.$store.commit("refreshFeed", this.$route.params.username);
      this.$store.commit("refreshFollowers", this.$route.params.username);
      this.$store.commit("refreshFollowing", this.$route.params.username);
      console.log("feed:", this.$store.state.feed);
      console.log("freets:", this.$store.state.freets);
      console.log("profile followers:", this.$store.state.followers);
      console.log("profile following:", this.$store.state.following);
    },
    methods: {
      toggleDepolarizeValue() {
        const params = {
          method: 'PATCH',
          body: JSON.stringify({depolarize: !this.$store.state.depolarize}),
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully changed Depolarize value!', status: 'success'
            });
            // Refresh the feed after successfully changing the depolarize value
            this.$store.commit("refreshFeed", this.$route.params.username);
          }
        };
        this.requestDepolarize(params);
      },
      async requestDepolarize(params) {
        /**
         * Submits a request to the depolarize endpoint
         * @param params - Options for the request
         * @param params.body - Body for the request, if it exists
         * @param params.callback - Function to run if the the request succeeds
         */
        const options = {
          method: params.method, headers: {'Content-Type': 'application/json'}
        };
        if (params.body) {
          options.body = params.body;
        }

        try {
          let r;
          console.log(options);
          r = await fetch(`/api/users`, options);
          
          if (!r.ok) {
            console.log("Failed to change depolarize value");
            const res = await r.json();
            console.log("res is:", res);
          } else {
            const res = await r.json();
            console.log("res from depolarize:", res);
            this.$store.commit("setDepolarize", res.user.depolarize)
            console.log("new depolarize Value is:", this.$store.state.depolarize)
          }

          params.callback();
        } catch (e) {
          console.log("error in depolarize request:", e)
        }
      },
    }
  };
  </script>
  
  <style scoped>
  section {
    display: flex;
    flex-direction: column;
  }
  
  header, header > * {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  h1 {
    font-size: 2em;
  }

  button {
    margin-right: 10px;
  }
  
  section .scrollbox {
    flex: 1 0 50vh;
    padding: 3%;
    overflow-y: scroll;
  }

  .follow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;

  }

  #depolarize {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  </style>
  