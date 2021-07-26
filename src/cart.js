// retourne les produits presents dans le panier
const getProductsArray = () => {
    let productsArray = new Array();
    if (localStorage.getItem("cart")) {
      for (let product of JSON.parse(localStorage.getItem("cart"))) {
        productsArray.push(product.product);
      }
    }
    return productsArray;
  };
  const getProductsIDArray = () => {
    let productsIDArray = new Array();
    if (localStorage.getItem("cart")) {
      for (let product of JSON.parse(localStorage.getItem("cart"))) {
        for (let i = 0; i < product.quantity; i++) {
          productsIDArray.push(product.product._id);
        }
      }
    }
    return productsIDArray;
  };
  // cree un objet contact a partir du formulaire
  const getContactFromForm = () => {
    let contactObject = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };
    return contactObject;
  };
  
  const hasUndefinedAttribute = (contactObject) => {
    let ok = false;
    if (
      contactObject.firstName === undefined ||
      contactObject.lastName === undefined ||
      contactObject.address === undefined ||
      contactObject.city === undefined ||
      contactObject.email === undefined
    ) {
      ok = true;
    }
    return ok;
  };
  
  const hasNullAttribute = (contactObject) => {
    let ok = false;
  
    if (
      contactObject.firstName === null ||
      contactObject.lastName === null ||
      contactObject.address === null ||
      contactObject.city === null ||
      contactObject.email === null
    ) {
      ok = true;
    }
  
    return ok;
  };
  
  const hasNotStringsAttribute = (contactObject) => {
    let ok = false;
  
    if (
      typeof contactObject.firstName != "string" ||
      typeof contactObject.lastName != "string" ||
      typeof contactObject.address != "string" ||
      typeof contactObject.city != "string" ||
      typeof contactObject.email != "string"
    ) {
      ok = true;
    }
  
    return ok;
  };
  
  const validateContact = (contactObject) => {
    let ok = true;
    if (hasUndefinedAttribute(contactObject)) {
      ok = false;
      console.log("undefined contactObject attributes");
    }
    if (hasNullAttribute(contactObject)) {
      ok = false;
      console.log("null contactObject attributes");
    }
    if (hasNotStringsAttribute(contactObject)) {
      ok = false;
      console.log("not strings contactObject attributes");
    }
    return ok;
  };
  
  // Si on souhaite rajouter une input a verifier, c'est ici qu'on le fait. Permet de centraliser les inputs
  // a verifier et leur expression reguliere respective
  const getAllInputs = () => {
    let inputsArray = new Array(
      {
        value: document.getElementById("firstName").value,
        expression: /^[a-zA-Z,.'-]+$/,
        errorMessage: "Invalid firstName",
      },
      {
        value: document.getElementById("lastName").value,
        expression: /^[a-zA-Z,.'-]+$/,
        errorMessage: "Invalid lastName",
      },
      {
        value: document.getElementById("address").value,
        expression:
          /^([0-9]{1,2}) +([a-zA-Zé]{3,}) +([a-z]{2,}) +([a-zA-Zéèàôê -]+)$/,
        errorMessage: "Invalid address",
      },
      {
        value: document.getElementById("city").value,
        expression: /^[a-zA-Z,.'-]+ ?[a-zA-Z]*$/,
        errorMessage: "Invalid city",
      },
      {
        value: document.getElementById("email").value,
        expression: /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/,
        errorMessage: "Invalid email",
      }
    );
  
    return inputsArray;
  };
  
  const checkRegularInput = (expression, value, errorMessage) => {
    let ok = false;
    // on teste si le contenu de l'input match bien le modele de l'expression reguliere
    if (expression.test(value)) {
      ok = true;
    } else {
      alert(errorMessage);
    }
    return ok;
  };
  
  const checkAllInputs = () => {
    let inputsArray = getAllInputs();
    let ok = true;
  
    for (let input of inputsArray) {
      // si on a trouve une erreur une fois, pas besoin de rentrer une seconde fois dans le if
      if (
        !checkRegularInput(input.expression, input.value, input.errorMessage) &&
        ok
      ) {
        ok = false;
      }
    }
    return ok;
  };
  
  const validateForm = () => {
    let ok = true;
  
    if (document.getElementById("firstName").value === "") {
      ok = false;
      alert("invalid first name");
    }
    if (document.getElementById("lastName").value === "") {
      ok = false;
      alert("invalid last name");
    }
    if (document.getElementById("address").value === "") {
      ok = false;
      alert("invalid address");
    }
    if (document.getElementById("city").value === "") {
      ok = false;
      alert("invalid city");
    }
    // a partir des expressions regulieres, on verifie le contenu des inputs du formulaire
    if (!checkAllInputs()) {
      ok = false;
    }
    return ok;
  };
  
  document
    .getElementById("formSubmit")
    .addEventListener("click", function (event) {
      event.preventDefault();
      let contactObject = getContactFromForm();
  
      if (validateContact(contactObject) && validateForm()) {
        fetch("http://localhost:3000/api/teddies/order", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact: contactObject,
            products: getProductsIDArray(),
          }),
        })
          .then(function (result) {
            if (result.ok) {
              return result.json();
            }
          })
          .then(function (objectResult) {
            //tableau retracant l'historique des achats
            let purchasesArray = [];
            if (
              localStorage.getItem("purchases") != null &&
              localStorage.getItem("purchases") != undefined
            ) {
              purchasesArray = JSON.parse(localStorage.getItem("purchases"));
            }
            let purchaseDate = new Date();
            objectResult.purchaseDate =
              "" +
              purchaseDate.getDay() +
              "/" +
              purchaseDate.getMonth() +
              "/" +
              purchaseDate.getFullYear() +
              "";
            purchasesArray.unshift(objectResult);
            localStorage.setItem("purchases", JSON.stringify(purchasesArray));
            //une fois la commande passee, on supprime le panier pour qu'il apparaisse vide
            localStorage.removeItem("cart");
            //une fois la commande passee, on redirige le client vers la page des achats deja effectues
            location.replace("./purchase.html");
          })
          .catch(function (error) {
            alert(error);
          });
      }
    });
  
  const computeCartSum = () => {
    let cartSum = 0;
    let productsCart = JSON.parse(localStorage.getItem("cart"));
    if (productsCart) {
      for (let product of productsCart) {
        // Attention, un produit n'est comptabilite qu'une fois dans le panier, c'est son champ 'quantity'
        // qui indique le nombre de fois qu'il est comptabilise, il faut donc multiplier le price par 'quantity'
        // pour connaitre le prix total du produit dans le panier et l'ajouter au prix des autres produits
        cartSum += product.product.price * product.quantity;
      }
    }
    return cartSum;
  };
  
  // calcule le montant total du panier et l'affiche
  const displayCartSum = () => {
    let cartSum = document.getElementById("price");
    cartSum.innerText = computeCartSum() / 100;
    return computeCartSum();
  };
  
  // recapitule le nombre de fois qu'un article a ete ajoute au panier
  const createProductQuantity = (quantity) => {
    if (quantity != null && quantity != undefined) {
      let productQuantity = document.createElement("p");
      productQuantity.classList.add("cartProductQuantity");
      productQuantity.innerHTML = "x " + quantity;
      return productQuantity;
    }
  };
  
  const displayCartProducts = () => {
    let productsBlock = document.getElementById("products");
    let title = document.getElementById("cartTitle");
  
    if (
      localStorage.getItem("cart") != undefined &&
      localStorage.getItem("cart") != null
    ) {
      title.innerHTML = "Voici la liste de vos articles";
      let cartArray = JSON.parse(localStorage.getItem("cart"));
      for (let item of cartArray) {
        let productCard = buildProductCard(item.product);
        let productQuantity = createProductQuantity(item.quantity);
  
        let removeButton = createRemoveButton(item.product);
        let productBlock = document.createElement("div");
        productBlock.appendChild(productCard);
        productBlock.appendChild(productQuantity);
        productBlock.appendChild(removeButton);
  
        productsBlock.appendChild(productBlock);
      }
    } else {
      title.innerHTML = "Empty cart";
    }
  };
  
  const displayCart = () => {
    displayCartProducts();
    //on s'assure que le panier n'est pas vide pour autoriser le client a envoyer le formulaire de commandes
    if (displayCartSum() > 0) {
      document.getElementById("formSubmit").removeAttribute("disabled");
    }
    updateCartBadge();
  };
  