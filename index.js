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
  subBtn.type = 'submit'
  subBtn.innerHTML = `<i class="fas fa-arrow-circle-right fa-2x"></i>`
  userForm.appendChild(nameInput)
  userForm.appendChild(subBtn)
  welcome.innerText = "Hello, what's your name?"
  banner.appendChild(welcome)
  entryForm.appendChild(userForm)
  entryForm.addEventListener('submit', e => {
    
  });
}



