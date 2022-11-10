<!-- Reusable component representing a single article and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article
      class="article"
    >
      <header>
        <div id="freetHeader">
          <h3 class="title">
            {{ article.title }}
          </h3>
          <div
            id = "freetHeaderActions"
            v-if="$store.state.username === 'admin'"
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
            <button @click="deletearticle">
              🗑️ Delete
            </button>
          </div>
        </div>
        
        <p class="info" id="date">
          {{ article.dateModified }}
          <i v-if="article.edited">(edited)</i>
        </p>
        
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
        {{ article.content }}
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
    name: 'articleComponent',
    props: {
      // Data from the stored article
      article: {
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
    },
    data() {
      return {
        editing: false, // Whether or not this article is in edit mode
        draft: this.article.content, // Potentially-new content for this article
        alerts: {} // Displays success/error messages encountered during article modification
      };
    },
    methods: {
      startEditing() {
        /**
         * Enables edit mode on this article.
         */
        this.editing = true; // Keeps track of if a article is being edited
        this.draft = this.article.content; // The content of our current "draft" while being edited
      },
      stopEditing() {
        /**
         * Disables edit mode on this article.
         */
        this.editing = false;
        this.draft = this.article.content;
      },
      deletearticle() {
        /**
         * Deletes this article.
         */
        const params = {
          method: 'DELETE',
          callback: () => {
            this.$store.commit('alert', {
              message: 'Successfully deleted article!', status: 'success'
            });
          }
        };
        this.requestArticle(params);
      },
      submitEdit() {
        /**
         * Updates article to have the submitted draft content.
         */
        if (this.article.content === this.draft) {
          const error = 'Error: Edited article content should be different than current article content.';
          this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
          setTimeout(() => this.$delete(this.alerts, error), 3000);
          return;
        }
  
        const params = {
          method: 'PATCH',
          message: 'Successfully edited article!',
          body: JSON.stringify({content: this.draft}),
          callback: () => {
            this.$set(this.alerts, params.message, 'success');
            setTimeout(() => this.$delete(this.alerts, params.message), 3000);
          }
        };
        this.requestArticle(params);
      },
      async requestArticle(params) {
        /**
         * Submits a request to the article's endpoint
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
          const r = await fetch(`/api/articles/${this.article._id}`, options);
          if (!r.ok) {
            const res = await r.json();
            console.log("error was:", res);
            throw new Error(res.error);
          }
  
          this.editing = false;
          this.$store.commit('refreshArticles');
  
          params.callback();
        } catch (e) {
          this.$set(this.alerts, e, 'error');
          setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
      },
    }
  };
  </script>
  
<style scoped>
.article {
  border: 1px solid #111;
  border-radius: 25px;
  padding: 20px;
  position: relative;
  margin: 10px;
}

button {
  border-radius: 20px;
  border: .75px solid #111;
  font-size: medium;
  padding: 5px;
  margin: 5px;

  /* hover effects */
  cursor: pointer;
  transition-duration: 0.4s;
}

button:hover {
  box-shadow: #111;
  animation: pulse 1s;
  box-shadow: 0 0 0 2em transparent;
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19);
}
.info {
  font-size: 1.1em;
}

.content, textarea {
  font-size: 1.3em;
}

.title {
  font-size: 1.4em;
  color: #1DA1F2;
}

#date {
  position: relative;
  margin-top: 0px;
  margin-bottom: 20px;
}

#freetHeader {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

#freetHeaderActions {
  margin: 10px;
  position: relative;
  top: 12px;
  left: 15px;
  color: #F5F8FA;
}

#button {
  background-color: #1DA1F2;
  color: #F5F8FA;
}


</style>
  