import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid';

declare  var jQuery:any;
declare var $:any;
declare var iziToast: any;

@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css']
})
export class GaleriaProductoComponent {

  
  public producto: any={};
  public id: any;
  public token : any;

  public file : any  = undefined;
 public load_btn = false;
 public load_btn_eliminar = false;
 public url: any;


 constructor(
  private _route:ActivatedRoute,
  private _productoService:ProductoService
){
  this.token = localStorage.getItem('token');
  this.url = GLOBAL.url;
  this._route.params.subscribe(
    params=>{
      this.id = params['id'];
    
      this.init_data();

    }
  );
}

init_data(){
    this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
        response=>{
        if(response.data == undefined){
          this.producto = undefined;

        }else{
          this.producto = response.data;

        
        
        } 
        console.log(this.producto);
        
        },

        error=>{

        }
      );
}
  ngOnInit(): void {
    
  }
  fileChangeEvent(event:any):void{
 
    let file :any = undefined;
    if(event.target.files && event.target.files[0]){
    file = <File>event.target.files[0];

    
    }else{
      iziToast.error({
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message:'No hay un imagen de envio',
     }); 
    }
 if(file.size <= 4000000){
  if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){
  
    this.file = file ;
 
  }else{
    iziToast.error({
      title: 'ERROR',
      class: 'text-danger',
      position: 'topRight',
      message:'El archivo debe ser una imagen',
     });
     $('#input-img').val('');
     this.file = undefined;
  }
 }else{
  iziToast.error({
    title: 'ERROR',
    class: 'text-danger',
    position: 'topRight',
    message:'La imagen no puede superar los 4MB',
   });
   $('#input-img').val('');
   this.file = undefined;

 }
 console.log(this.file);
 
  }
  subir_imagen(){
    if(this.file != undefined){
      let data = {
        imagen: this.file,
        _id: uuidv4()
      }
      console.log(data);
      this._productoService.agregar_imagen_galeria_admin(this.id,data,this.token).subscribe(
        response=>{
          this.init_data();
          $('#input-img').val('');
   
        
        }
      );
    }else{
      iziToast.error({
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
          message: 'Debe seleccionar una imagen para subir'
      });
    }
  }
  eliminar(id: any){
    this.load_btn_eliminar = true;
    
    this._productoService.eliminar_imagen_galeria_admin(this.id,{_id:id},this.token).subscribe(
        response=>{
          iziToast.success({
            class: 'text-SUCCESS',
            position: 'topRight',
            message:'Se elimino correctamente el  producto.'
           });
       
           const modal = document.getElementById('delete-' + id);
           if (modal) {
             modal.classList.remove('show');
           }
           const modalBackdrop = document.querySelector('.modal-backdrop');
           if (modalBackdrop) {
             modalBackdrop.parentNode?.removeChild(modalBackdrop);
             document.body.classList.remove('modal-open');
           }
  
          
           this.load_btn_eliminar = false;
           this.init_data();
  
        },
        error=>{
          iziToast.error({
            class: 'text-SUCCESS',
            position: 'topRight',
            message:'Ocurrio un error en el servidor.'
           });
          console.log(error);
          this.load_btn = false;
  
          
  
        }
  
      )
  
    }
  
}
