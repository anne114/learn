export function creatElement() {
  let el = document.createElement("div");
  el.innerHTML = '创建的dom:<input type="text"/>';
  el.addEventListener("click", () => {
    console.log("click");
  });
  return el;
}
