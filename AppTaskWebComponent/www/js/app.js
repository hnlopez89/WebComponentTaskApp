import {login, registrate,userLogged,logout, recoverPassword} from './helpers.js'
export default class RegisterDiv extends HTMLElement {
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: 'open'})
        let style = `
        <style>
        .divPersonalInfo {
            display: flex;
            flex-direction: column;
        }
        .alert {
            color: red;
            font-weight: bold;
            font-size:12px;
        }
        </stlye>
        `
        this.shadow.innerHTML = style
    

    }
    static get observedAttributes(){
        return ['name',
            'email',
            'password',
            'showpassword',
            'registrate',
            'logged',
            'resetpassword',
            'emailtorecover',
            'passwordcheck',
            'registrationsuccess']
    }

    attributeChangedCallback(att,oldv,newv){
        console.log(att,
"oldvalue: "+ oldv, "newvalue: " +newv);
        switch(att){
            case 'registrate':
                if(newv ==='true'){
                    this.pRegister.innerText = '¿Ya estás registrado? Haz click aquí para iniciar sesión:'
                    this.divPersonalInfo.append(this.labelPasswordCheck)
                    this.divPersonalInfo.append(this.inputPasswordCheck)
                    this.divPersonalInfo.append(this.labelName)
                    this.divPersonalInfo.append(this.inputName)
                    this.divForm.append(this.registerButton)
                    this.divForm.removeChild(this.loginButton)
                    this.switchRegisterLoginButton.innerText = 'Iniciar sesión'
                    this.divFormAndReset.removeChild(this.divReset)
                    this.title2.innerText = 'Registrate'              
                }
                else{
                    this.switchRegisterLoginButton.innerText = 'Registrarme'              
                    this.pRegister.innerText = '¿Todavía no estás registrado? Hazlo aquí:'
                    this.divPersonalInfo.removeChild(this.labelPasswordCheck)
                    this.divPersonalInfo.removeChild(this.inputPasswordCheck)
                    this.divForm.append(this.loginButton)
                    this.divForm.removeChild(this.registerButton)
                    this.divPersonalInfo.removeChild(this.labelName)
                    this.divPersonalInfo.removeChild(this.inputName)
                    this.divFormAndReset.append(this.divReset)
                    this.title2.innerText = 'Inicia sesión'
                }            
                break;
                case 'email':
                    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                    if(!newv.match(mailformat)) {
                        this.divPersonalInfo.append(this.pWrongEmail)
                    } else if(newv.match(mailformat)) {
                        this.divPersonalInfo.removeChild(this.pWrongEmail)
                    }
                    break;
                case 'password':
                    const passwordformat =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
                    if(!newv.match(passwordformat) && this.getAttribute('registrate') === 'true') {
                        this.divPersonalInfo.append(this.pWrongPassword)
                    } else {
                        this.divPersonalInfo.removeChild(this.pWrongPassword)
                    }
                    if(newv && this.getAttribute('passwordcheck')){
                        if(newv === this.getAttribute('passwordcheck')){
                            this.divPersonalInfo.removeChild(this.pWrongCheckPassword)
                        }else {
                            this.divPersonalInfo.append(this.pWrongCheckPassword)
                        }
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
            case 'passwordcheck':
                if(newv !== this.getAttribute('password')){
                    console.log("no coinciden");
                    this.divPersonalInfo.append(this.pWrongCheckPassword)
                } else {
                    this.divPersonalInfo.removeChild(this.pWrongCheckPassword)
                }
                console.log(this.getAttribute('password'));
                break;
            case 'showpassword':
                if(newv === 'false'){
                    this.inputPassword.type = 'password';
                    this.inputPasswordCheck.type = 'password';
                    this.visiblePasswordButton.innerText = 'mostrar password'; 
                }else{
                    this.inputPassword.type = 'text';
                    this.inputPasswordCheck.type = 'text';
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
            case 'registrationsuccess':
                if(newv === 'true'){
                    this.shadow.removeChild(this.divFormAndReset)
                    this.shadow.removeChild(this.divSwitchLoginRegistrate)
                    this.shadow.append(this.divSuccessRegistration)
                } else {
                    this.shadow.removeChild(this.divSuccessRegistration)
                    this.shadow.append(this.divFormAndReset)
                    this.shadow.append(this.divSwitchLoginRegistrate)
                    this.setAttribute('registrate', false)
                    this.setAttribute('name', '')
                    this.setAttribute('email', '')
                    this.setAttribute('password', '')
                    this.setAttribute('passwordcheck', '')
                }
        }
    }
    connectedCallback(){
        this.title2 = document.createElement('h2')
        this.title2.innerText = "Inicia sesión"
        
        /*************** DIV INPUTS INFO *******************/
        this.divPersonalInfo = document.createElement('div')
        this.divPersonalInfo.className = 'divPersonalInfo'
        this.labelName = document.createElement('label')
        this.labelEmail = document.createElement('label')
        this.labelPassword = document.createElement('label')
        this.labelPasswordCheck = document.createElement('label')
        this.labelName.innerText = 'Nombre:';
        this.labelEmail.innerText = 'Email:';
        this.labelPassword.innerText = 'Password:';
        this.labelPasswordCheck.innerText = 'Introduce de nuevo tu Password:';
        this.inputName = document.createElement('input')
        this.inputPassword = document.createElement('input')
        this.inputPasswordCheck = document.createElement('input')
        this.inputPassword.type = 'password'
        this.inputPasswordCheck.type = 'password'
        this.pWrongEmail = document.createElement('p')
        this.pWrongEmail.className = 'alert'
        this.pWrongEmail.innerText = '*Dirección de email con formato erróneo'
        this.pWrongPassword = document.createElement('p')
        this.pWrongPassword.className = 'alert'
        this.pWrongPassword.innerText = '*Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'
        this.pWrongCheckPassword = document.createElement('p')
        this.pWrongCheckPassword.className = 'alert'
        this.pWrongCheckPassword.innerText = 'Passwords no coinciden'
        this.inputEmail = document.createElement('input')
        this.visiblePasswordButton = document.createElement('button');
        this.visiblePasswordButton.innerText = 'mostrar password'
        this.inputName.addEventListener('change', (event) => {
            this.setAttribute('name', event.target.value)
        });
        this.inputPassword.addEventListener('change', (event ) => {
            this.setAttribute('password', event.target.value)
        });
        this.inputPasswordCheck.addEventListener('change', (event ) => {
            this.setAttribute('passwordcheck', event.target.value)
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

        /**************** DIV SUCCESS REGISTRATION ********/
        this.divSuccessRegistration = document.createElement('div');
        this.h1SuccessRegistration = document.createElement('h1');
        this.pSuccessRegistration = document.createElement('p');
        this.buttonSuccessRegistration = document.createElement('button');
        this.h1SuccessRegistration.innerText = 'Usuario registrado correctamente';
        this.pSuccessRegistration.innerText = 'Se ha enviado un correo electrónico para activar tu cuenta. Por favor, revisa tu correo y activa tu cuenta mediante el enlace que te hemos enviado.'
        this.buttonSuccessRegistration.innerText = 'Entendido'
        this.buttonSuccessRegistration.addEventListener('click',()=> {
            this.setAttribute('registrationsuccess', false);
        })
        this.divSuccessRegistration.append(this.h1SuccessRegistration)
        this.divSuccessRegistration.append(this.pSuccessRegistration)
        this.divSuccessRegistration.append(this.buttonSuccessRegistration)

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
            const x = login();
            x.then(e=>console.log(e));
            this.shadow.removeChild(this.divFormAndReset);
            this.shadow.removeChild(this.divSwitchLoginRegistrate);
        })
        this.registerButton = document.createElement('button');
        this.registerButton.innerText = 'registrar usuario'
        this.registerButton.addEventListener('click', async()=> {
            try{
                
                const x = await registrate()
                console.log(x.status);
                if(x.status === 200){
                    this.setAttribute('registrationsuccess', true)
                }
            } catch(e){
                console.log(e.Error);
            }
        })
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