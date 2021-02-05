import { database } from "./firebase.js";

var lb = database.ref("leaderboard");
var leaderbard = {};
lb.on("value", (snapshot) => {
  const data = snapshot.val();
  leaderbard = Object.keys(data).map((key) => {
    return [key, data[key]];
  });
  leaderbard.sort((a, b) => {
    return b[1] - a[1];
  });
  var ol = document.getElementsByName("leaderboard");
  ol.innerHTML = "";
  ol = document.querySelector("#leaderboard");
  leaderbard.forEach((element) => {
    ol.appendChild(createListItem(element[0], element[1]));
  });
  console.log(leaderbard);
});

function createListItem(name, score) {
  let li = document.createElement("li");
  li.textContent = `${name}: ${score}`;
  return li;
}
