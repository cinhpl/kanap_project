// Récupère la balise afin d'afficher les produits sur la page d'accueil
const productsElt = document.getElementById('items'); 
console.log(productsElt);

// Récupère le serveur API et extrait les données avec la méthode fetch
fetch("http://localhost:3000/api/products")
        .then((res) => res.json()) 
        .then((productsData) => { 
            console.log(productsData);
            productsData.forEach((product) => {
                displayProduct(product); 
            })
        });

// Affiche les produits via la fonction avec la méthode DOMParser et appendChild
function displayProduct(product) {
    console.log(product);
    let html = `
        <a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a> `
        ;
    const node = new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
    productsElt.appendChild(node); /* Permet d'afficher l'enfant à la suite du parent 
    avec les informations du produit */
};

    


