'use strict'


var Cliente = require('../models/cliente');
var Contacto = require('../models/contacto');
var Venta = require('../models/venta');
var Dventa = require('../models/dventa');
var Review = require('../models/review');
var bcrypt =require('bcrypt-nodejs');
var jwt    = require('../helpers/jwt');

var Direccion =require('../models/direccion');
const cliente = require('../models/cliente');


const registro_cliente = async function(req,res){
    //
    var data = req.body;

    var cliente_arr = [];

    cliente_arr = await Cliente.find({email:data.email});
      

    if(cliente_arr.length == 0){

  //REGISTRO
  /**/


   if(data.password){
    bcrypt.hash(data.password,null,null, async function(err,hash){
        if(hash){
            data.password = hash;
         var reg = await Cliente.create(data);
            res.status(200).send({data:reg});
        }else{
            res.status(200).send({message:'Errorserver',data:undefined});  
        }
    })
    }else{
      
        res.status(200).send({message:'No hay contraseña',data:undefined});
    }

    }else{
        res.status(200).send({message:'El correo ya existe en la base de datos',data:undefined});
    }


  
   
}


const login_cliente = async function(req,res){

    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email:data.email});

    if(cliente_arr.length == 0){
        res.status(200).send({message: 'No se encontro el correo', data: undefined});
    }else{
        //LOGIN
        let user = cliente_arr[0];

        bcrypt.compare(data.password,user.password, async function(error,check){
            if(check){
                if(data.carrito.length >= 1){
                    for(var item of data.carrito){
                        await Carrito.create({
                            cantidad:item.cantidad,
                            producto:item.producto._id,
                            variedad:item.variedad.id,
                            cliente:user._id
                        });
                    }
                }

                res.status(200).send({
                    data:user,
                    token: jwt.createToken(user)
                });
            }else{
                res.status(200).send({message: 'La contraseña no coincide', data: undefined});
            }
       
        });

      
    
    
    }
      
}

const listar_clientes_filtro_admin = async function(req,res){
  console.log(req.user);
  
     if(req.user){
        if(req.user.rol == 'Admin'){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];
        
            console.log(tipo);
            if(tipo == null || tipo == 'null'){
                let reg = await Cliente.find();
                res.status(200).send({data:reg});
            }else{
              if(tipo== 'apellidos'){
                 let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
                 res.status(200).send({data:reg});

              }else if(tipo == 'correo'){
                let reg = await Cliente.find({email:new RegExp(filtro,'i')});
                res.status(200).send({data:reg});
        
              }else if(tipo == 'cedula'){
                let reg = await Cliente.find({dni:new RegExp(filtro,'i')});
                res.status(200).send({data:reg});
        
              }
        }
     }else{
        res.status(500).send({message: 'No  Acceso'});

     }

    }else{
        res.status(500).send({message: 'No  Acceso'});
        
    }

}

 const registro_cliente_admin = async function(req,res){
    if(req.user){
     if(req.user.rol == 'Admin'){
         var data = req.body;

         bcrypt.hash('123456789',null,null, async function(err,hash){
            if(hash){
                 data.password = hash;
           let reg = await Cliente.create(data);
            res.status(200).send({data:reg});
            }else{
                res.status(200).send({message:'Hubo un error en el servidor',data:undefined});
            }
 
         
         })


          } else{
            res.status(500).send({message: 'No  Acceso'});
    
         }
    
        }else{
            res.status(500).send({message: 'No  Acceso'});
            
        }
        

 }


 const obtener_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

             var id = req.params['id'];
             
            

             try {
                var reg = await Cliente.findById({_id:id});
              
                 res.status(200).send({data:reg});

             } catch (error) {
                res.status(200).send({data:undefined});
                
             }  


         
      
        } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }
    
        }else{
            res.status(500).send({message: 'No  Acceso'});
            
        }


 }

 const actualizar_cliente_admin =  async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

             var id = req.params['id'];
             var data = req.body;

             var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres : data.nombres,
                apellidos : data.apellidos,
                email : data.email,
                 telefono : data.telefono,
                 f_nacimiento : data.f_nacimiento,
                 dni : data.dni,
                 genero : data. genero
             })
             res.status(200).send({data:reg});
             
        } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }
    
        }else{
            res.status(500).send({message: 'No  Acceso'});
            
        }


 }
 const eliminar_cliente_admin =  async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

            var id = req.params['id'];

            let reg = await Cliente.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});

             
        } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }
    
        }else{
            res.status(500).send({message: 'No  Acceso'});
            
        }

  

 }
 const obtener_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];
             
        
        try {
           var reg = await Cliente.findById({_id:id});
         
            res.status(200).send({data:reg});
        } catch (error) {
           res.status(200).send({data:undefined});
           
        }  

        } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }

    
 }
 const actualizar_perfil_cliente_guest = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var data = req.body;
  
        console.log(data.password);

       if(data.password){
        console.log('Con contraseña');
       bcrypt.hash(data.password,null,null, async function(err,hash){
        var reg = await Cliente.findByIdAndUpdate({_id:id},{
            nombres: data.nombres, 
            apellidos: data.apellidos,
            telefono :data.telefono,
            f_nacimiento: data.f_nacimiento,
            dni: data.dni,
            genero: data.genero,
            pais: data.pais,
            password: hash,
        });
         
    res.status(200).send({data:reg});
       });
       }else{
        console.log('Sin contraseña');
        var reg = await Cliente.findByIdAndUpdate({_id:id},{
            nombres: data.nombres,
            apellidos: data.apellidos,
            telefono :data.telefono,
            f_nacimiento: data.f_nacimiento,
            dni: data.dni,
            genero: data.genero,
            pais: data.pais,
        });
        res.status(200).send({data:reg});
       }
       } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }
 }

