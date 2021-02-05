import { database } from "./firebase.js";

var lb = database.ref("leaderboard");
export var leaderbard = [];
lb.orderByValue().on("value", (snapshot) => {
  const data = snapshot.val();
  leaderbard = data
    ? Object.keys(data).map((key) => {
        return [key, data[key]];
      })
    : [];
  leaderbard.sort((a, b) => {
    return b[1] - a[1];
  });
  var ol = document.querySelector("#leaderboard");
  ol.innerHTML = "";
  leaderbard.slice(0, 5).forEach((element) => {
    ol.appendChild(createListItem(element[0], element[1]));
  });
});

function createListItem(name, score) {
  let li = document.createElement("li");
  li.textContent = `${name}: ${score}`;
  return li;
}

export function uploadscore(score) {
  var name = document.getElementById("fname").value;

  if (name !== "") {
    database
      .ref("leaderboard/" + name)
      .once("value")
      .then((snapshot) => {
        // if player not on board, check if need to remove player
        if (!snapshot.val()) {
          var rn = "";
          if (leaderbard.length >= 5) {
            var last = leaderbard[4];
            if (score <= last[1]) {
              return;
            }
            rn = last[0];
          }
          if (rn !== "") {
            database.ref("leaderboard/" + rn).remove();
          }
        } else if (snapshot.val() >= score) {
          return;
        }
        database.ref("leaderboard/" + name).set(score);
      });
  }
}
