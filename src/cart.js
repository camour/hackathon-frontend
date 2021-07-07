
const getProductsArray = () =>
{
    let productsArray = new Array();
    if(localStorage.getItem('cart'))
    {
        for(let product of JSON.parse(localStorage.getItem('cart')))
        {
            productsArray.push(product.product);
        }
    }
    return productsArray;
}
const getProductsIDArray = () =>
{
    let productsIDArray = new Array();
    if(localStorage.getItem('cart'))
    {
        for(let product of JSON.parse(localStorage.getItem('cart')))
        {
            for(let i = 0; i < product.quantity ; i++)
            {
                productsIDArray.push(product.product._id);
            }
        }
    }
    return productsIDArray;
}
const getContactFromForm = () =>
{
    let contactObject =  {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        email: document.getElementById('email').value
    };
    return contactObject;

}

const validateContact = (contactObject) =>
{
    let ok = true;
    if( (contactObject.firstName === undefined) || (contactObject.lastName === undefined) || (contactObject.address === undefined) || (contactObject.city === undefined) || (contactObject.email === undefined) )
    {
        ok = false;       
    }
    if( (contactObject.firstName === null) || (contactObject.lastName === null) || (contactObject.address === null) || (contactObject.city === null) || (contactObject.email === null) )
    {
        ok = false;        
    }
    if( (typeof contactObject.firstName != 'string') || (typeof contactObject.lastName != 'string') || (typeof contactObject.address != 'string') || (typeof contactObject.city != 'string') || (typeof contactObject.email != 'string') )
    {
        ok = false;
        
    }
    return ok;
}

document.getElementById('formSubmit').addEventListener('click',function(event){
    event.preventDefault();
    let contactObject = getContactFromForm();
    if(validateContact(contactObject))
    {  
        
        fetch("http://localhost:3000/api/teddies/order",{
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact: contactObject,
                products: getProductsIDArray()
            })
        })
        .then(function(result){
            
            return result.json();
        })
        .then(function(objectResult){
            
            let purchasesArray = [] ;
            if((localStorage.getItem('purchases') != null) && (localStorage.getItem('purchases') != undefined))
            {             
                purchasesArray = JSON.parse(localStorage.getItem('purchases'));                
            }
            let purchaseDate = new Date();
            objectResult.purchaseDate = "" + purchaseDate.getDay()  +"/"+ purchaseDate.getMonth() + "/" +purchaseDate.getFullYear() + "";
            purchasesArray.unshift(objectResult);
            localStorage.setItem('purchases', JSON.stringify(purchasesArray));
            localStorage.removeItem('cart');                                   
            location.replace('./purchase.html');
        })
        .catch(function(error){
            console.log(error);
        });
    }
   
    
});



const computeCartSum = () =>
{
    let cartSum = 0;
    let productsCart = JSON.parse(localStorage.getItem('cart'));
    if(productsCart)
    {
        for(let product of productsCart)
        {
            cartSum+=(product.product.price * product.quantity);
        }
    }
     return cartSum;
}
const displayCartSum = () =>
{
    let cartSum = document.getElementById("price");
    cartSum.innerText = computeCartSum()/100;
    return computeCartSum();
}

const createProductQuantity = (quantity) =>
{
    if((quantity != null) && (quantity!=undefined) )
    {
        let productQuantity = document.createElement('p');
        productQuantity.classList.add('cartProductQuantity');
        productQuantity.innerHTML = "x " + quantity;
        return productQuantity;
    }
}

const displayCartProducts = () =>
{
    let productsBlock = document.getElementById('products');
    let title = document.getElementById('cartTitle');
  
    if((localStorage.getItem('cart') != undefined) && (localStorage.getItem('cart') != null))
    {
        title.innerHTML = "Voici la liste de vos articles";
        let cartArray = JSON.parse(localStorage.getItem('cart'));
        for(let item of cartArray)
        {
            let productCard = buildProductCard(item.product);
            let productQuantity = createProductQuantity(item.quantity);           
            
            let removeButton = createRemoveButton(item.product);
            let productBlock = document.createElement('div');
            productBlock.appendChild(productCard);
            productBlock.appendChild(productQuantity);      
            productBlock.appendChild(removeButton);         

            productsBlock.appendChild(productBlock);           
             
            
        }
    }
    else
    {
        title.innerHTML = "Empty cart";
    }
    
}

const displayCart = () =>
{
    
    displayCartProducts();
    if(displayCartSum() > 0)
    {
        document.getElementById('formSubmit').removeAttribute('disabled');
    }
    updateCartBadge(); 
}

