import {login, registrate,userLogged,logout} from './helpers.js'
export default class RegisterDiv extends HTMLElement {
    constructor(){
        super()
        this.shadow = this.attachShadow({mode: 'open'})

    }
    static get observedAttributes(){
        return ['name', 'email', 'password', 'showpassword','registrate','logged']
    }

    attributeChangedCallback(att,oldv,newv){
        console.log(att, "oldvalue: "+ oldv, "newvalue: " +newv);
        switch(att){
            case 'showpassword':
                if(newv === 'false'){
                    this.inputPassword.type = 'password';
                    this.visiblePasswordButton.innerText = 'mostrar password'; 
                }else{
                    this.inputPassword.type = 'text';
                    this.visiblePasswordButton.innerText = 'ocultar password';
                }
                break;
            case 'registrate':
                if(newv ==='true'){
                    this.pRegister.innerText = '¿Ya estás registrado? Haz click aquí para iniciar sesión:'
                    this.divRegister.append(this.labelName)
                    this.divRegister.append(this.inputName)
                    this.divRegister.append(this.registerButton)
                    this.divRegister.removeChild(this.loginButton)
                    this.switchRegisterLoginButton.innerText = 'Iniciar sesión'              
                }
                else{
                    this.switchRegisterLoginButton.innerText = 'Registrarme'              
                    this.pRegister.innerText = '¿Todavía no estás registrado? Hazlo aquí:'
                    this.divRegister.removeChild(this.labelName)
                    this.divRegister.removeChild(this.inputName)
                    this.divRegister.removeChild(this.registerButton)
                    this.divRegister.append(this.loginButton)
                    this.shadow.appendChild(this.divRegister)
                    this.shadow.append(this.divSwitch)
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
                    this.shadow.append(this.divRegister)
                    this.shadow.append(this.divSwitch)
                }
                break;
        }
    }
    connectedCallback(){
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
        this.divRegister = document.createElement('div')
        this.divRegistered = document.createElement('div')
        this.buttonLogout = document.createElement('button');
        this.buttonLogout.innerText='Logout'
        this.buttonLogout.addEventListener('click', ()=> {
            this.setAttribute('logged', false)
        })
        this.divRegistered.append(this.pWelcome)
        this.divRegistered.append(this.buttonLogout)
        
        this.shadow.append(this.divRegistered)
        this.labelName = document.createElement('label')
        this.labelEmail = document.createElement('label')
        this.labelPassword = document.createElement('label')
        this.title2 = document.createElement('h2')
        this.labelName.innerText = 'Nombre:';
        this.labelEmail.innerText = 'Email:';
        this.labelPassword.innerText = 'Password:';
        this.inputName = document.createElement('input')
        this.inputPassword = document.createElement('input')
        this.inputPassword.type = 'password'
        this.inputEmail = document.createElement('input')
        this.visiblePasswordButton = document.createElement('button');
        this.loginButton = document.createElement('button');
        this.loginButton.innerText = 'Login'
        this.loginButton.addEventListener('click',()=>{
            this.shadow.removeChild(this.divRegister);
            this.shadow.removeChild(this.divSwitch);
            login();
        })
        this.pRegister = document.createElement('p');
        this.pRegister.innerText = '¿Todavía no estás registrado? Hazlo aquí:'
        this.switchRegisterLoginButton = document.createElement('button');
        this.switchRegisterLoginButton.innerText = 'Registrarme'              
        this.registerButton = document.createElement('button');
        this.registerButton.innerText = 'registrar usuario'
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
        this.divRegister.append(this.title2)
        this.divRegister.append(this.labelEmail)
        this.divRegister.append(this.inputEmail)
        this.divRegister.append(this.labelPassword)
        this.divRegister.append(this.inputPassword)
        this.divRegister.append(this.visiblePasswordButton)
        this.divRegister.append(this.loginButton)
        this.divSwitch = document.createElement('div')
        this.divSwitch.append(this.pRegister)
        this.divSwitch.append(this.switchRegisterLoginButton)
        const showPassword = () => {
            this.setAttribute('showpassword', !(this.getAttribute('showpassword') === 'true'))
        }
        const switchRegistrateLogin = () => {
            this.setAttribute('registrate', !(this.getAttribute('registrate') === 'true'))
        }

        this.switchRegisterLoginButton.addEventListener('click', switchRegistrateLogin)
        this.visiblePasswordButton.addEventListener('click', showPassword)
        this.registerButton.addEventListener('click', registrate)

    }
}