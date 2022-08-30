var db=require('../config/connection')
//const bcrypt=require('bcrypt')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectId



module.exports={


doSignUp: (userData,callback)=>{

        db.get().collection(collection.USER).insertOne(userData).then((data)=>
        {   
            callback(data)
        }
     )
    

},

doLogin:(userData)=>{

   return new Promise(async(resolve,reject)=>{
    
    let loginStatus=false;
    let response={};
    let user= await db.get().collection(collection.USER).findOne({email:userData.email})
    if(user)
    {
          if(userData.password==user.password)
          {
              response.user=user;
              response.status=true;
              resolve(response)

          }
          else{

              resolve({status:false})
          }

    }

    else{

        resolve({status:false})
    }



   })

},


addToCart:(proId,userId)=>{
   
    let proObj={
        item:objectId(proId),
        quantity:1
    }
   return new Promise(async(resolve,reject)=>{

         let userCart=await db.get().collection(collection.CART).findOne({user:objectId(userId)})
         if(userCart)
         {    
              let proExist=userCart.products.findIndex(product=>product.item==proId)
              console.log(proExist)
              if(proExist!=-1)
              {
                db.get().collection(collection.CART).updateOne({'products.item': objectId(proId)},
                {
                    $inc:{'products.$.quantity':1}
                }).then((data)=>{
                
                   resolve();
                  }) 
              }
            else{

            
              db.get().collection(collection.CART).updateOne({user:objectId(userId)},
              
             {

                    $push:{products:proObj}
                 
              }
              
              
              ) .then((data)=>{
                
                console.log(data)
               resolve();
              }) 
            }   
         }
         else{

            let cartObj={

                user:objectId(userId),
                products:[proObj]
            }
            db.get().collection(collection.CART).insertOne(cartObj).then((data)=>
            {
                 console.log(data);
                resolve(data);
            })
            
         }
   })

},

getCartProducts:(userId)=>{
    

    
    return new Promise(async(resolve,reject)=>{


        let userCart=await db.get().collection(collection.CART).findOne({user:objectId(userId)})
        if(userCart)
        {  
            let cartItem=await db.get().collection(collection.CART).aggregate([

             {
                $match:{user:objectId(userId)}
             },

           {
               $unwind:'$products'
           },
           {
               $project:{
                item:'$products.item',
                quantity:'$products.quantity',
                user:objectId(userId)
               }
           },
           {
                     $lookup:{
                        from:collection.PRODUCT,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                     }
           }
             //{

               // $lookup:{
                    //from:'product',
                   // let:{proList:'$products'},
                   // pipeline:[
                      //  {
                         //   $match:{
                             //   $expr:{
                              //      $in:['$_id',"$$proList"]
                              //  }
                           // }
                       // }
                  //  ],

                    //as:'cartItems'

                //}
            // }


         ]).toArray()

            console.log(cartItem)
            resolve(cartItem)
     
    }

    else{
        resolve(0)
    }

    })


},


getCartCount:(userId)=>{

    return new Promise(async(resolve,reject)=>{
        let count=0;
        let cart=await db.get().collection(collection.CART).findOne({user:objectId(userId)})
        if(cart)
        {
              count=cart.products.length
        }
        console.log(count)
        resolve(count)
    })
},

deleteItem:(cartId,proId)=>{


    return new Promise(async(resolve,reject)=>{

        let cart= await db.get().collection(collection.CART).updateOne({_id:objectId(cartId)},
        {

            $pull:{products:{item:objectId(proId)}}
        })

        resolve()
    })

},

placeOrder:(userId,address,carts)=>{

    return new Promise((resolve,reject)=>{

    carts.forEach((item)=>db.get().collection(collection.ORDER).insertOne({userid:item.user,cartid:item._id,address:address,status:(address.payment==='COD'?'placed':'pending'),quantity:item.quantity,date:new Date(),product:item.product}).then((response)=>{
        console.log(response)
    }))
    db.get().collection(collection.CART).deleteOne({user:objectId(userId)}).then(()=>{
            resolve()
          })
            
    })

   
},

getOrders:(userId)=>{

   return new Promise(async(resolve,reject)=>{



  let orders=await db.get().collection(collection.ORDER).find({userid:objectId(userId)}).toArray();
   
    resolve(orders)
   })

}

}