const baseURL = 'https://5b442f7c2340950014c4553f.mockapi.io/api/v1/';

new Vue({
	el: '#app',
	data: {
		posts: [],
		singlePost: null,
		isSinglePost: false,
		columns: [
			'Index',
			'Title',
			'Description',
			'Image',
			'Edit',
			'Remove',
			'Detail',
		],
		loading: true,
		input: {
			title: '',
			description: '',
			image: '',
		},
		currentRow: null,
		currentIndex: null,
		isEditing: false,
		clone: null,
		editInput: { title: '', description: '', image: '' },
	},
	methods: {
		//CREATE
		add: function (e) {
			e.preventDefault();
			const { title, description, image } = this.input;

			if (!description || !title || !image) {
				alert('Empty fields');
				return;
			}

			axios
				.post(`${baseURL}/posts`, {
					title,
					description,
					image,
				})
				.then((res) => {
					this.posts.push({ title, description, image });
					alert('CREATE SUCCESS');
					window.scrollTo(0, document.body.scrollHeight);
				})
				.catch((err) => console.log(err));
		},
		//PUT
		editFormTrigger: function (index) {
			this.isEditing = true;
			//Trigger edit form
			this.crrentRow = this.$refs.rows[index];
			this.currentIndex = index;

			//Assign current row's value to form
			Object.keys(this.editInput).forEach(
				(key) => (this.editInput[key] = this.posts[index][key])
			);
			scrollToTop();
		},
		editFormSubmit: function () {
			const editData = {};

			const { y } = this.$refs.rows[this.currentIndex].getBoundingClientRect();

			//Compare o ld value and new value
			if (Object.values(this.editInput).includes('')) {
				alert('Empty fields');
				return;
			}

			Object.keys(this.editInput).forEach((key) => {
				if (this.editInput[key] !== this.posts[this.currentIndex][key]) {
					editData[key] = this.editInput[key];
					this.posts[this.currentIndex][key] = editData[key];
				}
			});

			if (!Object.keys(editData).length) {
				this.isEditing = false;
				Object.keys(this.editInput).forEach((key) => {
					this.editInput[key] = '';
				});
				alert('Nothing change!');
				return;
			}

			axios
				.put(`${baseURL}/posts/${this.posts[this.currentIndex].id}`, {
					...editData,
				})
				.then((res) => {
					Object.keys(this.editInput).forEach((key) => {
						this.editInput[key] = '';
					});
					this.isEditing = false;
					alert('EDIT SUCCESS');
					window.scrollTo(0, y);
				})
				.catch((err) => console.log(err));
		},
		//DELETE
		remove: function (index, id) {
			let isDelete = confirm('Confirm delete?');
			if (!isDelete) return;
			axios
				.delete(`${baseURL}/posts/${id}`)
				.then((res) => {
					console.log(res);
					this.posts.splice(index, 1);
					alert('DELETE SUCCESS');
				})
				.catch((err) => {
					console.error(err);
				});
		},
		//READ
		getAll: function () {
			axios
				.get(`${baseURL}/posts`)
				.then((response) => {
					this.posts = response.data;
					this.clone = [...this.posts];
				})
				.catch((error) => {
					console.log(error);
				})
				.finally((_) => (this.loading = false));
		},
		getOne: function (id) {
			axios
				.get(`${baseURL}/posts/${id}`)
				.then((response) => {
					this.singlePost = response.data;
				})
				.catch((error) => {
					console.log(error);
				})
				.finally((_) => {
					this.loading = false;
					this.isSinglePost = true;
				});
		},
	},

	mounted() {
		this.loading = true;
		this.getAll();
	},
});
