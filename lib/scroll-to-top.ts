export default function scrollToTop() {
	setTimeout(() => {
		window && window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}, 0);
}
