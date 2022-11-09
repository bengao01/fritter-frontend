<!-- Form for creating articles (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateArticleForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/articles',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'title', label: 'Title', value: ''},
        {id: 'content', label: 'Content', value: ''},
    ],
      title: 'Upload Article',
      refreshArticles: true,
      callback: () => {
        const message = 'Successfully created a new Article!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
