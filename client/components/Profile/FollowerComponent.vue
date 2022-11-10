<template>
  <div v-if="this.follower">
    <router-link style="text-decoration: none; font-weight: 300;" class="author" :to="`/profile/${this.follow.follower}`">
      @{{ this.follow.follower }}
    </router-link>
  </div>
  <div v-else>
    <router-link style="text-decoration: none; font-weight: 300;" class="author" :to="`/profile/${this.follow.followee}`">
      @{{ this.follow.followee }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'FollowerComponent',
  props: {
    // Data from the stored follow
    follow: {
      type: Object,
      required: true
    },
    // boolean for if we are displaying the user's follower or who they are following
    follower: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    console.log("following username is:", this.follow.follower);
  },
  methods: {
    
  }
};
</script>
  
<style scoped>
.author {
  color: #1DA1F2;
}

p {
  margin: 0px;
}
</style>
  