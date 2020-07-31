// Navbar
const newEntryBtn = document.getElementById("new-entry");
// Display
const banner = document.getElementById("banner");
const formField = document.getElementById("form-field");
const dashboard = document.getElementById("dashboard");
const calendar = document.getElementById("calendar");
const friendMenu = document.getElementById("friend-menu");
// Entry Forms
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const editBtn = document.getElementById("patch");
const submitBtn = document.getElementById("done");

//////////////
// ON LOAD //
////////////
document.addEventListener("DOMContentLoaded", () => {
  promptUserInfo();
});

/////////////////////////////////////////////
/////////////// LOGIN & LANDING ///////////////
/////////////////////////////////////////////
function promptUserInfo() {
  const welcome = document.createElement("h1");
  const userForm = document.createElement("form");
  const nameInput = document.createElement("input");
  const subBtn = document.createElement("button");
  nameInput.name = "name";
  subBtn.type = "submit";
  subBtn.innerHTML = `<i class="fas fa-arrow-circle-right fa-2x"></i>`;
  userForm.appendChild(nameInput);
  userForm.appendChild(subBtn);
  welcome.innerText = "Hello, what's your name?";
  banner.appendChild(welcome);
  formField.appendChild(userForm);
  formField.addEventListener("submit", (e) => {
    e.preventDefault();
    sendLogIn(userForm);
  });
}

function sendLogIn(userForm) {
  const postRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(userForm.name.value),
  };
  fetch("http://localhost:3000/login", postRequest)
    .then((response) => response.json())
    .then((user) => renderDashboard(user));
}

function renderDashboard(user) {
  console.log(user);
  const date = document.getElementById("date");
  date.innerText = moment().format("ll");
  banner.innerHTML = ``;
  formField.innerHTML = ``;
  const welcomeMessage = document.createElement("h2");
  const dailyQuote = document.createElement("h3");
  welcomeMessage.innerText = `Welcome, ${user.name}.`;
  dailyQuote.innerText = fetchQuote();
  banner.appendChild(welcomeMessage);
  banner.appendChild(dailyQuote);
  renderCalendar(user);
  renderFriendMenu(user);
  setUser(user);
  toggleModal();
}

function setUser(user) {
  const entryForm = document.getElementById("entry-form");
  entryForm.dataset.userId = user.id;
}

/////////////////////////////////////////////
/////////////// DASHBOARD ///////////////
/////////////////////////////////////////////
function renderCalendar(user) {
  const calendar = new Calendar("#calendar", user.entries);
}

function renderFriendMenu(user) {
  user.friends.forEach((friend) => {
    renderFriend(user, friend);
  });
}

function renderFriend(user, friend) {
  const friendCard = createElement("div", "friend-card");
  const name = createElement("h4", "card-name", friend.name);
  const affirmBtn = createElement("button", "affirm-btn");
  affirmBtn.innerHTML = `<i class="fas fa-fist-raised"></i>`;
  const deleteBtn = createElement("button", "delete-btn");
  deleteBtn.innerHTML = `<i class="fas fa-user-slash"></i>`;
  friendCard.appendChild(name);
  friendCard.appendChild(affirmBtn);
  friendCard.appendChild(deleteBtn);

  friendMenu.appendChild(friendCard);

  affirmBtn.addEventListener("click", () => {
    renderAffirm(user, friend, friendCard);
  });
  deleteBtn.addEventListener("click", () => {
    deleteFriendship(user, friend);
  });
}

function deleteFriendship(user, friend) {
  let friendshipToDelete;
  user.friendships.forEach((friendship) => {
    if (
      friendship.friender_id == friend.id ||
      friendship.friendee_id == friend.id
    ) {
      friendshipToDelete = friendship.id;
    }
  });

  const deleteRequest = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  fetch(
    `http://localhost:3000/friendships/${friendshipToDelete}`,
    deleteRequest
  )
    .then((response) => response.json())
    .then(console.log);
}

/////////////////////////////////////////////
/////////////// AFFIRMATIONS ///////////////
/////////////////////////////////////////////

function renderAffirm(user, friend, friendCard) {
  const miniFormDiv = createElement("div", "mini-form-div");
  const miniForm = createElement("form", "mini-form");
  const textField = createElement("input", "message", `Dear ${friend.name}, `);
  textField.name = "message";
  const subBtn = createElement("input");
  subBtn.type = "submit";
  miniForm.appendChild(textField);
  miniForm.appendChild(subBtn);
  miniFormDiv.appendChild(miniForm);
  insertAfter(miniFormDiv, friendCard);
  miniForm.addEventListener("submit", (e) => {
    e.preventDefault();
    postAffirmation(user, friend, miniForm);
    miniFormDiv.remove();
  });
}

function postAffirmation(user, friend, miniForm) {
  const affirmObj = {
    sender_id: user.id,
    recipient_id: friend.id,
    message: miniForm.message.value,
  };

  const postRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(affirmObj),
  };

  fetch("http://localhost:3000/affirmations", postRequest)
    .then((response) => response.json())
    .then(console.log);
}

