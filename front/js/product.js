// Récupère l'ID du produit à afficher avec URLSearchParams
const searchId = window.location.search;
const urlSearchParams = new URLSearchParams (searchId);

// Extrait l'ID du produit affiché
const productId = urlSearchParams.get('id');
console.log(productId);

// Insère les détails du produit dans la page produit avec la méthode fetch
const selectColor = document.getElementById('colors');
fetch(`http://localhost:3000/api/products/${productId}`)
        .then(function (res) { 
            return res.json() })
        .then(function (product) { 
            displayDetails(product);
            console.log(product);
});

// Affiche le détail du produit sélectionné
function displayDetails(product) {
    document.querySelector('.item__img').innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById('title').innerText = `${product.name}`;
    document.getElementById('price').innerText = `${product.price}`;
    document.getElementById('description').innerText = `${product.description}`;
    product.colors.forEach((color) => {
    displayOptionColor(color);
    });
};   

// Permet d'afficher le choix des couleurs dans le ménu déroulant
function displayOptionColor(color) {
    let html = `
        <option value="${color}">${color}</option> `;
    const node = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
    selectColor.appendChild(node);
};

// Ajoute les produits dans le local storage
const btn = document.getElementById('addToCart');
btn.addEventListener('click', (event) => {
    let colorInput = document.getElementById('colors');
    let color = colorInput.value;
    let quantityInput = document.getElementById('quantity'); 
    let quantity = quantityInput.value;
    if(!color) {
        colorInput.style.borderColor = '#b20000';
        alert('Veuillez selectionner une couleur');
        return;
    } 
    if(quantity <= 0) {
        quantityInput.style.borderColor = '#b20000';
        alert('Veuillez selectionner une quantité supérieure à 0');
        return;
    }
    addCart({
        id: productId,
        color: color,
        quantity: quantity
    });
});

// Sauvegarde les données dans le local storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
};

function getCart() {
    let cart = localStorage.getItem('cart');
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart); 
    }
};

// Ajoute le produit dans le panier
function addCart(product) {
    let cart = getCart();
    console.log(cart);
    let foundProduct = cart.find((p) => {
        return p.id == product.id && p.color == product.color 
    });
    if (foundProduct != undefined) { 
        foundProduct.quantity = parseInt(product.quantity);
    } else {
        cart.push(product);
    }
    saveCart(cart);

    //Alerte pour la validation de l'ajout au panier
    window.alert("Ajouté(s) au panier !");   
};

