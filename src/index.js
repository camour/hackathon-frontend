const updateCartBadge = () =>
{
    if( (localStorage.getItem('cart') != null) && (localStorage.getItem('cart') !=undefined))
    {
        let cartArray = JSON.parse(localStorage.getItem('cart'));
        let badge = document.getElementsByClassName('badge')[0];
        let productNumber = 0;
        for(let product of cartArray)
        {
            productNumber+= product.quantity;
        }
        
        badge.innerHTML = productNumber;
       
    }
  
}

const createQuantityInput = (product) =>
{
    
    let quantityInput = document.createElement('input');
    quantityInput.setAttribute('type', 'number');
    quantityInput.classList.add('inputQuantity');
    quantityInput.setAttribute('id', 'productQuantity_'+product._id);
    quantityInput.setAttribute('min','1');
    quantityInput.setAttribute('max','100'); 
    quantityInput.setAttribute('value','1');  

    return quantityInput;
}



const createTitle = (titleContent) =>
{
    let title = document.createElement('h2');
    title.innerHTML = titleContent;
    return title;
}

const removeProductFromCart = (product) =>
{
    
    if( (localStorage.getItem('cart') != null) && (localStorage.getItem('cart') !=undefined))
    {
        let cartArray = JSON.parse(localStorage.getItem('cart'));
        
        let index = 0;
        
        for(let item of cartArray)
        {
            if (item.product._id === product._id)
            {
                cartArray.splice(index, 1);
                if(document.getElementById('cartButtonQuantity'))
                {
                    document.getElementById('cartButtonQuantity').innerText = '';
                }    
                
            }
            index++;
        }
        
        if(cartArray.length == 0)
        {
            localStorage.clear();
        }
        else
        {
            localStorage.setItem('cart', JSON.stringify(cartArray));
        } 
    }
    
}

const createRemoveButton = (product) =>
{
    let removeButton = document.createElement('button');
    removeButton.classList.add('removeButton');
    removeButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    
    removeButton.addEventListener('click', function(event){
        event.preventDefault();
        removeProductFromCart(product);
        location.reload();
            
    });
    return removeButton;
}


const createProductName = (name, price) =>
{
    let productName = document.createElement('h3');    
    productName.innerHTML = name + '<br>' + price + '€';
    return productName;
}

const createProductImage = (src) =>
{
    let productImage = document.createElement('div');
    productImage.classList.add('productImage');
    productImage.style.backgroundImage = "url("+src+")";

    return productImage;
}

const createProductDescription = (description) =>
{
    let productDescription = document.createElement('p');
    productDescription.classList.add('productDescription');
    productDescription.innerHTML = description;
    return productDescription;
}

const createProductCard = (id) =>
{
    let productCard = document.createElement('div');
    productCard.classList.add('productCard');
    productCard.setAttribute('id', id);    
    productCard.addEventListener('click', function(event){
        location.replace("./product.html?id="+id);
    });
    
    return productCard;
}

const buildProductCard = (product) =>
{
    let productImage = createProductImage(product.imageUrl);
    let productName = createProductName(product.name, product.price/100);
    let productDescription = createProductDescription(product.description);
    let productCard = createProductCard(product._id);
    
    productCard.appendChild(productImage);
    productCard.appendChild(productName);
    productCard.appendChild(productDescription);

    return productCard;
}

const displayProductsList = (productsObject) =>
{
    console.log(productsObject);
    if(productsObject)
    {
        
        for(let product of productsObject)
        {
                let block = document.createElement('div');      
                let productCard = buildProductCard(product);
                let productsBlock = document.getElementById('products');
                block.appendChild(productCard);
                productsBlock.appendChild(block);
              
        
        }
    }
}

const displayProducts = () => 
{
    
    fetch("http://localhost:3000/api/teddies/")
    .then(function(result){
        return result.json();
    })
    .then(function(objectResult){
        
        displayProductsList(objectResult);
        updateCartBadge();    
        
    });


}






