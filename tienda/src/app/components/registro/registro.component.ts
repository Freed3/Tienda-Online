import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';



declare  var jQuery:any;
declare var $:any;
declare var iziToast: any;

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public user:any = {};
  public usuario : any = {};
  public token: any;
  public op = 1;
  public new_user : any = {};
  public carrito_logout :Array<any> = [];

  constructor(
    private _clienteService: ClienteService,
    private _router : Router
  ){
 this.token = localStorage.getItem('token');
 if(this.token){
  this._router.navigate(['/']);

 }
  }
  ngOnInit(): void {
    

  }

  
  func_login(loginForm:any){
    if(loginForm.valid){
      
      this.login(this.user.email,this.user.password);
      
    }else{
      iziToast.error({
        class: 'text-danger',
        position: 'topRight',
          message: 'Los datos del formulario no son validos'
      });
    }
  }

  login(email:any,password:any){
    let data : any= {
      email: email,
      password: password
    }

    let ls_cart = localStorage.getItem('cart');
    if(ls_cart != null){
      this.carrito_logout = JSON.parse(ls_cart);
    }else{
      this.carrito_logout = [];
    }

    data.carrito = this.carrito_logout;
    
    this._clienteService.login_cliente(data).subscribe(
      response=>{
        if(response.data == undefined){
          iziToast.error({
            class: 'text-danger',
            position: 'topRight',
              message: response.message
          });
        }else{
          this.usuario = response.data;
          localStorage.removeItem('cart');
          localStorage.setItem('token',response.token);
          localStorage.setItem('_id',response.data._id);
          localStorage.setItem('user_data',JSON.stringify(response.data));
          this._router.navigate(['/']).then(() => {
            window.location.reload();
          })
        }
       
      },
      error=>{
        console.log(error);
      }
    );
  }

  

registro(registroForm:any){
  if(registroForm.valid){
   
    if(this.new_user.password.length <=5){
      iziToast.error({
        class: 'text-danger',
        position: 'topRight',
          message: 'La contraseña debe tener mas de 5 caracteres'
      });
    }else{
      console.log(this.new_user);
      
      this._clienteService.registro_cliente(this.new_user).subscribe(
        response=>{
          console.log(response);
          
          if(response.data != undefined){
            iziToast.success({
              class: 'text-danger',
              position: 'topRight',
                message: 'Se registro correctamente .'
            });
            this.user.email = this.new_user.email;
            this.user.password = this.new_user.password;
            this.login(this.user.email,this.user.password);
          }else{
            iziToast.error({
              class: 'text-danger',
              position: 'topRight',
              message: response.message
          });
          }
        }
      );
    }
          
  }else{
    iziToast.error({
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
    });
  }
}
view_password(){
  let type = $('#password').attr('type');

  if(type == 'text'){
    $('#password').attr('type','password');
    
  }else if(type == 'password'){
    $('#password').attr('type','text');
  }
}
}
