const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");// get access in our backed directory in our express app
const cors = require("cors");

// GBscVSEiv9BTX7tZ
// kuISnUwSoHijhfRn
// 152.58.22.47
app.use(express.json());//with the help of express.json() whatever req we will get from response that will be automatically passed through json
app.use(cors())//using this our react connect to express app on 4000 port

//Database connection with mongoDB
// mongoose.connect("mongodb+srv://greatstackdev:Nashik@125@cluster0.riog3ha.mongodb.net/e-commerce");
mongoose.connect("mongodb+srv://greatstackdev:Nashik%40125@cluster0.riog3ha.mongodb.net/e-commerce");

//API creation

app.get("/", (req, res) => {
    res.send("Express App is Running");
})

//image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (require, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
//using multer we will create a upload function and in that one we will pass this configration
const upload = multer({ storage: storage })
//creating upload end point
// app.use('./images',express.static('upload/images'))
app.use('/images', express.static(path.join(__dirname, 'upload', 'images')))

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: 'http://localhost:' + port + '/images/' + req.file.filename
    })
})

//Schema for creating products

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    availbale: {
        type: Boolean,
        default: true
    }
})

//Add product
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});//All products in an array
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        // date:req.body.date,
        // availbale:req.body.availbale
    })
    console.log("product", product)
    await product.save();
    console.log("saved");
    res.json({
        success: true,
        name: req.body.name
    })
})



//Creating API for deleting Products

app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id })
    console.log("Removed")
    res.json({
        success: true,
        name: req.body.name
    })
})

//edit the product
// Edit product
app.put('/updateproduct/:id', async (req, res) => {
   const Id=req.params.id;
   console.log("id",Id);
    const result = await Product.replaceOne({id:Id},req.body) 
   console.log("result",result);
    res.json({updatedCount:result.modifiedCount})
   
});




//Creating API GEtting all Products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({})
    console.log("All Products Fetched");
    res.send(products);

})

// Schema creating for User Model

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true, //only one time he can use single email id for creating an account
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

//here creating an end point for registering the user
app.post('/signup', async (req, res) => {

    let check = await Users.findOne({ email: req.body.email }); // check already existed user or not
    if (check) {
        return res.status(400).json({ success: false, error: "existing user found with same email address" })
    }
    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save()

    const data = { // creating token using this user Objet
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_key') //our token is not readable because 'secret_ecom' added as a salt.
    res.json({ success: true, token })

})

// creating endpoint for user login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email })
    if (user) {
        const passCompare = req.body.password === user.password
        if (passCompare) {
            const data = {
                user: { id: user.id }
            }
            const token = jwt.sign(data, 'secret_key')
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "Wrong Password" });
        }

    }
    else {
        res.json({ success: false, errors: "Wrong Email Id" })
    }
})

//creating endpoint for newCollection
app.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

// creating enpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
    let products = await Product.find({ category: 'women' })
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in Women fetched");
    res.send(popular_in_women);
})

//creating middelware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" }) //unauthorized
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_key');
            console.log("data verify", data)
            req.user = data.user
            next()
        } catch (error) {
            res.status(401).send({ errors: 'Please authenticate with valid token' })
        }
    }
}
//creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log(req.body.itemId, "Added");
    console.log(req.user, "user");

    // let userData = await Users.findOne({_id:req.user._id})
    let userData = await Users.findOne({ _id: req.user.id });

    console.log("userData", userData)
    userData.cartData[req.body.itemId] += 1
    setTimeout(() => {
        console.log(userData.cartData[req.body.itemId])
        console.log(req.body.itemId);
        console.log(userData.cartData);
    })
    await Users.findOneAndUpdate(
        { _id: req.user.id }, // Filter: Find the document by its _id
        { $set: { cartData: userData.cartData } } // Update: Set the cartData field to the updated value
    );
    res.json({ message: "Added" });
})

//creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{

    let userData = await Users.findOne({ _id: req.user.id });
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -= 1
    }
    console.log("userData.cartData[req.body.itemId",req.body.itemId)
    console.log("userData.cartData[req.body.itemId",userData.cartData[req.body.itemId])

   
    await Users.findOneAndUpdate(
        { _id: req.user.id }, // Filter: Find the document by its _id
        { $set: { cartData: userData.cartData } } // Update: Set the cartData field to the updated value
    );
    res.json({ message: "Removed" });
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart",req.user);
    let userData= await Users.findOne({_id:req.user.id})
    console.log("UserData",userData)
    res.json(userData.cartData);
})
app.listen(port, (error) => {
    if (!error) console.log(`Server is running at ${port}`)
    else console.log(`Error: ${error}`)

});