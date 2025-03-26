/**
 * Service for validating post data
 */
export class PostValidationService {
	static validatePost(post) {
		const errors = {};

		if (!post.title?.trim()) {
			errors.title = "Title is required";
		}

		if (!post.category_id) {
			errors.category_id = "Category is required";
		}

		if (post.status === "scheduled" && !post.publish_at) {
			errors.publish_at = "Publish date is required for scheduled posts";
		}

		return {
			isValid: Object.keys(errors).length === 0,
			errors,
		};
	}

	static validateUpdateStatus(status) {
		const validStatuses = ["draft", "published", "scheduled"];
		if (!validStatuses.includes(status)) {
			return {
				isValid: false,
				error: "Invalid status value",
			};
		}
		return {
			isValid: true,
		};
	}
}

export default PostValidationService;
