var express = require('express');
var router = express.Router();
var productHelper=require("../helpers/product-helpers")
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');




/* GET users listing. */
router.get('/', function(req, res, next) {

 productHelper.getAllProducts().then((products)=>{
  
  res.render('admin/view-products',{admin:true,products})

 }) 

});


router.get('/add-product', function(req, res, next) {

   res.render('admin/add-product',{admin:true})
})

router.post('/add-product', function(req, res) {
    
    let image=req.files.image
    const id = uuidv4();
    image.mv('./Shopping-Cart/public/product-images/'+id+'.jpg')
    req.body.imagepath=id;

    productHelper.addProduct(req.body,(result)=>{
      
      res.render('admin/add-product',{admin:true})
    })

    
     
  });

  router.get('/delete-product/:id', function(req, res,next) {

          let proId=req.params.id;
          productHelper.deleteProduct(proId).then((data)=>
          {
              res.redirect('/admin/')
          })
        console.log(proId)
  })

router.get('/edit-product/:id',function(req,res,next){


  productHelper.getProductDetails(req.params.id).then((data)=>{

          console.log(data)
         res.render('admin/edit-product',{data})

  })


});


router.post('/edit-product/:exId', function(req, res) {

  let image=req.files.image
  image.mv('./public/product-images/'+req.params.exId+'.jpg')
  req.body.imagepath=req.params.exId;

  productHelper.updateProduct(req.body,req.params.exId).then(()=>{

     res.redirect('/admin')

   
  })


})



module.exports = router;
