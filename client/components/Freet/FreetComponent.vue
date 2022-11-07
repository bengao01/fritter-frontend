<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="freet"
  >
    <header>
      <h3 class="author">
        @{{ freet.author }}
      </h3>
      <div
        v-if="$store.state.username === freet.author"
        class="actions"
      >
        <button
          v-if="editing"
          @click="submitEdit"
        >
          ✅ Save changes
        </button>
        <button
          v-if="editing"
          @click="stopEditing"
        >
          🚫 Discard changes
        </button>
        <button
          v-if="!editing"
          @click="startEditing"
        >
          ✏️ Edit
        </button>
        <button @click="deleteFreet">
          🗑️ Delete
        </button>
      </div>
      <div
        v-if="$store.state.username"
        class="actions"
      >
        <button 
          v-if="!liked"
          @click="addLike"
        >
          👍 Like
        </button>
        <button 
          v-if="liked"
          @click="removeLike"
        >
          Remove Like
        </button>
        <button 
          v-if="!downvoted"
          @click="addDownvote"
        >
          ⬇ Downvote
        </button>
        <button 
          v-if="downvoted"
          @click="removeDownvote"
        >
          Remove Downvote
        </button>
        <div
          v-if="$store.state.username"
          class="actions"
        >
          <button 
          v-if="!followed && this.freet.author != $store.state.username"
          @click="addFollow"
          >
            Follow
          </button>
          <button 
            v-if="followed"
            @click="removeFollow"
          >
            Unfollow
          </button>
        </div>
      </div>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p
      v-else
      class="content"
    >
      {{ freet.content }}
    </p>
    <p class="info">
      Posted at {{ freet.dateModified }}
      <i v-if="freet.edited">(edited)</i>
    </p>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>
export default {
  name: 'FreetComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    }
  },
  created() {
    const params = {
        method: 'GET',
        message: 'Successfully fetched object!',
        callback: () => {
          // this.$set(this.alerts, params.message, 'success');
          // setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
    // If the user is logged in, we want to see if they have liked or downvoted the Freets
    if (this.$store.state.username != null) {
      this.requestLike(params);
      this.requestDownvote(params);
      this.setFollowing();
      console.log("setting following");
    }
  },
  data() {
    return {
      liked: null,
      downvoted: null,
      likeCount: null,
      followed: false,
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    setFollowing() {
      console.log("Stored following value:", this.$store.state.following);
      // If the current user is already following the owner of this Freet,
      const author = this.freet.author;
      this.followed = this.$store.state.following.some(function(element, index) {
        return element.followee === author;
      });
      console.log("freet is:", this.freet.author);
      console.log("followed value in setFollowing method:", this.followed);
    },
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    addLike() {
      const params = {
        method: 'POST',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully added like!', status: 'success'
          });
          this.liked = true;
        },
        body: JSON.stringify({"freetId" : this.freet._id})
      };
      this.requestLike(params);
    },
    removeLike() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully removed like!', status: 'success'
          });
          this.liked = false;
        }
      };
      this.requestLike(params);
    },
    addDownvote() {
      const params = {
        method: 'POST',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully added downvote!', status: 'success'
          });
          this.downvoted = true;
        },
        body: JSON.stringify({"freetId" : this.freet._id})
      };
      this.requestDownvote(params);
    },
    removeDownvote() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully removed downvote!', status: 'success'
          });
          this.downvoted = false;
        }
      };
      this.requestDownvote(params);
    },
    addFollow() {
      const params = {
        method: 'POST',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully added follow!!', status: 'success'
          });
          this.followed = true;
        },
        body: JSON.stringify({"follower" : this.$store.state.username, "followee" : this.freet.author})
      };
      this.requestFollow(params);
    },
    removeFollow() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully removed follow!', status: 'success'
          });
          this.followed = false;
        }
      };
      this.requestFollow(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
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
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
    async requestLike(params) {
      /**
       * Submits a request to the like's endpoint
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
        if(options.method === "POST") {
          console.log(options);
          r = await fetch(`/api/likes`, options);
        } else if (options.method === "DELETE" || options.method === "GET") {
          r = await fetch(`/api/likes?freetId=${this.freet._id}`, options);
        }
        if (!r.ok) {
          if(options.method === "GET"){
            console.log("Like doesn't exist");
            this.liked = false;
          }
          const res = await r.json();
          throw new Error(res.error);
        } else if (options.method === "GET") {
          // Like exists so we can show the user liked this
          this.liked = true;
        }

        params.callback();
      } catch (e) {
        console.log("error in like request:", e)
      }
    },
    async requestDownvote(params) {
      /**
       * Submits a request to the downvote's endpoint
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
        if(options.method === "POST") {
          console.log(options);
          r = await fetch(`/api/downvotes`, options);
        } else if (options.method === "DELETE" || options.method === "GET") {
          console.log(options);

          r = await fetch(`/api/downvotes?freetId=${this.freet._id}`, options);
        }
        if (!r.ok) {
          if(options.method === "GET"){
            console.log("Downvote doesn't exist");
            this.downvoted = false;
          }
          const res = await r.json();
          // console.log("res is:", res);
        } else if (options.method === "GET") {
          // Downvote exists so we can show the user downvoted this
          this.downvoted = true;
        }

        params.callback();
      } catch (e) {
        console.log("error in downvote request:", e)
      }
    },
    async requestFollow(params) {
      /**
       * Submits a request to the follow endpoint
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
        if(options.method === "POST") {
          console.log(options);
          r = await fetch(`/api/follow`, options);
        } else if (options.method === "DELETE") {
          console.log(options);

          r = await fetch(`/api/follow?follower=${this.$store.state.username}&followee=${this.freet.author}`, options);
        }
        if (!r.ok) {
          // Follow request failed
          // Reinitialize what the followed variable is and refresh follows
          const res = await r.json();
          console.log("Failed to make request to follow endpoint", res.error);

          this.$store.commit("refreshFollowing", this.$store.state.username);
          this.$store.commit("refreshFollowers", this.$store.state.username);
          this.setFollowing();
        } else if (options.method === "POST" || options.method === "DELETE") {
          // Follow was successfully added or removed, so we can reinitialize the followed variable and update our following state
          this.$store.commit("refreshFollowing", this.$store.state.username);
          this.$store.commit("refreshFollowers", this.$store.state.username);
          this.setFollowing();
        }

        params.callback();
      } catch (e) {
        console.log("error in downvote request:", e)
      }
    }
  }
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    position: relative;
}
</style>
