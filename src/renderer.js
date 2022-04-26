const debounce = require("debounce");
const moment = require("moment-timezone");
const Store = require("electron-store");

/* constants */
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
moment.tz.setDefault(timezone);

/* Init Store */
const store = new Store();
const savedText = store.get("postit") || "";
const postitAlign = store.get("postit-align") || "center";
const lastEditedDate =
  store.get("postit-lastEdited") || moment().format("YYYY-MM-DD hh:mm:ss");

/* HTML Elements */
const postit = document.querySelector("textarea");
const wordCount = document.querySelector("#word-count");
const alignLeft = document.querySelector("#align-left");
const alignCenter = document.querySelector("#align-center");
const alignRight = document.querySelector("#align-right");
const lastEdited = document.querySelector("#last-edited span");

const setLastEdited = () => {
  const now = moment().format("YYYY-MM-DD hh:mm:ss");
  lastEdited.textContent = now;
  store.set("postit-lastEdited", now);
};

const setWordCount = count => {
  wordCount.textContent = count;
};

/* Event Listeners */
alignLeft.addEventListener("click", () => {
  postit.style.textAlign = "left";
  store.set("postit-align", "left");
});
alignCenter.addEventListener("click", () => {
  postit.style.textAlign = "center";
  store.set("postit-align", "center");
});
alignRight.addEventListener("click", () => {
  postit.style.textAlign = "right";
  store.set("postit-align", "right");
});
postit.addEventListener("keyup", event => {
  store.set("postit", event.target.value);
  setWordCount(postit.value.length);
});
window.onresize = debounce(() => {
  store.set("postit-width", window.innerWidth);
  store.set("postit-height", window.innerHeight);
}, 200);

postit.onkeydown = debounce(setLastEdited, 400);

/* Load saved values on render */
lastEdited.textContent = lastEditedDate;
postit.value = savedText;
postit.style.textAlign = postitAlign;
setWordCount(postit.value.length);