function fetchQuote() {
  return "Don't judge each day by the harvest you reap but by the seeds that you plant. -Robert Louis Stevenson";
}

/////////////////////////////////////////////
///////////// MODAL ENTRY FORM ///////////////
/////////////////////////////////////////////

function toggleModal() {
  modal.classList.toggle("show-modal");
}

function toggleEdit() {
  editBtn.classList.toggle("hidden");
  submitBtn.classList.toggle("hidden");
}

editBtn.addEventListener("click", () => {
  patchEntry(entryForm);
});

closeButton.addEventListener("click", () => {
  toggleModal();
  if (!editBtn.classList.contains("hidden")) {
    toggleEdit();
  }
});

const entryForm = document.getElementById("entry-form");
newEntryBtn.addEventListener("click", () => {
  toggleModal();
  entryForm.narrative.value = "I'm feeling...";
});

entryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  postEntry(entryForm);
});

function postEntry(entryForm) {
  const formFields = {
    user_id: entryForm.dataset.userId,
    mood: entryForm.mood.value,
    narrative: entryForm.narrative.value.trim(),
  };

  const postRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formFields),
  };

  fetch("http://localhost:3000/entries", postRequest)
    .then((response) => response.json())
    .then(console.log);

  toggleModal();
}

function editEntry(entry, span) {
  entryForm.dataset.entryId = entry.id;
  entryForm.mood.value = entry.mood;
  entryForm.narrative.innerHTML = entry.narrative;
  toggleModal();
  toggleEdit();
}

function patchEntry(entryForm) {
  const entryObj = {
    mood: entryForm.mood.value,
    narrative: entryForm.narrative.value.trim(),
  };
  const patchRequest = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accepts: "application/json",
    },
    body: JSON.stringify(entryObj),
  };
  fetch(
    `http://localhost:3000/entries/${entryForm.dataset.entryId}`,
    patchRequest
  )
    .then((response) => response.json())
    .then((entry) => updateEntry(entry));
  toggleEdit();
  toggleModal();
}

function updateEntry(entry) {
  const entryDisplay = document.querySelector(`[data-id~="${entry.id}"]`);
  entryDisplay.innerText = entry.narrative;
}
//////////////////////////
/////// CALENDAR ////////
///////////////////////


let today = moment();

// Constructor
function Calendar(selector, entries) {
  this.el = document.querySelector(selector);
  this.entries = entries;
  this.current = moment().date(1);
  this.draw(); // line 20
  const current = document.querySelector(".today");
}
// Functions
Calendar.prototype.draw = function () {
  //Create Header
  this.drawHeader();
  //Draw Month
  this.drawMonth();
};

Calendar.prototype.drawHeader = function () {
  const self = this;
  if (!this.header) {
    //Create the header elements
    this.header = createElement("div", "header");
    this.header.className = "header";

    this.title = createElement("h1");

    const right = createElement("div", "right");
    right.innerHTML = `<i class="fas fa-arrow-right"></i>`;
    right.addEventListener("click", function () {
      self.nextMonth();
    });

    const left = createElement("div", "left");
    left.innerHTML = `<i class="fas fa-arrow-left"></i>`;
    left.addEventListener("click", function () {
      self.prevMonth();
    });

    //Append the Elements
    this.header.appendChild(left);
    this.header.appendChild(this.title);
    this.header.appendChild(right);
    this.el.appendChild(this.header);
  }

  this.title.innerHTML = this.current.format("MMMM YYYY");
};

Calendar.prototype.drawMonth = function () {
  const self = this;

  if (this.entries) {
    this.entries.forEach((entry) => {
      entry.date = moment(
        entry.created_at.substring(0, entry.created_at.length - 1)
      );
    });
  }

  if (this.month) {
    this.oldMonth = this.month;
    this.oldMonth.className = "month out " + (self.next ? "next" : "prev");
    this.oldMonth.addEventListener("webkitAnimationEnd", function () {
      self.oldMonth.parentNode.removeChild(self.oldMonth);
      self.month = createElement("div", "month");
      self.backFill();
      self.currentMonth();
      self.fowardFill();
      self.el.appendChild(self.month);
      window.setTimeout(function () {
        self.month.className = "month in " + (self.next ? "next" : "prev");
      }, 16);
    });
  } else {
    this.month = createElement("div", "month");
    this.el.appendChild(this.month);
    this.backFill();
    this.currentMonth();
    this.fowardFill();
    this.month.className = "month new";
  }
};

Calendar.prototype.backFill = function () {
  const clone = this.current.clone();
  const dayOfWeek = clone.day();

  if (!dayOfWeek) {
    return;
  }

  clone.subtract("days", dayOfWeek + 1);

  for (let i = dayOfWeek; i > 0; i--) {
    this.drawDay(clone.add("days", 1));
  }
};

Calendar.prototype.fowardFill = function () {
  const clone = this.current.clone().add("months", 1).subtract("days", 1);
  const dayOfWeek = clone.day();

  if (dayOfWeek === 6) {
    return;
  }

  for (let i = dayOfWeek; i < 6; i++) {
    this.drawDay(clone.add("days", 1));
  }
};

