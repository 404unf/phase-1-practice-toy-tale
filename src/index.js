let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


// Begin
// When page loads, fetch toys from the database 
addEventListener('DOMContentLoaded',fetchToys)

function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response=>response.json())
    .then(data=>makeCard(data))
}

function makeCard(data) {
  for(let i=0;i<data.length;i++){
    const collectionDiv = document.getElementById('toy-collection')
    const newDiv = document.createElement('div')
    newDiv.className = 'card'

    const newHeader = document.createElement('h2')
    newHeader.textContent = data[i].name
    newDiv.append(newHeader)

    const newImg = document.createElement('img')
    newImg.className = 'toy-avatar'
    newImg.src = data[i].image
    newDiv.append(newImg)

    const newP = document.createElement('p')
    newP.likes = data[i].likes
    newP.textContent = `${data[i].likes} Likes`
    newDiv.append(newP)

    const newButton = document.createElement('button')
    newButton.className = 'like-btn'
    newButton.id = data[i].id
    newButton.textContent = 'Like ❤️'
    newDiv.append(newButton)

    collectionDiv.append(newDiv)
  }
}

// When a user submits the form a new toy is added to the database
const form = document.querySelector('.add-toy-form')
form.addEventListener('submit',addNewToy)

function addNewToy() {
  const response = fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      'name': this.name.value,
      'image': this.image.value,
      'likes':0
    })
  })
}


// When the like button is clicked, increase the number of likes in the database
setTimeout(() => {
  executeLikes()
}, 3000);

function executeLikes() {
  const likeButtons = document.querySelectorAll('.like-btn')
  likeButtons.forEach(button => button.addEventListener('click', addLikes))
}

function addLikes(event) {
  event.preventDefault()
  const id = this.id

  // Get current number of likes
  fetch(`http://localhost:3000/toys/${id}`)
    .then(response => response.json())
    .then(data => processLikes(data))

  function processLikes(data) {
    let numberOfLikes = parseInt(data.likes)
    numberOfLikes++

    // Update number of likes
    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        'likes': numberOfLikes
      })
    })
      .then(response=>response.json())
      .then(data=>updateLikes(data))
  }

  function updateLikes(data) {
    const id = data.id
    const numbLikes = data.likes
    const likesP = document.getElementById(id).previousSibling
    likesP.textContent = `${numbLikes} Likes`
  }

  
}