import "./styles.css";

interface NavItem {
  text: string;
  slug: string;
}

const navMenuData: NavItem[] = [
  { text: "Home", slug: "/" },
  { text: "Documentation", slug: "/docs/" },
  { text: "FreeCell", slug: "/freecell/" },
  { text: "Flash Card", slug: "/flashCard/" },
];

const navMenu = (data: NavItem[]): void => {
  const nav = document.createElement("nav");
  nav.className = "nav";

  const menuList = document.createElement("ul");
  menuList.className = "list";

  // Create mobile nav button
  const mobileButton = (() => {
    nav.setAttribute("data-open", "false");
    const element = document.createElement("button");

    element.innerHTML = `
    <label for="check">
      <input type="checkbox" id="check"/> 
      <span></span>
      <span></span>
      <span></span>
    </label>
    `;

    element.classList.add("mobile-button");

    const checkbox = element.children[0].getElementsByTagName("input")[0];

    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      if (checkbox.checked === true) {
        nav.setAttribute("data-open", "true");
      } else {
        nav.setAttribute("data-open", "false");
      }
    });

    return element;
  })();

  const createMenuItem = (item: NavItem): HTMLLIElement => {
    const listItem = document.createElement("li");
    listItem.className = "nav__item";

    const link = document.createElement("a");
    link.className = "nav__link";
    link.href = item.slug;
    link.textContent = item.text;

    if (window.location.pathname === item.slug) {
      link.classList.add("nav__link--active");
    }

    listItem.appendChild(link);
    return listItem;
  };

  const menuItems = data.map(createMenuItem);
  menuItems.forEach((item) => menuList.appendChild(item));

  nav.appendChild(mobileButton);
  nav.appendChild(menuList);

  const navTarget = document.body.firstElementChild;
  if (navTarget) {
    navTarget.prepend(nav);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  navMenu(navMenuData);
});
