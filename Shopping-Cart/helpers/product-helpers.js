var db=require('../config/connection')//getting particualr function
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId

module.exports={


 addProduct:(product,callback)=>{
    
    db.get().collection('product').insertOne(product).then((data)=>{

        callback(data)
    }

    );
 

 },

 getAllProducts:()=>{

     return new Promise(async(resolve,reject)=>{

        let products=await db.get().collection(collection.PRODUCT).find().toArray();

        resolve(products)

     })



 },


   deleteProduct:(prodId)=>{

    return new Promise((resolve,reject)=>{

         db.get().collection(collection.PRODUCT).deleteOne({_id:objectId(prodId)}).then((data)=>{
          
            console.log(data)
            resolve(data)
         })

    })




   },

   getProductDetails:(proId)=>{


     return new Promise(async(resolve,reject)=>{
     
       await db.get().collection(collection.PRODUCT).findOne({_id:objectId(proId)}).then((data)=>{

         resolve(data);
       })

     })

   },

   updateProduct:(product,proId)=>{

        return new Promise(async(resolve,reject)=>{


          await db.get().collection(collection.PRODUCT).updateOne({_id:objectId(proId)},
         
           {$set:{
                 
              name:product.name,
              category:product.category,
              price:product.price,
              description:product.description,
              imagepath:product.imagepath
           }
         
         }).then((data)=>{

            resolve(data)
         })




        })



   },
 





}