/********************************************************* */
//DiRECIONES

 
const  registro_direccion_cliente  = async function(req,res){
    if(req.user){
     
        var data =  req.body;
        if(data.principal){
        let direcciones = await Direccion.find({cliente:data.cliente});

        direcciones.forEach(async element =>{
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});

        });
        }
         
        let reg = await Direccion.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message:  'No  Acceso'});
    }
}  
const obtener_direccion_todos_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];

        let direcciones = await Direccion.find({cliente:id}).populate('cliente').sort({createdAt:-1});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message:  'No  Acceso'});
    }
}

const cambiar_direccion_principal_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var cliente = req.params['cliente'];

        let direcciones = await Direccion.find({cliente:cliente});

        direcciones.forEach(async element => {
            await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
        });

        await Direccion.findByIdAndUpdate({_id:id},{principal:true});
 
        res.status(200).send({data:true});
    }else{
        res.status(500).send({message:  'No  Acceso'});
    }
}

const eliminar_direccion_cliente = async function(req,res){
    if(req.user){
        var id = req.params['id'];
     
        let direcciones = await Direccion.findByIdAndDelete({_id:id},{status:false});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message: 'No  Acceso'});
    }
}


const obtener_direccion_principal_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        var direccion = undefined;
     
        direccion = await Direccion.findOne({cliente:id,principal:true});
        
        if(direccion == undefined){
            res.status(200).send({data:undefined});
        }else{
            res.status(200).send({data:direccion});
        }
        
    }else{
        res.status(500).send({message: 'No  Acceso'});
    }
}

/*********************************************************CONTACTO */

const enviar_mensaje_contacto = async function(req,res){

       let data = req.body;
       data.estado = 'Abierto';
       let reg =  await Contacto.create(data);
       res.status(200).send({data:reg});
}

/**ORDENES */
const obtener_ordenes_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];
       
        let reg = await Venta.find({cliente:id}).sort({createdAt:-1});

        if(reg.length >= 1){
            res.status(200).send({data:reg});
        }else if(reg.length == 0){
            res.status(200).send({data:undefined});
        }
     

        
    }else{
        res.status(500).send({message: 'No  Acceso'});
    }
}


const obtener_detalles_ordenes_cliente  = async function(req,res){
    if(req.user){
        var id = req.params['id'];

     try{
        let venta = await Venta.findById({_id:id}).populate('direccion').populate('cliente');
        let detalles = await Dventa.find({venta:id}).populate('producto');

        res.status(200).send({data:venta,detalles:detalles});

     }catch(error){
        res.status(200).send({data:undefined});

     }

        
    }else{
        res.status(500).send({message: 'No  Acceso'});
    }
}

/*REVIEWS*/
const  emitir_review_producto_cliente  = async function(req,res){
    if(req.user){
       let data  = req.body;
       let reg = await Review.create(data);
       res.status(200).send({data:reg});

    }else{
        res.status(500).send({message:  'No  Acceso'});
    }
}


const obtener_review_producto_cliente  = async function(req,res){
    let id  = req.params['id'];

      let reg = await Review.find({producto:id}).sort({createdAt: -1});
      res.status(200).send({data:reg});
}

const  obtener_reviews_cliente  = async function(req,res){
    if(req.user){
      let id = req.params['id'];
       let reg = await Review.find({cliente:id}).populate('cliente');
       res.status(200).send({data:reg});

    }else{
        res.status(500).send({message:  'No  Acceso'});
    }
}


module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_principal_cliente,
    eliminar_direccion_cliente,
    obtener_direccion_principal_cliente,
    enviar_mensaje_contacto,
    obtener_ordenes_cliente,
    obtener_detalles_ordenes_cliente,
    emitir_review_producto_cliente,
    obtener_review_producto_cliente,
    obtener_reviews_cliente
}