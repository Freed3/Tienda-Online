import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

declare  var jQuery:any;
declare var $:any;
declare var iziToast: any;




@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent  implements OnInit  {

  public id:any;
  public _iduser:any;
  public token:any;
  public producto : any  = {};
  public inventarios : Array<any>=[];
  public arr_invantario :Array<any>=[];
  public inventario : any = {
    talla: '',
    cantidad: 1
  }

  public load_btn = false;


  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) { 
    this.token = localStorage.getItem('token');
    this._iduser = localStorage.getItem('_id');
    console.log(this._iduser);
    
  }

  ngOnInit(): void {
    
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
      
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
          if(response.data == undefined){
            this.producto = undefined;

          }else{
            this.producto = response.data;

            this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
              response=>{
                this.inventarios = response.data;
                this.inventarios.forEach(element => {
                  this.arr_invantario.push({
                    admin: element.admin.nombres +''+ element.admin.apellidos,
                    cantidad: element.cantidad,
                    talla: element.talla
                  });
                  
                });
  
              },
              error=>{

               }
              )
          
          } 
          },

          error=>{

          }
        );
  
      }
    );
  }
  eliminar(id:any){
    this.load_btn = true;
    this._productoService.eliminar_inventario_producto_admin(id,this.token).subscribe(
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

        this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
          response=>{
            this.inventarios = response.data;
            console.log(this.inventarios);
            
            
       
          },
          error=>{
          console.log(error);
          
           }
          )
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
  registro_inventario(inventarioForm:any){
    if(inventarioForm.valid){
   
          
      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this._iduser,
        talla: inventarioForm.value.talla
      }

      console.log(data);
      
      this._productoService.registro_inventario_producto_admin(data,this.token).subscribe(
        response=>{
          iziToast.success({
            class: 'text-SUCCESS',
            position: 'topRight',
            message:'Se agrego el nuevo stock al producto',
           });
          
           this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
            response=>{
              this.inventarios = response.data;

            },
            error=>{

             }
            )
        },
        error=>{
          console.log(error);
          
        }
      )
       
    }else{
      iziToast.error({
        title: 'ERROR',
        class: 'text-danger',
        position: 'topRight',
        message:'Debe subir una portada para registrar',
       });
    }
  }
  donwload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");
  
    worksheet.addRow(undefined);
    for (let x1 of this.arr_invantario){
      let x2=Object.keys(x1);
  
      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }
  
    let fname='REP01- '; 
  
    worksheet.columns = [
      { header: 'Trabajador', key: 'col1', width: 30},
      { header: 'Cantidad', key: 'col2', width: 15},
      { header: 'Proeedor', key: 'col3', width: 25},
    ]as any;
  
  
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });
   }
}
