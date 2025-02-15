
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let clearCart = document.querySelector('.clearCart');
let checkoutCart = document.querySelector('.checkOut');
let body = document.querySelector('body');

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span'); // no of item selected
let listProducts = [];
let carts = [];
//
let totalAmount= document.querySelector('.totalAmount h3'); // grand total $
let itemTypes= document.querySelector('.itemTypes p');
//

iconCart.addEventListener('click',()=>{
	body.classList.toggle('showCart');
})

closeCart.addEventListener('click',()=>{
	body.classList.toggle('showCart');
})

clearCart.addEventListener('click',()=>{
	carts.length=0; // remove all
	addCartToMemory();
	addCartToHTML();
})

checkoutCart.addEventListener('click',()=>{
	if(carts.length<=0){
		alert('cart list is empty. add items to cart please');
	}
	else{
		let khoroch = totalAmount.textContent;
		carts.length=0; // remove all
		addCartToMemory();
		addCartToHTML();
		body.classList.toggle('showCart');
		alert(`$${khoroch},\nThanks for shopping with us!`);
	}
})

const addDataToHTML = ()=>{
	listProductHTML.innerHTML='';
	if(listProducts.length>0){
		listProducts.forEach(product=>{
			let newProduct=document.createElement('div');
			newProduct.classList.add('item');
			newProduct.dataset.id = product.id;
			newProduct.innerHTML=`
				<img src="${product.image}" alt="img">
				<h2>${product.name}</h2>
				<div class="price">$${product.price}</div>
				<button class="addCart">Add To Cart</button>
				<div class="description">${product.description}</div>
			`;
			listProductHTML.appendChild(newProduct);
		})
	}
}

listProductHTML.addEventListener('click',(event)=>{
	let positionClick = event.target;
	if(positionClick.classList.contains('addCart')){
		//alert('+1');
		let product_id= positionClick.parentElement.dataset.id;
		//alert(product_id);
		addToCart(product_id);
	}
})

const addToCart = (product_id)=>{
	let positionThisProductInCart = carts.findIndex((value)=> value.product_id==product_id);
	if(carts.length<=0){
		carts=[{
			product_id: product_id,
			quantity: 1
		}];		
	}
	else if(positionThisProductInCart<0){
		carts.push({product_id:product_id, quantity:1});
	}
	else{
		carts[positionThisProductInCart].quantity += 1;
	}
	console.log(carts);
	addCartToHTML();
	addCartToMemory();
}

const addCartToMemory = ()=>{ 
	localStorage.setItem('cart',JSON.stringify(carts));
}

const addCartToHTML = ()=>{
	listCartHTML.innerHTML='';
	let totalQuantity =0;
	let xItems=0;
	let totalAmnt =0;
	if(carts.length>0){
		carts.forEach(cart => {
			let positionProduct = listProducts.findIndex((value)=> value.id==cart.product_id);	
			let info = listProducts[positionProduct];
			totalQuantity += cart.quantity;
			let newCart = document.createElement('div');
			newCart.classList.add('item');
			newCart.dataset.id = cart.product_id;
			let subTotal = info.price*cart.quantity;
			xItems += cart.quantity;
			totalAmnt += subTotal;
			newCart.innerHTML=`
				<div class="image">
					<img src="${info.image}" alt="">
				</div>
				<div class="name">${info.name}</div>
				<div class="totalPrice">$${subTotal}</div>
				<div class="quantity">
					<span class="minus"><</span>
					<span>${cart.quantity}</span>
					<span class="plus">></span>
					<span class="remove-btn"> <i class="fa-solid fa-trash" style="color: rgb(158, 90, 90);"></i> </span>
				</div>				
			`;
			listCartHTML.appendChild(newCart);
		})
	}
	iconCartSpan.innerText = totalQuantity; // innerText(excludes hidden text), textContent
	totalAmount.textContent =`Total Amount: $${totalAmnt}`;
	itemTypes.textContent = `${xItems} items selected of ${carts.length} types`;
}

listCartHTML.addEventListener('click',(event)=>{
	let positionClick = event.target;
	if(positionClick.classList.contains('minus')){
		let product_id= positionClick.parentElement.parentElement.dataset.id; // learn more about dataset.id ---
		//console.log(product_id);
		changeQuantity(product_id, 'minus');
	}
	else if(positionClick.classList.contains('plus')){
		let product_id= positionClick.parentElement.parentElement.dataset.id;
		changeQuantity(product_id, 'plus');
	}	
	else if(positionClick.classList.contains('remove-btn')){ // can combine remove-btn & fa-trash ? -----
		//console.log('remove button pressed.');
		let product_id= positionClick.parentElement.dataset.id;
		let positionItemInCart = carts.findIndex((value)=> value.product_id==product_id);
		carts.splice(positionItemInCart, 1);
		addCartToMemory();
		addCartToHTML();
	}
	else if(positionClick.classList.contains('fa-trash')){
		//console.log('remove button pressed.');
		let product_id= positionClick.parentElement.parentElement.dataset.id;
		let positionItemInCart = carts.findIndex((value)=> value.product_id==product_id);
		carts.splice(positionItemInCart, 1);
		addCartToMemory();
		addCartToHTML();
	}	
})

const changeQuantity= (product_id, type)=>{
	let positionItemInCart = carts.findIndex((value)=> value.product_id==product_id);
	if(positionItemInCart>=0){
		if(type=='plus'){
			carts[positionItemInCart].quantity += 1;
		}
		else if(type=='minus' && carts[positionItemInCart].quantity>1){
			carts[positionItemInCart].quantity -= 1;
		}		
	}
	addCartToMemory();
	addCartToHTML();
}

const initApp = ()=>{
	// load data from json
	fetch('products.json').then(response => response.json()).then(data =>{
		listProducts = data;
		console.log(listProducts);
		addDataToHTML();
		// get saved cart
		if(localStorage.getItem('cart')){
			carts= JSON.parse(localStorage.getItem('cart'));
			addCartToHTML();
		}
	})
}
initApp();

//----------------------------------------------------
function handleScaling() {
	const target = document.getElementById("idcartTab");
	const windowWidth = window.innerWidth;
	// Apply scale transformation when window is ≤400px
	if (windowWidth <= 400) {
		target.style.transform = "scale(0.5)";
		target.style.transformOrigin = "right top"; //center, right top
	} else {
		target.style.transform = "scale(1)";
	}
}
// Add event listeners for resize and initial load
window.addEventListener("resize", handleScaling);
window.addEventListener("load", handleScaling);

//