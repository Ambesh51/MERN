import React, { useState, useEffect } from 'react'
import './AddProduct.css'
import upload_ared from "../../assets/upload_area.svg"
import { useParams } from 'react-router-dom';

const AddProduct = () => {
    const [img, setImg] = useState(false);
    const [imgUpload, setImguplaod] = useState(false);
    const [Obj, setObj] = useState({});
    const [productDetails, setProductDetails] = useState({
        name: Obj.name || "",
        image: Obj.image || "",
        category: "women",
        new_price: Obj.new_price || "",
        old_price: Obj.old_price || "",
    })

    let { productId } = useParams();
    console.log("id", productId)

    //  for edit product item
    useEffect(() => {
        const fetchInfo = async () => {
            await fetch('http://localhost:4000/allproducts')
                .then((res) => res.json())
                .then((data) => {
                    const filterObject = data.find(item => item.id === parseInt(productId))
                    if (filterObject) {
                        setObj(filterObject)
                        setProductDetails({
                            id: filterObject.id || "",
                            name: filterObject.name || "",
                            image: filterObject.image || "",
                            category: filterObject.category || "",
                            new_price: filterObject.new_price || "",
                            old_price: filterObject.old_price || "",
                        });

                        console.log("setImg(filterObject.image);", filterObject.image)
                        setImg(filterObject.image);
                    }
                })
        };

        if (productId) {
            fetchInfo();
        }

    }, [productId]);
    useEffect(() => {
        console.log("obj", Obj)
        console.log("productDetails", productDetails)

    }, [Obj])

    const Update_product = async () => {

        console.log("productDetails", productDetails)
        console.log("imgUpload",imgUpload)
        let responseData;
        let product = { ...productDetails };

        let formData = new FormData();
        
        if (imgUpload) {
            formData.append("product", imgUpload);
            await fetch('http://localhost:4000/upload', {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: formData,
            }).then((res) => res.json()).then((data) => responseData = data);
    
            if (responseData.success) {
                product.image = responseData.image_url;
            }
        }

        // await fetch('http://localhost:4000/upload', {
        //     method: 'POST',
        //     headers: { Accept: 'application/json' },
        //     body: formData,
        // }).then((res) => res.json()).then((data) => responseData = data)
        // if (responseData.success) {
        //     product.image = responseData.image_url
        //     setProductDetails(product)
           

            try {
                const response = await fetch(`http://localhost:4000/updateproduct/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(product)
                });
                const data = await response.json();
                console.log("updated", data); // Log the response data
                return data;
            } catch (error) {
                console.error('Error updating product:', error);
            }
        
    };

    //Add product Item

    const imageHandler = (e) => {
        const file = e.target.files[0];
        setImguplaod(file)
        setImg(URL.createObjectURL(file));
    }
    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
    }

    const Add_Product = async () => {
        debugger
        let responseData;
        let product = { ...productDetails };

        let formData = new FormData();
        formData.append("product", imgUpload)

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: formData,
        }).then((res) => res.json()).then((data) => responseData = data)
        if (responseData.success) {
            product.image = responseData.image_url
            setProductDetails(product)


            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Use 'Content-Type' instead of 'Accept'
                },
                body: JSON.stringify(product)
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        alert("Product Added");
                    } else {
                        alert("Failed");
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            console.log(product, "====");
        }

    }
    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} type="text" onChange={changeHandler} name="name" id="" placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" id="" placeholder='Type here' />
                </div>

                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" id="" placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={img ? img : upload_ared} className="addproduct-thumnail-img" alt="" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
            </div>
            {
                Object.entries(Obj).length === 0 ? <button className='addproduct-btn' onClick={() => { Add_Product() }}>ADD</button> : <button className='addproduct-btn' onClick={() => { Update_product() }}>Update</button>
            }
        </div>
    )
}

export default AddProduct