const registrate = async(name, email, password) =>{
    try{
        const newuser = JSON.stringify({
            name: document.querySelector('div-register').getAttribute('name'),
            email: document.querySelector('div-register').getAttribute('email'),
            password: document.querySelector('div-register').getAttribute('password')
        })
        const request = {
            method: 'POST',
            headers: {
                'accept': "text/plain",
                'Content-type': 'text/json',
            },
            body: newuser
        }
        await fetch('http://www.tasklisthnlopez.somee.com/api/Auth/register', request)
    } catch(e){
        console.log(e);
    }
}

const login = async() =>{
    try{
        
        const loginUser = JSON.stringify({
            email: document.querySelector('div-register').getAttribute('email'),
            password: document.querySelector('div-register').getAttribute('password')
        })
        const request = {
            method: 'POST',
            headers: {
                'accept': "text/plain",
                'Content-type': 'text/json',
            },
            body: loginUser
        }
        await fetch('http://www.tasklisthnlopez.somee.com/api/Auth/login', request)
        .then(response=>response.text())
        .then((data)=> {
            console.log(data)
            localStorage.setItem('token', data)
            document.querySelector('div-register').setAttribute('logged', 'true')
        })
    } catch(e){
        console.log(e);
    }
}

const userLogged = async() => {
    let userToReturn;
    if (localStorage.getItem('token')) {
        const token = (localStorage.getItem('token'));
        const request = {
            method: 'GET',
            headers: {
                'accept': "text/plain",
                'Content-type': 'text/json',
                'Authorization': `Bearer ${token}`
            }
        }
        await fetch('http://www.tasklisthnlopez.somee.com/api/Auth/MyUser',request)
        .then(response=>response.json())
        .then(data => {
            userToReturn = data
        })
        return userToReturn
    } else{
        return false
    }
}

const logout = () => {
    localStorage.clear();
}

const recoverPassword = async() => {
    const userToRecover = JSON.stringify({
            email: document.querySelector('div-register').getAttribute('emailtorecover'),
            password: '+'
    })
    const request = {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'Content-type': 'text/json',
        },
        body: userToRecover
        
    }
    try{
        console.log(request);
        await fetch('http://www.tasklisthnlopez.somee.com/api/Auth/ForgetPassword', request)
        .then(x=>console.log(x))
    }catch(e){
        console.log(e);
    } 
}

export {login,registrate,userLogged,logout,recoverPassword}