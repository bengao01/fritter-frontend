<template>
  <p>
    @{{ this.follower ? this.follow.follower : this.follow.followee }}
  </p>
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
p {
  margin: 0px;
}
</style>
  