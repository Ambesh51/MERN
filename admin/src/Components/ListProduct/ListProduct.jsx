import React, { useEffect, useState } from 'react'
import "./ListProduct.css"
import cross_icon from "../../assets/cross_icon.png"
import { useNavigate } from 'react-router-dom';

const ListProduct = () => {

  const [allproducts, setAllproducts] = useState([]);
  const navigate = useNavigate();

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/allproducts')
      .then((res) => res.json())
      .then((data => { setAllproducts(data) }))
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const remove_product=async(id)=>{
    await fetch('http://localhost:4000/removeproduct',{
      method:'POST',
      headers:{
        Accept:'application/json',
        'content-Type':'application/json',
      },
      body:JSON.stringify({id:id})
    })
    await fetchInfo(); //calling get function after remove the product
  }
  const HandlerEdit=(productId)=>{
    navigate(`/addproduct/${productId}`);
  }
  return (
    <div className='list-product'>
      <h1 style={{display:"flex",alignItems:"center",flexDirection:'column'}}>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Edit Item</p>
        <p>Remove</p>
      </div>
      <div className="listproducts-allproducts">
        {/* <hr /> */}
        {allproducts.map((product, index) => {
          return <> <div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} className="listproduct-product-icon" alt="" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <button className='edit-btn' onClick={() => { HandlerEdit(product.id) }}>EDIT</button>
            <img className='listproduct-remove-icon' onClick={()=>{remove_product(product.id)}} src={cross_icon} alt="" />
          </div>
            <hr /></>
        })}
      </div>
    </div>
  )
}

export default ListProduct