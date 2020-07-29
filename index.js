const banner = document.getElementById('banner');
const entryForm = document.getElementById('entry-form');

document.addEventListener("DOMContentLoaded", () => {
  promptUserInfo()
});

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
  entryForm.appendChild(userForm)
  entryForm.addEventListener('submit', e => {
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
  .then(console.log)
}



