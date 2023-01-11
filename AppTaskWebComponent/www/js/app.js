import {login, registrate,userLogged,logout, recoverPassword} from './helpers.js'
export default class RegisterDiv extends HTMLElement {
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: 'open'})

    }
    static get observedAttributes(){
        return ['name', 'email', 'password', 'showpassword','registrate','logged','resetpassword','emailtorecover']
    }

    attributeChangedCallback(att,oldv,newv){
        console.log(att, "oldvalue: "+ oldv, "newvalue: " +newv);
        switch(att){
            case 'registrate':
                if(newv ==='true'){
                    this.pRegister.innerText = '¿Ya estás registrado? Haz click aquí para iniciar sesión:'
                    this.divPersonalInfo.append(this.labelName)
                    this.divPersonalInfo.append(this.inputName)
                    this.divForm.append(this.registerButton)
                    this.divForm.removeChild(this.loginButton)
                    this.switchRegisterLoginButton.innerText = 'Iniciar sesión'
                    this.divFormAndReset.removeChild(this.divReset)              
                }
                else{
                    this.switchRegisterLoginButton.innerText = 'Registrarme'              
                    this.pRegister.innerText = '¿Todavía no estás registrado? Hazlo aquí:'
                    this.divForm.append(this.loginButton)
                    this.divForm.removeChild(this.registerButton)
                    this.divPersonalInfo.removeChild(this.labelName)
                    this.divPersonalInfo.removeChild(this.inputName)
                    this.divFormAndReset.append(this.divReset)
                }            
                break;
            case 'logged':
                if(newv === 'true'){
                    this.userLoggedLocal = userLogged();
                    this.userLoggedLocal.then(x=>{
                        if(x.name){
                            this.pWelcome.innerText = `Hola ${x.name}`
                        }
                    })
                    this.shadow.append(this.divRegistered)
                } else{
                    logout();
                    this.userLoggedLocal = userLogged();
                    this.shadow.removeChild(this.divRegistered)
                    this.shadow.append(this.divFormAndReset)
                    this.shadow.append(this.divSwitchLoginRegistrate)
            
                }
                break;
            case 'showpassword':
                if(newv === 'false'){
                    this.inputPassword.type = 'password';
                    this.visiblePasswordButton.innerText = 'mostrar password'; 
                }else{
                    this.inputPassword.type = 'text';
                    this.visiblePasswordButton.innerText = 'ocultar password';
                }
                break;
            case 'resetpassword':
                if(newv === 'true'){
                    this.buttonShowEmailToRecover.innerText = 'volver'
                    this.divReset.append(this.inputEmailToRecoverPassword)
                    this.divReset.append(this.buttonRecoverPassword)
                    this.divFormAndReset.removeChild(this.divForm)
                    this.shadow.removeChild(this.divSwitchLoginRegistrate)
                    this.pForgot.innerText = 'Introduce tu email y te enviaremos un correo con el enlace para recuperar tu cuenta'
                }
                else {
                    //this.divPersonalInfo.removeChild(this.inputEmailToRecoverPassword)
                    this.divReset.removeChild(this.inputEmailToRecoverPassword)
                    this.divReset.removeChild(this.buttonRecoverPassword)
                    this.divFormAndReset.append(this.divForm)
                    this.shadow.append(this.divSwitchLoginRegistrate)
                    this.buttonShowEmailToRecover.innerText= 'Recuperar contraseña'
                    this.pForgot.innerText = '¿Te has olvidado la contraseña?'
                }
        }
    }
    connectedCallback(){
        this.title2 = document.createElement('h2')
        this.title2.innerText = "Inicia sesión"
        
        /*************** DIV INPUTS INFO *******************/
        this.divPersonalInfo = document.createElement('div')
        this.labelName = document.createElement('label')
        this.labelEmail = document.createElement('label')
        this.labelPassword = document.createElement('label')
        this.labelName.innerText = 'Nombre:';
        this.labelEmail.innerText = 'Email:';
        this.labelPassword.innerText = 'Password:';
        this.inputName = document.createElement('input')
        this.inputPassword = document.createElement('input')
        this.inputPassword.type = 'password'
        this.inputEmail = document.createElement('input')
        this.visiblePasswordButton = document.createElement('button');
        this.visiblePasswordButton.innerText = 'mostrar password'
        this.inputName.addEventListener('change', (event) => {
            this.setAttribute('name', event.target.value)
        });
        this.inputPassword.addEventListener('change', (event ) => {
            this.setAttribute('password', event.target.value)
        });
        this.inputEmail.addEventListener('change', (event ) => {
            this.setAttribute('email', event.target.value)
        });
        const showPassword = () => {
            this.setAttribute('showpassword', !(this.getAttribute('showpassword') === 'true'))
        }
        this.visiblePasswordButton.addEventListener('click', showPassword)
        this.divPersonalInfo.append(this.title2)
        this.divPersonalInfo.append(this.labelEmail)
        this.divPersonalInfo.append(this.inputEmail)
        this.divPersonalInfo.append(this.labelPassword)
        this.divPersonalInfo.append(this.inputPassword)
        this.divPersonalInfo.append(this.visiblePasswordButton)
        
        /*************** CHECK IF USER IS LOGGED *******************/
        this.pWelcome = document.createElement('p')
        this.userLoggedLocal = userLogged();
        this.userLoggedLocal.then(x=>{
            if(x.name){
                this.pWelcome.innerText = `Hola ${x.name}`
                this.setAttribute('logged', true)
            }else{
                this.setAttribute('logged', "false")
            }
        })

        /*************** DIV LOGGED IN *******************/
        this.divRegistered = document.createElement('div')
        this.buttonLogout = document.createElement('button');
        this.buttonLogout.innerText='Logout'
        this.buttonLogout.addEventListener('click', ()=> {
            this.setAttribute('logged', false)
        })
        this.divRegistered.append(this.pWelcome)
        this.divRegistered.append(this.buttonLogout)
        
        /*************** DIV FORM *******************/
        this.divForm = document.createElement('div')
        this.loginButton = document.createElement('button');
        this.loginButton.innerText = 'Login'
        this.loginButton.addEventListener('click',()=>{
            this.shadow.removeChild(this.divFormAndReset);
            this.shadow.removeChild(this.divSwitchLoginRegistrate);
            login();
        })
        this.registerButton = document.createElement('button');
        this.registerButton.innerText = 'registrar usuario'
        this.registerButton.addEventListener('click', registrate)
        this.divForm.append(this.divPersonalInfo)
        this.divForm.append(this.loginButton)
        //this.divForm.append(this.registerButton)
        
        
        
        /*************** DIV FORGET *******************/
        this.divFormAndReset = document.createElement('div')
        this.divReset = document.createElement('div')
        this.pForgot = document.createElement('p')
        this.pForgot.innerText = '¿Te has olvidado la contraseña?'
        this.buttonShowEmailToRecover = document.createElement('button');
        this.buttonShowEmailToRecover.innerText= 'Recuperar contraseña';
        this.buttonShowEmailToRecover.addEventListener('click',()=>{
            this.setAttribute('resetpassword', !(this.getAttribute('resetpassword') === 'true'))
        })
        this.divReset.append(this.pForgot)
        this.divReset.append(this.buttonShowEmailToRecover)
        this.inputEmailToRecoverPassword = document.createElement('input')
        this.inputEmailToRecoverPassword.addEventListener('change', (event)=> {
            this.setAttribute('emailtorecover', event.target.value)
        })
        this.buttonRecoverPassword = document.createElement('button')
        this.buttonRecoverPassword.innerText = 'Enviar'
        this.buttonRecoverPassword.addEventListener('click', ()=> {
            recoverPassword()
        })
        this.divFormAndReset.append(this.divForm)
        this.divFormAndReset.append(this.divReset)
        
        /*************** DIV SWITCH REGISTER/LOGIN *******************/
        this.divSwitchLoginRegistrate = document.createElement('div')
        this.pRegister = document.createElement('p');
        this.pRegister.innerText = '¿Todavía no estás registrado? Hazlo aquí:'
        this.switchRegisterLoginButton = document.createElement('button');
        this.switchRegisterLoginButton.innerText = 'Registrarme'
        const switchRegistrateLogin = () => {
            this.setAttribute('registrate', !(this.getAttribute('registrate') === 'true'))
        }
        this.switchRegisterLoginButton.addEventListener('click', switchRegistrateLogin)
        this.divSwitchLoginRegistrate.append(this.pRegister)
        this.divSwitchLoginRegistrate.append(this.switchRegisterLoginButton)
        
        this.shadow.append(this.divRegistered)
    }
}