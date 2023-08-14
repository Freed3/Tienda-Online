import { Component,OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare  var jQuery:any;
declare var $:any;
declare var iziToast: any;


@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent  implements OnInit{
  
  public clientes : Array<any>=[];
  public filtro_apellidos = "";
  public filtro_correo = "";
  public filtro_cedula = "";

 
  public page = 1;
  public pageSize = 20;
  public token :any;
  public load_data = true;

    public load_btn = false;

  constructor(  
    private _clienteService : ClienteService,
    private _adminService: AdminService
    ){
   this.token = this._adminService.getToken();
  
    
   
   }

  ngOnInit(): void {
   this.init_Data();
  }
 init_Data(){
  this._clienteService.listar_clientes_filtro_admin(null,null,this.token).subscribe(
    response=>{
    
      this.clientes =response.data;
      this.load_data = false;
     /* setTimeout(()=>{
    
      }, 3000)*/
   

    },
    error=>{
     console.log(error);
     
    }
  );
 }
  filtro(tipo: any){
    var fitro ;
     if(tipo == 'apellidos'){
     if(this.filtro_apellidos){
      this.load_data = true;
      this._clienteService.listar_clientes_filtro_admin(tipo,this.filtro_apellidos,this.token).subscribe(
        response=>{
        
          this.clientes = response.data;
          this.load_data = false;
       
       
  
        },
        error=>{
         console.log(error);
         
        }
        );
     }else{
      this.init_Data();
     }
      
     }else if (tipo == 'correo'){
      if(this.filtro_correo){
        this.load_data = true;
        this._clienteService.listar_clientes_filtro_admin(tipo,this.filtro_correo,this.token).subscribe(
          response=>{
          
            this.clientes =response.data;
            this.load_data = false;
         
    
          },
          error=>{
           console.log(error);
           
          }
          );
        }else{
          this.init_Data();
        }

   
 }else if (tipo == 'cedula'){
    if(this.filtro_cedula){
      this.load_data = true;
      this._clienteService.listar_clientes_filtro_admin(tipo,this.filtro_cedula,this.token).subscribe(
        response=>{
        
          this.clientes =response.data;
          this.load_data = false;
       
  
        },
        error=>{
         console.log(error);
         
        }
        );
      }else{
        this.init_Data();
      }

   }
  }
  eliminar(id: any) {
    this.load_btn = true;
  this._clienteService.eliminar_cliente_admin(id, this.token).subscribe(
    response => {
      iziToast.success({
        class: 'text-SUCCESS',
        position: 'topRight',
        message: 'Se eliminó correctamente el cliente',
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
      this.init_Data();
     
    },
    error => {
      console.log(error);
    }
  );
}


}
