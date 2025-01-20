import "./styles/style.css";

interface NavItem {
	text: string;
	slug: string;
}

const navMenuData: NavItem[] = [
	{
		text: "Documentation",
		slug: "/docs/",
	},
	{
		text: "Single Card Testing",
		slug: "/card/",
	},
];

const navMenu = document.getElementById("nav-menu");

const navLinks = navMenuData.map((item: NavItem) => {
	const listElement = document.createElement("li");
	const anchorElement = document.createElement("a");

	anchorElement.href = item.slug;
	anchorElement.textContent = item.text;

	listElement.appendChild(anchorElement);
	return listElement;
});

if (navMenu) {
	navLinks.forEach((link) => navMenu.appendChild(link));
}

