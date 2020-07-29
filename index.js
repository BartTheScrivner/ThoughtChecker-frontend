const banner = document.getElementById('banner');
const formField = document.getElementById('form-field');
const dashboard = document.getElementById('dashboard');
const calendar = document.getElementById('calendar')
const friendMenu = document.getElementById('friend-menu')

document.addEventListener("DOMContentLoaded", () => {
  promptUserInfo()
});

// LOGIN
function promptUserInfo() {
  const welcome = document.createElement('h1');
  const userForm = document.createElement('form');
  const nameInput = document.createElement('input');
  const subBtn = document.createElement('button')
  nameInput.name = "name"
  subBtn.type = 'submit'
  subBtn.innerHTML = `<i class="fas fa-arrow-circle-right fa-2x"></i>`
  userForm.appendChild(nameInput)
  userForm.appendChild(subBtn)
  welcome.innerText = "Hello, what's your name?"
  banner.appendChild(welcome)
  formField.appendChild(userForm)
  formField.addEventListener('submit', e => {
    e.preventDefault();
    sendLogIn(userForm);
  });
}

function sendLogIn(userForm) {
  const postRequest = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(userForm.name.value)
  }
  fetch('http://localhost:3000/login', postRequest)
  .then(response => response.json())
  .then(user => renderDashboard(user))
}

function renderDashboard(user) {
  const date = document.getElementById('date');
  date.innerText = moment().format('ll');
  banner.innerHTML = ``;
  formField.innerHTML = ``;
  const welcomeMessage = document.createElement("h2");
  const dailyQuote = document.createElement('h3');
  welcomeMessage.innerText = `Welcome, ${user.name}.`;
  dailyQuote.innerText = fetchQuote();
  banner.appendChild(welcomeMessage);
  renderCalendar(user)
  renderFriendMenu(user)
  toggleModal();
  setUser(user);
}

function setUser(user) {
  const entryForm = document.getElementById('entry-form')
  entryForm.dataset.userId = user.id;
}

// DASHBOARD
function renderCalendar(user) {
  // const calendar = new Calendar('#calendar', user.entries);
}

function renderFriendMenu(user) {
  user.friendships.forEach(friend => {
    renderFriend(friend)
  })
}

function renderFriend(friend) {
  const friendCard = document.createElement('li');
  friendCard.innerText = friend.name;
  friendMenu.appendChild(friendCard);
}

function fetchQuote() {
  return "Don't judge each day by the harvest you reap but by the seeds that you plant. -Robert Louis Stevenson"
}

// MODAL ENTRY FORM
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const newEntry = document.getElementById('new-entry')

function toggleModal() {
    modal.classList.toggle("show-modal");
}

closeButton.addEventListener("click", () =>{
  toggleModal()
});

newEntry.addEventListener("click", () =>{
  toggleModal()
});

const entryForm = document.getElementById('entry-form')
entryForm.addEventListener('submit', (e) => {
  e.preventDefault()
  postEntry(entryForm);
});

function postEntry(entryForm) {
  const formFields = {
    user_id: entryForm.dataset.userId,
    mood: entryForm.mood.value,
    narrative: entryForm.narrative.value.trim()
  }

  const postRequest = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(formFields)
  }

  fetch('http://localhost:3000/entries', postRequest)
  .then(response => response.json())
  .then(console.log);

  toggleModal();
}




