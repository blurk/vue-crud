Vue.component('single-post', {
	props: ['post'],
	template: `
    <div class="card m-auto" style="width: 18rem;">
      <img class="card-img-top" :src="post.image" alt="alt">
      <div class="card-body">
    <h5 class="card-title">{{post.title}}</h5>
    <p class="card-text">{{post.description}}</p>
    <p>{{new Date(post.createdAt)}}</p>
  </div>
  `,
});
