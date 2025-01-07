export function scrollBehavior(event) {
  if (event.target.tagName === "A") {
    let targetId = event.target.getAttribute("href");
    targetId = targetId.slice(1, targetId.length); // Because, for example, #s5.1 is not valid id
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }
}
