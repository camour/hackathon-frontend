const createDropMenu = (colors) =>
{
    let dropMenu = document.createElement('select');
    colors.forEach(function(element, key){
        dropMenu[key] = new Option(element, key);
    });

    return dropMenu;
}

const getProductQuantityFromCart = (product) =>
{
    let productQuantity = 0;
    if( (localStorage.getItem('cart')!= null) && (localStorage.getItem('cart') != undefined) )
    {
        let cartArray = JSON.parse(localStorage.getItem('cart'));
        
        for(let item of cartArray)
        {
            if (item.product._id === product._id)
            {
                productQuantity = item.quantity;
            }
        }
    }
    return productQuantity;
}


const addItemToCart = (cartButton, product, quantity) =>
{
    let count = 0;
    if(localStorage.getItem('cart') === null)
    {
        let itemsArray = new Array({product: product, quantity: quantity});
        document.getElementById('cartButtonQuantity').innerText = '  (x' + quantity + ')';
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
                
                document.getElementById('cartButtonQuantity').innerText = '  (x' + item.quantity + ')';
                count = 1;
            }
        }
        if(count==0)
        {
            itemsArray.push({product: product, quantity: quantity});
            document.getElementById('cartButtonQuantity').innerText = '  (x' + quantity + ')';
        }
       
        localStorage.setItem('cart', JSON.stringify(itemsArray));
    }

}




const createCartButton = (product) =>
{
    let cartButton = document.createElement('button');
    cartButton.innerHTML = '<i class="fas fa-cart-plus"></i><span id="cartButtonQuantity"> (x'+ getProductQuantityFromCart(product) +')</span>';
    cartButton.addEventListener('click', function(event){
        event.preventDefault();
        
        let selectQuantity = document.getElementById('productQuantity_'+product._id).value; 
        
        addItemToCart(cartButton, product, parseInt(selectQuantity, 10) +1);
    });

    return cartButton;
}

const buildOptionsBlock = (product) =>
{
    let optionsBlock = document.createElement('div');
    optionsBlock.classList.add('optionsBlock');
    let dropMenu = createDropMenu(product.colors);    
    let quantityTab = createQuantityTab(product);
    let cartButton = createCartButton(product);
    let removeButton = createRemoveButton(product);

    optionsBlock.appendChild(dropMenu);
    optionsBlock.appendChild(cartButton);
    optionsBlock.appendChild(quantityTab);
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
     
        
    });
}