Calendar.prototype.currentMonth = function () {
  const clone = this.current.clone();

  while (clone.month() === this.current.month()) {
    this.drawDay(clone);
    clone.add("days", 1);
  }
};

Calendar.prototype.getWeek = function (day) {
  if (!this.week || day.day() === 0) {
    this.week = createElement("div", "week");
    this.month.appendChild(this.week);
  }
};

Calendar.prototype.drawDay = function (day) {
  const self = this;
  this.getWeek(day);

  //Outer Day
  const outer = createElement("div", this.getDayClass(day));
  outer.addEventListener("click", function () {
    self.openDay(this);
  });

  //Day Name
  const name = createElement("div", "day-name", day.format("ddd"));

  //Day Number
  const number = createElement("div", "day-number", day.format("DD"));

  //Entries
  const entries = createElement("div", "day-entries");
  this.drawEntries(day, entries);

  outer.appendChild(name);
  outer.appendChild(number);
  outer.appendChild(entries);
  this.week.appendChild(outer);
};

Calendar.prototype.drawEntries = function (day, element) {
  if (day.month() === this.current.month() && this.entries) {
    const todaysEntries = this.entries.reduce(function (memo, entry) {
      if (entry.date.isSame(day, "day")) {
        memo.push(entry);
      }
      return memo;
    }, []);
    const moodArr = ["terrible", "bad", "meh", "good", "great"];
    todaysEntries.forEach((entry) => {
      const entrySpan = createElement("span", moodArr[entry.mood - 1]);
      element.appendChild(entrySpan);
    });
  }
};

Calendar.prototype.getDayClass = function (day) {
  classes = ["day"];
  if (day.month() !== this.current.month()) {
    classes.push("other");
  } else if (today.isSame(day, "day")) {
    classes.push("today");
  }
  return classes.join(" ");
};

Calendar.prototype.openDay = function (el) {
  let details;
  const dayNumber =
    +el.querySelectorAll(".day-number")[0].innerText ||
    +el.querySelectorAll(".day-number")[0].textContent;
  const day = this.current.clone().date(dayNumber);

  const currentOpened = document.querySelector(".details");

  //Check to see if there is an open detais box on the current row
  if (currentOpened && currentOpened.parentNode === el.parentNode) {
    details = currentOpened;
  } else {
    //Close the open entries on different week row
    //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
    if (currentOpened) {
      currentOpened.addEventListener("webkitAnimationEnd", function () {
        currentOpened.parentNode.removeChild(currentOpened);
      });
      currentOpened.addEventListener("animationend", function () {
        currentOpened.parentNode.removeChild(currentOpened);
      });
      currentOpened.className = "details out";
    }

    //Create the Details Container
    details = createElement("div", "details in");
    el.parentNode.appendChild(details);
  }
  if (this.entries) {
    const todaysEntries = this.entries.reduce(function (memo, entry) {
      if (entry.date.isSame(day, "day")) {
        memo.push(entry);
      }
      return memo;
    }, []);

    this.renderEntries(todaysEntries, details);
  }
};

Calendar.prototype.renderEntries = function (entries, element) {
  //Remove any entries in the current details element
  const currentWrapper = element.querySelector(".entries");
  const wrapper = createElement(
    "div",
    "entries in" + (currentWrapper ? " new" : "")
  );
  const moodArr = ["terrible", "bad", "meh", "good", "great"];
  entries.forEach((entry) => {
    const div = createElement("div", "entry");
    const square = createElement(
      "div",
      "entry-category " + moodArr[entry.mood]
    );
    const span = createElement("span", "", entry.narrative);
    span.dataset.id = entry.id;
    span.addEventListener("click", () => {
      editEntry(entry);
    });

    div.appendChild(square);
    div.appendChild(span);
    wrapper.appendChild(div);
  });

  if (!entries.length) {
    const div = createElement("div", "entry empty");
    const span = createElement("span", "", "No Entries");

    div.appendChild(span);
    wrapper.appendChild(div);
  }

  if (currentWrapper) {
    currentWrapper.className = "entries out";
    currentWrapper.addEventListener("webkitAnimationEnd", function () {
      currentWrapper.parentNode.removeChild(currentWrapper);
      element.appendChild(wrapper);
    });
    currentWrapper.addEventListener("animationend", function () {
      currentWrapper.parentNode.removeChild(currentWrapper);
      element.appendChild(wrapper);
    });
  } else {
    element.appendChild(wrapper);
  }
};

Calendar.prototype.nextMonth = function () {
  this.current.add("months", 1);
  this.next = true;
  this.draw();
};

Calendar.prototype.prevMonth = function () {
  this.current.subtract("months", 1);
  this.next = false;
  this.draw();
};

function createElement(tagName, className, innerText) {
  const ele = document.createElement(tagName);
  if (className) {
    ele.className = className;
  }
  if (innerText) {
    ele.innderText = ele.textContent = innerText;
  }
  return ele;
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
