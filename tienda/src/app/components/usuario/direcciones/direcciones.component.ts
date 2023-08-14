import { Component,OnInit  } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GuestService } from 'src/app/services/guest.service';

declare var $:any;
declare var iziToast: any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent  implements  OnInit {
  public token:any;
  public direccion : any= {
  departamento:'',
    
    principal: false
  };

  public direcciones:Array<any> = [];

  
  public load_data = true;

  constructor(
    private _guestService:GuestService,
    private _clienteService:ClienteService
  ){
    this.token = localStorage.getItem('token');
   
  }
  ngOnInit(): void {
    this.obtener_direccion();
   
  }
  
 
 obtener_direccion(){
  this._clienteService.obtener_direccion_todos_cliente(localStorage.getItem('_id'),this.token).subscribe(
 response=>{
 this.direcciones = response.data;
 this.load_data = false;
 
  
 }

  );

 }

  registrar(registroForm:any){
    if(registroForm.valid){
      let data ={
        destinatario:this.direccion.destinatario,
        apellido:this.direccion.apellido,
        cedula:this.direccion.cedula,
        telefono:this.direccion.telefono,
        direccion:this.direccion.direccion,
        departamento:this.direccion.departamento,
        ciudad:this.direccion.ciudad,
        numero:this.direccion.numero,
        apartamento:this.direccion.apartamento,
        postal:this.direccion.postal,
        principal:this.direccion.principal,
        cliente: localStorage.getItem('_id')

      }
  
      this._clienteService.registro_direccion_cliente(data,this.token).subscribe(
        response=>{
     
         this.direccion = {
          departamento:'',
            principal: false
          };
          
          iziToast.success({
              class: 'text-SUCCESS',
              position: 'topRight',
              message:'Se agrego la nueva direccion  correctamente',
           });
           
        this.obtener_direccion();
        });

      

    }else{
      iziToast.error({
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message:'Los datos del formulario no son validos',
       });
    }
  }

  establecer_principal(id:any){
    this._clienteService.cambiar_direccion_principal_cliente(id,localStorage.getItem('_id'),this.token).subscribe(
      response=>{
        iziToast.success({
          class: 'SUCCESS',
          position: 'topRight',
          message: 'Se actualizó la direccion principal.'
      });
        this.obtener_direccion();
      }
    );
  }

  eliminar(id:any){
    this._guestService.eliminar_direccion_cliente(id,this.token).subscribe(
      response=>{
        iziToast.success({
             class: 'SUCCESS',
            position: 'topRight',
            message: 'Se eliminó la dirección correctamente.'
        });
        this.obtener_direccion();
        
      },
      error=>{
        console.log(error);
        
      }
    )
  }


}
