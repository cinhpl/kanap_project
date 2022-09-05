// Initialisation du local storage
let cart = getCart();
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart)); 
}

let productCart = JSON.parse(localStorage.getItem('productCart'));

function getCart() {
  let cart = localStorage.getItem('cart');
  if(cart === null || cart == 0){
  } else {
    return JSON.parse(cart); 
  }
}

// Variables de prix
let productPrice = [];
let totalPrice = 0;

// Affichage du produit des paniers
const displayCart = document.getElementById('cart__items');
//console.log(displayCart);

// Si le panier est rempli : afficher les produits
for (let productCart of cart) {
  //console.log(productCart);
  fetch(`http://localhost:3000/api/products/${productCart.id}`)
        .then(function (res) { 
            return res.json() })
        .then(function (product) { 
            productPrice[productCart.id] = product.price;
            console.log(productPrice);
            displayProduct(product,productCart);
            updateTotalPrice(product.price * productCart.quantity)
 });
}

function displayProduct(product, cart) {

  //console.log(product);
  let html = `
  <article class="cart__item" data-id="${product._id}" data-color="${cart.color}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${product.name}</h2>
        <p>${cart.color}</p>
        <p>${product.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart.quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article> `;
  const node = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
  displayCart.appendChild(node);
  addEventDeleteItem(product._id, cart.color);
  addEventModifQtt(product._id, cart.color);
}  

// Afficher le total des produits du panier
function calculTotalProducts() {
  let cart = getCart();
  //console.log(cart);
  let number = 0;
  for (let product of cart) {
    number += product.quantity;
  } 
  document.querySelector('#totalQuantity').innerHTML = number;
}
calculTotalProducts();

function updateTotalPrice(price) {
  totalPrice += price;
  document.querySelector('#totalPrice').innerHTML = totalPrice;
}

function getOriginalQtt(id, color) {
  let cart = getCart();
  let foundProduct = cart.find((p) => {
    return p.id == id && p.color == color
   });
  return foundProduct.quantity;
}

