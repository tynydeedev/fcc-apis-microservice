const navBar = document.getElementById('nav');
const links = document.getElementsByClassName('nav-link');
console.log(links);
const button = document.getElementById('drop-down');

button.addEventListener('click', () => {
	if (navBar.classList.contains('active')) {
		navBar.classList.remove('active');
	} else {
		navBar.classList.add('active');
	}
});