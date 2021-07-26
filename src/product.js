// menu d'options, chaque ours possede une liste d'options possible ('Tan, Chocolate'...)
const createDropMenu = (colors) => {
    let dropMenu = document.createElement("select");
    colors.forEach(function (element, key) {
      dropMenu[key] = new Option(element, key);
    });
  
    return dropMenu;
  };
  
  const addItemToCart = (cartButton, product, quantity) => {
    let count = 0;
    // le panier n'a jamais encore ete cree
    if (localStorage.getItem("cart") === null) {
      let itemsArray = new Array({ product: product, quantity: quantity });
      localStorage.setItem("cart", JSON.stringify(itemsArray));
    } else {
      let itemsArray = JSON.parse(localStorage.getItem("cart"));
      for (let item of itemsArray) {
        //si l'article existe deja dans le panier, on augmente juste sa quantite
        if (item.product._id === product._id) {
          item.quantity += quantity;
          count = 1;
        }
      }
      //l'article n'a jamais ete ajoute dans le panier
      if (count == 0) {
        itemsArray.push({ product: product, quantity: quantity });
      }
  
      localStorage.setItem("cart", JSON.stringify(itemsArray));
    }
  };
  
  const createCartButton = (product) => {
    let cartButton = document.createElement("button");
  
    cartButton.innerHTML = '<i class="fas fa-cart-plus"></i> add cart';
    cartButton.addEventListener("click", function (event) {
      event.preventDefault();
      let selectedQuantity = document.getElementById(
        "productQuantity_" + product._id
      ).value;
      if (selectedQuantity > 0) {
        addItemToCart(cartButton, product, parseInt(selectedQuantity, 10));
        // si on ajoute un article au panier, ne pas oublier de mettre a jour la puce du menu de navigation
        updateCartBadge();
      }
    });
  
    return cartButton;
  };
  
  //block qui contient 4 options : bouton d'ajout au panier, bouton de suppression, selecteur de quantite, selecteur d'options
  const buildOptionsBlock = (product) => {
    let optionsBlock = document.createElement("div");
    optionsBlock.classList.add("optionsBlock");
    let dropMenu = createDropMenu(product.colors);
    let quantityInput = createQuantityInput(product);
    let cartButton = createCartButton(product);
    let removeButton = createRemoveButton(product);
  
    optionsBlock.appendChild(dropMenu);
    optionsBlock.appendChild(cartButton);
    optionsBlock.appendChild(quantityInput);
    optionsBlock.appendChild(removeButton);
  
    return optionsBlock;
  };
  
  const getProductId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get("id");
    return productId;
  };
  
  const displayProductBlock = (objectResult) => {
    let productCard = buildProductCard(objectResult);
    let optionsBlock = buildOptionsBlock(objectResult);
  
    let block = document.createElement("div");
    block.classList.add("block");
    block.appendChild(productCard);
    block.appendChild(optionsBlock);
  
    let productsBlock = document.getElementById("products");
    productsBlock.appendChild(block);
  };
  const displayProduct = () => {
    fetch("http://localhost:3000/api/teddies/" + getProductId())
      .then(function (result) {
        if (result.ok) {
          return result.json();
        }
      })
      .then(function (objectResult) {
        displayProductBlock(objectResult);
        updateCartBadge();
      })
      .catch(function (error) {
        alert(error);
      });
  };
  