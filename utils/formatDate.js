export const formatDate = (dateString) => {
	return new Date(dateString).toLocaleDateString("uz-UZ", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
