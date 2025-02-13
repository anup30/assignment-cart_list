
let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span'); // no of item selected
let listProducts = [];
let carts = [];

iconCart.addEventListener('click',()=>{
	body.classList.toggle('showCart');
})

closeCart.addEventListener('click',()=>{
	body.classList.toggle('showCart');
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
	if(carts.length>0){
		carts.forEach(cart => {
			totalQuantity += cart.quantity;
			let newCart = document.createElement('div');
			newCart.classList.add('item');
			newCart.dataset.id = cart.product_id;
			let positionProduct = listProducts.findIndex((value)=> value.id==cart.product_id);
			let info = listProducts[positionProduct];
			newCart.innerHTML=`
				<div class="image">
					<img src="${info.image}" alt="">
				</div>
				<div class="name">${info.name}</div>
					<div class="totalPrice">$${info.price*cart.quantity}</div>
					<div class="quantity">
						<span class="minus"><</span>
						<span>${cart.quantity}</span>
						<span class="plus">></span>
					</div>
			`;
			listCartHTML.appendChild(newCart);
		})
	}
	iconCartSpan.innerText = totalQuantity; // innerText(excludes hidden text), textContent
}
// -------------------------------------------------
listCartHTML.addEventListener('click',(event)=>{
	let positionClick = event.target;
	if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
		let product_id= positionClick.parentElement.parentElement.dataset.id;
		//console.log(product_id);
		let type= 'minus';
		if(positionClick.classList.contains('plus')){
			type= 'plus';
		}
		changeQuantity(product_id, type);
	}
})

const changeQuantity= (product_id, type)=>{
	let positionItemInCart = carts.findIndex((value)=> value.product_id==product_id);
	if(positionItemInCart>=0){
		switch(type){
			case 'plus':
				carts[positionItemInCart].quantity += 1;
				break;
			default:
				let valueChange= carts[positionItemInCart].quantity -1;
				if(valueChange>0){
					carts[positionItemInCart].quantity = valueChange;
				}	
				else{
					carts.splice(positionItemInCart, 1);
				}
				break;
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

// at 26:00