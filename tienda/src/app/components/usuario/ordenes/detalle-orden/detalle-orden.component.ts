import { Component,OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ClienteService } from 'src/app/services/cliente.service';


declare var $:any;
declare var iziToast: any;



@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit{


  public url:any;
  public token:any;
  public orden :any ={};
  public detalles :Array<any> =[];
  public load_data = true;
  public id:any;

  public estrella = 5;
  public review :any={};

  starsSelected: number = 0;

  constructor(
    private _clienteService:ClienteService,
    private _route:ActivatedRoute
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
  ngOnInit(): void {
   
  }

  init_data(){
    this._clienteService.obtener_detalles_ordenes_cliente(this.id,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.orden = response.data;
          response.detalles.forEach((element: any) => {
             this._clienteService.obtener_review_producto_cliente(element.producto._id).subscribe(
              response=>{
                let emitido = false;

                response.data.forEach((element: any) => {
                  if(element._cliente == localStorage.getItem('id')){
                    emitido = true;

                  }
                }); 
                element.estado = emitido;            
              }
             );
          });
          this.detalles = response.detalles;
          this.load_data = false;
        }else{
          this.orden = undefined;
        }
        
      
    
    });
  }

  openModal(item:any){
    this.review= {};
    this.review.producto= item.producto._id;
    this.review.cliente = item.cliente;
    this.review.venta = this.id;
   
    

  }
  rate(stars: number) {
    this.starsSelected = stars;
    console.log(stars);
    
  }
emitir(id:any){
  if(this.review.review){
    if(this.starsSelected && this.starsSelected >=0){
   this.review.estrellas = this.starsSelected;

   this._clienteService.emitir_review_producto_cliente(this.review,this.token).subscribe(
    response=>{
      iziToast.success({
        class: 'text-SUCCESS',
        position: 'topRight',
        message:'Se emitio correctamente la reseña',
       });
       const modal = document.getElementById('review-' + id);
       if (modal) {
         modal.classList.remove('show');
       }
       const modalBackdrop = document.querySelector('.modal-backdrop');
       if (modalBackdrop) {
         modalBackdrop.parentNode?.removeChild(modalBackdrop);
         document.body.classList.remove('modal-open');
       }
       this.init_data();

      
    }
   );
   
    }else{
      iziToast.error({
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message:'Selecciones el numero de estrellas',
       });
    }

  }else{
    iziToast.error({
      title: 'ERROR',
      class: 'text-danger',
      position: 'topRight',
      message:'Ingrese un mensaje de la reseña',
     });
  }

}
}
