import { Component,OnInit } from '@angular/core';
import { GuestService } from 'src/app/services/guest.service';

declare var iziToast: any;
declare  var jQuery:any;
declare var $:any;


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements  OnInit{
  public contacto:any= {};
  public load_btn = false;

  constructor(
   private _guesService :GuestService
  ){
  
  }

  ngOnInit(): void {
    
  }
  registro(registroForm:any){
    if(registroForm.valid){
      this.load_btn = true;
      this._guesService.enviar_mensaje_contacto(this.contacto).subscribe(
        response =>{
          console.log(response);
          iziToast.success({
            class: 'text-SUCCESS',
            position: 'topRight',
            message: 'Se envio correctamente el mensaje.'
        });
        this.contacto = {};
        this.load_btn = false;
          
        }
      );


    }else{
      iziToast.error({
        class: 'text-danger',
        position: 'topRight',
          message: 'Los datos del formulario no son validos'
      });
    }

  }
}