/*--------------------------- Modifier la quantité d'un produit ---------------------------*/
// Fonction qui permet de modifier la quantité d'un produit
function modifQtt(productId, color, quantity) {
  let cart = getCart();
  let foundProduct = cart.find((p) => {
    return p.id == productId && p.color == color
   });
  foundProduct.quantity = parseInt(quantity);
  //console.log(foundProduct);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Listener qui gère l'input 
function addEventModifQtt (deleteItemId, color) {
  let article = document.querySelector(`article[data-id="${deleteItemId}"][data-color="${color}"]`);
  let itemQtt = article.querySelector('.itemQuantity');
  //console.log(itemQtt);
  itemQtt.addEventListener('change', (event) => {
    let newQtt = parseInt(event.target.value);
    let originalQtt = getOriginalQtt(deleteItemId, color);
    let difQtt = newQtt - originalQtt;
    if(newQtt <= 0) {
      deleteArticle(article);
    } else {
      modifQtt(deleteItemId, color, newQtt);
    }
    calculTotalProducts();
    updateTotalPrice(difQtt * productPrice[deleteItemId]);
    window.alert('Quantité(s) modifié(s)')
  });
}

/*--------------------------- Supprimer un produit du panier ---------------------------*/
// Listener sur le bouton click pour supprimer un article du panier
function addEventDeleteItem (deleteItemId, color) {
  let article = document.querySelector(`article[data-id="${deleteItemId}"][data-color="${color}"]`);
  let deleteBtn = article.querySelector(`.deleteItem`);
  //console.log(article);

  deleteBtn.addEventListener('click', () => {
    let originalQtt = getOriginalQtt(deleteItemId, color);
    deleteArticle(article)
    calculTotalProducts();
    updateTotalPrice(originalQtt * -1 * productPrice[deleteItemId]);
    window.alert('Article(s) supprimé(s)');
  });
}

// Filtre les produits à supprimer
function deleteItemFromStorage (deleteItemId, color) {
  let cart = getCart();
  let filterProducts = cart.filter((p) => {
        return p.id != deleteItemId || color != p.color;
    }); 
    saveCart(filterProducts);
  }

// Permet de supprimer l'article et le produit du LS
function deleteArticle(article) {
  let id = article.getAttribute('data-id');
  let color = article.getAttribute('data-color');
  deleteItemFromStorage(id, color);
  article.remove();
}

/*--------------------------- Envoi du formulaire et commande ---------------------------*/
// Vérification des champs du formulaire 
let formSubmit = document.querySelector('.cart__order__form');

// Ecoute Prénom
formSubmit.firstName.addEventListener('change', function() {
  validFirstName(this);
});

// Ecoute Nom de famille
formSubmit.lastName.addEventListener('change', function () {
  validLastName(this);
});

// Ecoute Adresse 
formSubmit.address.addEventListener('change', function () {
  validAddress(this);
})

// Ecoute Ville
formSubmit.city.addEventListener('change', function () {
  validCity(this);
})

// Ecoute Email
formSubmit.email.addEventListener('change', function() {
    validEmail(this);
});

// Validation Prénom
const validFirstName = function (inputFirstName) {
  let firstNameRegExp = new RegExp(
    '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{2,30}$'
  );
  let submitFirstName = inputFirstName.nextElementSibling;
  if (firstNameRegExp.test(inputFirstName.value)) {
    submitFirstName.textContent = 'Saisie valide';
    submitFirstName.style.color = '#96ffa7';
    return true;
  }
  else {
    submitFirstName.textContent = 'Erreur de saisie';
    return false;
  }
};

// Validation Nom de famille 
const validLastName = function (inputLastName) {
  let lastNameRegExp = new RegExp(
    '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{2,30}$'
  );
  let submitLastName = inputLastName.nextElementSibling;
  if (lastNameRegExp.test(inputLastName.value)) {
    submitLastName.textContent = 'Saisie valide';
    submitLastName.style.color = '#96ffa7';
    return true;
  }
  else {
    submitLastName.textContent = 'Erreur de saisie';
    return false;
  }
};

// Validation Adresse
const validAddress = function (inputAddress) {
  let addressRegExp = new RegExp(
    '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{5,99}$'
  );
  let submitAddress = inputAddress.nextElementSibling;
  if (addressRegExp.test(inputAddress.value)) {
    submitAddress.textContent = 'Saisie valide';
    submitAddress.style.color = '#96ffa7';
    return true;
  }
  else {
    submitAddress.textContent = 'Erreur de saisie';
    return false;
  }
};

// Validation Ville
const validCity = function (inputCity) {
  let cityRegExp = new RegExp(
    '^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{3,30}$'
  );
  let submitCity = inputCity.nextElementSibling;
  if (cityRegExp.test(inputCity.value)) {
    submitCity.textContent = 'Saisie valide';
    submitCity.style.color = '#96ffa7';
    return true;
  }
  else {
    submitCity.textContent = 'Erreur de saisie';
    return false;
  }
};

// Validation Email
const validEmail = function (inputEmail) {
    let emailRegExp = new RegExp(
      '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,30}$', 
      'g'
      );
      let submitEmail = inputEmail.nextElementSibling;
      if (emailRegExp.test(inputEmail.value)) {
        submitEmail.textContent = 'Saisie valide';
        submitEmail.style.color = '#96ffa7';
        return true;
      } 
      else {
        submitEmail.textContent = 'Erreur de saisie';
        return false;
      }
};

// Envoi de la commande

// Ecouter la soumission du formulaire
formSubmit.addEventListener('submit', (e) => {
    e.preventDefault();

    function getIds(cart) {
      let products = []
      for (i = 0; i < cart.length; i++) {
          products.push(cart[i].id)
      }
      return products
  }
    let productsId = getIds(cart);
      
    let contact = {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value
      };

      let order = {
        contact:contact,
        products:productsId
      };
      
      // Send information
      let methodPost = {
        method: 'POST',
        body: JSON.stringify(order),
        headers : {
          'content-type': 'application/json',
        }
      }

      fetch("http://localhost:3000/api/products/order", methodPost) 
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          //localStorage.clear();

        window.location.href= `/front/html/confirmation.html?orderId=${data.orderId}`;

        })
   })
  


