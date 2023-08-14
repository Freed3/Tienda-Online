import { Component,OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast: any;
declare  var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css']
})
export class IndexDescuentoComponent implements OnInit {
  public load_data = true;
  public filtro = '';
  public token :any;
  public  descuentos : Array<any> =[];

  public url: any;
  public page = 1;
  public pageSize = 20;


  
  public load_btn = false;
  constructor(
    private _descuentoService : DescuentoService
   ){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
   }
  ngOnInit(): void {
   this.init_data();
  }
  init_data(){
    this._descuentoService.listar_descuentos_admin(this.filtro,this.token).subscribe(
      response=>{
        console.log(response);
        this.descuentos = response.data;
       
        this.descuentos.forEach(element => {
          var tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/1000;
          var tt_fin = Date.parse(element.fecha_fin+"T00:00:00")/1000;

          var today = Date.parse(new Date().toString())/1000;
  
          if(today>tt_inicio){
            element.estado = 'Expirado';

          }
          if(today<tt_inicio){
            element.estado = 'Proximamente';

          }

          if(today>= tt_inicio && today<= tt_fin){
            element.estado = 'En progreso';

          }
         
          
        });
        this.load_data = false;
  
     
  
      },
      error=>{
       console.log(error);
       
      }
      );
  }
  filtrar(){ 
    if(this.filtro){
      this._descuentoService.listar_descuentos_admin(this.filtro,this.token).subscribe(
        response=>{
          console.log(response);
          this.descuentos = response.data;
          this.load_data = false;
    
        },
        error=>{
         console.log(error);
         
        }
        );
      

    }else{
      iziToast.error({
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message:'Ingrese un filtro para buscar',
      });
    }
    
    
  }
  resetear(){
    this.filtro = "";
    this.init_data();

    
  }
  eliminar(id: any){
    this.load_btn = true;
    this._descuentoService.eliminar_descuento_admin(id,this.token).subscribe(
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

         this.load_btn = false;

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
