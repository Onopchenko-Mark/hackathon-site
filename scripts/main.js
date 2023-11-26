import { positions } from "./logoModels";
import processItem from "./logoModels";
import gsap from "gsap";

const nav_items = document.querySelectorAll(".nav_text");
const t1 = gsap.timeline({ defaults: { duration: 0.4 } });

nav_items.forEach((item) => {
  item.addEventListener("click", () => {
    nav_items.forEach((item) => {
      item.classList.remove("selected");
    });
    item.classList.add("selected");
    t1.to(document.querySelector(".abs-wrapper"), {
      duration: 1,
      bottom: "0",
    });
    processItem(positions[0]);
  });
});

const rButtons = document.querySelectorAll(".right-btn");
rButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const l = positions.length;

    // Shifts first element to the last element's position
    const fCoords = positions[0].position;
    const lCoords = positions[l - 1].position;
    t1.fromTo(
      positions[0].position,
      { x: fCoords.x, y: fCoords.y, z: fCoords.z },
      { x: lCoords.x, y: lCoords.y, z: lCoords.z }
    );

    let prevPos = fCoords;
    for (let i = 1; i < l; i++) {
      const curPos = positions[i].position;

      t1.fromTo(
        positions[i].position,
        { x: curPos.x, y: curPos.y, z: curPos.z },
        { x: prevPos.x, y: prevPos.y, z: prevPos.z }
      );

      prevPos = curPos;
    }

    positions.push(positions[0]);
    positions.shift();

    processItem(positions[0]);
  });
});

const lButtons = document.querySelectorAll(".left-btn");
lButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const l = positions.length;

    // Shifts first element to the last element's position
    const fCoords = positions[0].position;
    const nextPos = positions[1].position;
    t1.fromTo(
      positions[0].position,
      { x: fCoords.x, y: fCoords.y, z: fCoords.z },
      { x: nextPos.x, y: nextPos.y, z: nextPos.z }
    );

    let prevPos = fCoords;
    for (let i = l - 1; i > 0; i--) {
      const curPos = positions[i].position;

      t1.fromTo(
        positions[i].position,
        { x: curPos.x, y: curPos.y, z: curPos.z },
        { x: prevPos.x, y: prevPos.y, z: prevPos.z }
      );

      prevPos = curPos;
    }

    positions.unshift(positions[l - 1]);
    positions.pop();

    processItem(positions[0]);
  });
});
