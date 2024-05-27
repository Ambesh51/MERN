import React, { createContext, useEffect, useState } from "react";
// import all_product from "../Components/Assests/all_product"
export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0
    }
    return cart
}

const ShopContextProvider = (props) => {
const [all_product,setAllproducts] = useState([])
    const [cartItems, setCartItems] = useState(getDefaultCart())


    useEffect(()=>{
        fetch('http://localhost:4000/allproducts')
        .then((res)=>res.json())
        .then((data)=>{setAllproducts(data)})

            //get cart item
            // if(localStorage.getItem('auth-token')){
            //     console.log("get  cart---------");
            //    fetch('http://localhost:4000/getcart',{
            //     method:'POST',
            //     headers:{
            //         Accept:'application/json',
            //         'auth-token':`${localStorage.getItem('auth-token')}`,
            //         'Content-Type':'application/json'
            //     },
            //     body:"",
            //    }).then((res)=>res.json())
            //    .then((data)=>setCartItems(data))
            // }

    },[])

 
        const fetchCartData = (logout) => {
            console.log("testing cart")
            if(logout){return setCartItems([]) }
           else if(localStorage.getItem('auth-token')) {
                fetch('http://localhost:4000/getcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: "",
                })
                .then((res) => res.json())
                .then((data) => setCartItems(data))
                .catch((error) => console.error("Error fetching cart data:", error));
            }
        };
    
        // Fetch cart data when the component mounts and when auth-token changes
        
  



    const addToCart = (itemId) => {
        console.log("cart fetch")
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/addtocart',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId})
            })
            .then((res)=>res.json())
            .then((data)=>console.log("cartData",data))
            
        }
        console.log("add tot cart", cartItems)
        console.log("id", itemId)
    
    }
    const removeFromCart = (ItemId) => {
        setCartItems((prev) => ({ ...prev, [ItemId]: prev[ItemId] - 1 }))
        if(localStorage.getItem( "auth-token")){
            fetch('http://localhost:4000/removefromcart',{
                method:'POST',
                headers:{
                    Accept: 'application/json',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":ItemId})
            })
            .then((res)=>res.json())
            .then((data)=>console.log("cartData",data))
    }
    }
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));
                totalAmount += itemInfo.new_price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let TotalItems = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                TotalItems += cartItems[item]
            }
        }
        return TotalItems

    }
    const contextValue = { all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems,fetchCartData };



    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;