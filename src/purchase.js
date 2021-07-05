
const getPurchaseProductQuantity = (purchase, product) =>
{
    let quantity = 0;
    for(let item of purchase.products)
    {
        if(item._id === product._id)
        {
            quantity++;
        }
    }
    return quantity;
}

const  displayPurchaseItem = (purchase, product) =>
{
    let block = document.createElement('div');
    let productCard = buildProductCard(product);
    let quantityBlock = document.createElement('div');
    quantityBlock.classList.add('purchaseQuantityBlock');
    quantityBlock.innerHTML =" x" + getPurchaseProductQuantity(purchase, product) + " ";

    block.appendChild(productCard);
    block.appendChild(quantityBlock);
    return block;
}

const displayPurchaseItems = (purchase) =>
{
    let itemsBlock = document.getElementById(purchase.orderId);
    let productsId = [];
    for(let product of purchase.products)
    {
        
        if(!productsId.find(element => element === product._id))
        {
            itemsBlock.appendChild(displayPurchaseItem(purchase, product));
        }
            
        productsId.push(product._id);
    }
}

const computePurchase = (purchase) =>
{
    
    let sum = 0;
    for(let product of purchase.products)
    {
        sum+= product.price;
    }

    return sum;
}


const confirmPurchase = (purchase) =>
{
    let purchaseBlock = document.createElement('div');
    purchaseBlock.classList.add('purchaseBlock');
    purchaseBlock.style.width = '100%';
    purchaseBlock.style.marginBottom = "30px";  
    let paragraph = document.createElement('p');
    paragraph.classList.add('recap');  
    paragraph.innerHTML = "Thank you for trusting us <br> Amount paid: " + computePurchase(purchase)/100 + "€ <br/>";
    paragraph.innerHTML+="Date : " + purchase.purchaseDate + "<br/>";
    paragraph.innerHTML+= "Order id : " + purchase.orderId;       

    purchaseBlock.appendChild(paragraph);
    
    let itemsBlock = document.createElement('div');
    itemsBlock.classList.add('purchaseItems');
    itemsBlock.setAttribute('id', purchase.orderId);
    itemsBlock.classList.add('container');

    purchaseBlock.appendChild(createTitle('Recap of what you bought'));

    purchaseBlock.appendChild(itemsBlock);


    return purchaseBlock;
    
}

const displayPurchase = (purchase) =>
{
    let purchaseBlock = confirmPurchase(purchase); 
    return purchaseBlock; 
    
}

const displayPurchases = () =>
{
    localStorage.removeItem('cart');
    let purchasesBlock = document.getElementById('purchases');
    let purchasesArray = JSON.parse(localStorage.getItem('purchases'));
    
    for(let purchase of purchasesArray)
    {
        let purchaseBlock = displayPurchase(purchase)        
        purchasesBlock.appendChild(purchaseBlock);
        displayPurchaseItems(purchase);          
        purchasesBlock.appendChild(document.createElement('hr'));        
    }
    updateCartBadge();     

}