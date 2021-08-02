const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require('mongoose');



router.get(`/`, async (req, res) => {

    //Armo la ruta poniendo como opcion que pueda recibir parametros por query
    //localhost:3000/api/v1/products?categories=123456,123456

    let filter = {};
    if(req.query.categories) {
        filter = {category: req.query.categories.split(',')}
    }

  const productList = await Product.find(filter).populate("category");
  // Para devolver campos particulares y no todo el objeto (con el menos le quito ese campo, en este caso el _id por defecto)
  //const productList = await Product.find().select("name image -_id");

  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  /*try{
        const category = await Category.findById(req.body.category);
        res.json(category);
    }catch(err) {
        return res.json({ message: "The category doesn't exist" });
    }*/

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);

  /*try{
        const postProduct = await product.save();
        res.json(postProduct);
    }catch(err){
        res.json({message: err});
    }*/
});

router.put("/:id", async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send("Invalid Product Id")
    }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  );

  if (!product) {
    return res.status(500).send("The product cannot be updated");
  } else {
    res.send(product);
  }
});


router.delete('/:id', async (req, res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product => {
        if(product) {
            return res.status(200).json({
                success: true, 
                message: 'The product is deleted'
            })
        } else {
            return res.status(404).json( {
                success: false, 
                message: 'Product not found'
            })
        }
    }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    })
})

//Devuelve la cantidad de documentos que tengo en la base de datos
router.get("/get/count", async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);
  
    if (!productCount) {
      res.status(500).json({
        success: false,
      });
    }
    res.send( {
        productCount: productCount 
    });
  });


  //Obtiene los productos destacados limitados por count (el + pasa de string a number)
  router.get("/get/featured/:count", async (req, res) => {
      const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({ isFeatured: true }).limit(+count);
  
    if (!products) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(products);
  });

module.exports = router;
