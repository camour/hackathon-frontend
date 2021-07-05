const createDropMenu = (colors) =>
{
    let dropMenu = document.createElement('select');
    colors.forEach(function(element, key){
        dropMenu[key] = new Option(element, key);
    });

    return dropMenu;
}





const addItemToCart = (cartButton, product, quantity) =>
{
    let count = 0;
    if(localStorage.getItem('cart') === null)
    {
        let itemsArray = new Array({product: product, quantity: quantity});        
        localStorage.setItem('cart', JSON.stringify(itemsArray));
    }
    else
    {
        let itemsArray = JSON.parse(localStorage.getItem('cart'));
        for(let item of itemsArray)
        {
            if(item.product._id === product._id)
            {
                item.quantity+= quantity;            
                count = 1;
            }
        }
        if(count==0)
        {
            itemsArray.push({product: product, quantity: quantity});           
        }
       
        localStorage.setItem('cart', JSON.stringify(itemsArray));
    }

}




const createCartButton = (product) =>
{
    let cartButton = document.createElement('button');
    
    cartButton.innerHTML = '<i class="fas fa-cart-plus">add cart</i>';
    cartButton.addEventListener('click', function(event){
        event.preventDefault();
        
        let selectedQuantity = document.getElementById('productQuantity_'+product._id).value; 
        
        addItemToCart(cartButton, product, parseInt(selectedQuantity, 10));
        updateCartBadge();
    });
   
    return cartButton;
}

const buildOptionsBlock = (product) =>
{
    let optionsBlock = document.createElement('div');
    optionsBlock.classList.add('optionsBlock');
    let dropMenu = createDropMenu(product.colors);    
    let quantityInput = createQuantityInput(product);
    let cartButton = createCartButton(product);
    let removeButton = createRemoveButton(product);

    optionsBlock.appendChild(dropMenu);
    optionsBlock.appendChild(cartButton);
    optionsBlock.appendChild(quantityInput);
    optionsBlock.appendChild(removeButton);

    return optionsBlock;
}
 
const getProductId = () =>
{
    const urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');
    return productId;
}
const displayProduct = () =>
{
    
    fetch("http://localhost:3000/api/teddies/"+getProductId())
    .then(function(result){
        return result.json();
    })
    .then(function(objectResult){
        
        
        let productCard = buildProductCard(objectResult);
        let optionsBlock = buildOptionsBlock(objectResult);

        let block = document.createElement('div');
        block.classList.add('block');
        block.appendChild(productCard);
        block.appendChild(optionsBlock);
        
        let productsBlock = document.getElementById('products');
        productsBlock.appendChild(block);
        updateCartBadge();      
        
    });
}
