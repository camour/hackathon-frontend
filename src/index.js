// met a jour le nombre d'articles dans le panier et l'affiche dans le menu de navigation
const updateCartBadge = () => {
    if (
      localStorage.getItem("cart") != null &&
      localStorage.getItem("cart") != undefined
    ) {
      let cartArray = JSON.parse(localStorage.getItem("cart"));
      let badge = document.getElementsByClassName("badge")[0];
      let productNumber = 0;
      //on compte le nombre d'articles dans le panier
      for (let product of cartArray) {
        productNumber += product.quantity;
      }
  
      badge.innerHTML = productNumber;
    }
  };
  
  // input pour selectionner la quantite d'ours en peluche souhaitee
  const createQuantityInput = (product) => {
    let quantityInput = document.createElement("input");
    quantityInput.setAttribute("type", "number");
    quantityInput.classList.add("inputQuantity");
    quantityInput.setAttribute("id", "productQuantity_" + product._id);
    quantityInput.setAttribute("min", "1");
    quantityInput.setAttribute("max", "100");
    quantityInput.setAttribute("value", "1");
  
    return quantityInput;
  };
  
  const createTitle = (titleContent) => {
    let title = document.createElement("h2");
    title.innerHTML = titleContent;
    return title;
  };
  
  const removeProductFromCart = (product) => {
    if (
      localStorage.getItem("cart") != null &&
      localStorage.getItem("cart") != undefined
    ) {
      let cartArray = JSON.parse(localStorage.getItem("cart"));
  
      let index = 0;
  
      for (let item of cartArray) {
        if (item.product._id === product._id) {
          cartArray.splice(index, 1);
          if (document.getElementById("cartButtonQuantity")) {
            document.getElementById("cartButtonQuantity").innerText = "";
          }
        }
        index++;
      }
  
      if (cartArray.length == 0) {
        localStorage.removeItem("cart");
      } else {
        localStorage.setItem("cart", JSON.stringify(cartArray));
      }
    }
  };
  
  const createRemoveButton = (product) => {
    let removeButton = document.createElement("button");
    removeButton.classList.add("removeButton");
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  
    removeButton.addEventListener("click", function (event) {
      event.preventDefault();
      removeProductFromCart(product);
      location.reload();
    });
    return removeButton;
  };
  
  const createProductName = (name, price) => {
    let productName = document.createElement("h3");
    if (name && price) {
      productName.innerHTML = name + "<br>" + price + "€";
    } else {
      productName.innerHTML = "unknown";
    }
    return productName;
  };
  
  const createProductImage = (src) => {
    let productImage = document.createElement("div");
    productImage.classList.add("productImage");
    if (src) {
      productImage.style.backgroundImage = "url(" + src + ")";
    } else {
      productImage.style.backgroundColor = "white";
    }
    return productImage;
  };
  
  const createProductDescription = (description) => {
    let productDescription = document.createElement("p");
    productDescription.classList.add("productDescription");
    if (description) {
      productDescription.innerHTML = description;
    } else {
      description = "no description available";
    }
    return productDescription;
  };
  
  const createProductCard = (id) => {
    let productCard = document.createElement("div");
    productCard.classList.add("productCard");
    if (id) {
      productCard.setAttribute("id", id);
      productCard.addEventListener("click", function (event) {
        location.replace("./product.html?id=" + id);
      });
    }
    return productCard;
  };
  
  // construit une fenetre pour afficher un article peluche
  const buildProductCard = (product) => {
    let productImage = createProductImage(product.imageUrl);
    let productName = createProductName(product.name, product.price / 100);
    let productDescription = createProductDescription(product.description);
    let productCard = createProductCard(product._id);
  
    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productDescription);
  
    let block = document.createElement("div");
    block.appendChild(productCard);
  
    return block;
  };
  
  const displayProductsList = (productsObject) => {
    if (productsObject) {
      for (let product of productsObject) {
        let productCardBlock = buildProductCard(product);
        let productsBlock = document.getElementById("products");
        productsBlock.appendChild(productCardBlock);
      }
    }
  };
  
  const displayProducts = () => {
    fetch("http://localhost:3000/api/teddies/")
      .then(function (result) {
        if (result.ok) {
          return result.json();
        }
      })
      .then(function (objectResult) {
        //affiche la liste des objets recue depuis le serveur
        displayProductsList(objectResult);
        updateCartBadge();
      })
      .catch(function (error) {
        alert(
          "communication with server failed, items are not available. Please make sure you have a good connection."
        );
      });
  };
  