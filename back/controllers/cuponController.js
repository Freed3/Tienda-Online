var  Cupon = require('../models/cupon');

const registro_cupon_admin = async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

            let data = req.body;
            let reg = await Cupon.create(data);
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message: 'No  Acceso'});    
             }
    }else{
    res.status(500).send({message: 'No  Acceso'});    
     }

}
const listar_cupones_admin = async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

            var filtro = req.params['filtro'];

            let reg = await Cupon.find({codigo: new RegExp(filtro, 'i')}).sort({createdA: -1});

            res.status(200).send({data:reg});
           
        

         } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }
    
        }else{
            res.status(500).send({message: 'No  Acceso'});
            
        }
    


}

const obtener_cupon_admin = async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

             var id = req.params['id'];
             
            

             try {
                var reg = await Cupon.findById({_id:id});
              
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

 const actualizar_cupon_admin = async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

         var data = req.body;
         var id = req.params['id'];  
         
         let reg = await Cupon.findByIdAndUpdate({_id:id},{
            codigo: data.codigo,
            tipo: data.tipo,
            valor: data.valor,
            limite: data.limite
            
         });

         res.status(200).send({data:reg});
        } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }
    
        }else{
            res.status(500).send({message: 'No  Acceso'});
            
        }


 }
 
 const eliminar_cupon_admin =  async function(req,res){
    if(req.user){
        if(req.user.rol == 'Admin'){

            var id = req.params['id'];

            let reg = await Cupon.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg});

             
        } else{
            res.status(500).send({message: 'No  Acceso'});
    
            }
    
        }else{
            res.status(500).send({message: 'No  Acceso'});
            
        }


 }

 
 const validar_cupon_cliente = async function(req,res){
    if(req.user){
       var cupon = req.params['cupon'];

       var data = await Cupon.findOne({codigo:cupon});
       
      if(data){
        if(data.limite == 0){
            res.status(200).send({data:undefined});
    
            }else{
                res.status(200).send({data:data});
            }
      }else{
        res.status(200).send({data:undefined});
      }
    }else{
    res.status(500).send({message: 'No  Acceso'});    
     }

}
module.exports = {
    registro_cupon_admin,
    listar_cupones_admin,
    obtener_cupon_admin,
    actualizar_cupon_admin,
    eliminar_cupon_admin,
    validar_cupon_cliente

}