const body = document.querySelector('body');
const registrationBtn = document.getElementById("registration_btn");

//sukuria vartotojo objekta
const createUser = () =>{  
    do{
        const userNameValue = document.querySelector('input[name = "registration_username"]').value;
        const passwordValue = document.querySelector('input[name = "registration_password"]').value;
        const emailValue = document.querySelector('input[name = "registration_email"]').value;
        
        //userio inputu validacijos
        if(userNameValue == "" || passwordValue == ""|| emailValue == ""){
            infoDiv("Ne visi laukai uzpildyti", "red");
        }else if(validateEmail(emailValue)==null){
            infoDiv("Neteisingas e-pastas", "red");
        }else{
            const user = {        
                "userName": `${userNameValue}`,
                "password": `${passwordValue}`, 
                "email": `${emailValue}`  
            }             
            return user;  
        } 
        console.log(user);
    }while(!user); 
    

};

//email validatorius
const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

//error ir informaciniu pranesimu divas
const infoDiv = (message, color) =>{   
    const infoDivOld = document.querySelector(".info_div"); 

    if(infoDivOld != null){
        infoDivOld.remove();
     }
 
    const infoDiv = document.createElement('div')
    infoDiv.classList.add('info_div');
    infoDiv.innerHTML = message;
    infoDiv.style.border = `1px solid ${color}`;
    infoDiv.style.color = color;    
    body.insertBefore(infoDiv, registrationBtn);
}

//registracijos patvirtinimas, sukuria infoDiv su mygtuku i login puslapi
const registrationConfirm = () =>{
    infoDiv("Registracija sekminga, galite prisijungti  ", "green");
    registrationBtn.disabled = true;
    const loginBtn = document.createElement('button');
    loginBtn.setAttribute('id', 'login_btn');
    loginBtn.classList.add('big_btn');
    loginBtn.innerHTML = "Prisijungti";
    const infoDivnew = document.querySelector(".info_div");
    infoDivnew.appendChild(loginBtn);
    login_btn.onclick = () => location.href = "../Login/login.html";
    
}

//prideda useri i db
const addUser = (user) =>{
    fetch('https://localhost:7171/api/Auth',{
        method:'POST', 
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => {
       if(response.status == '200') {        
            registrationConfirm();
            return {error :false};
       }else{
             const json = response.json();
            if(json.error){
                infoDiv(json.error, "red");
            }else{
                console.log(json);
            }
            return json;
       }
    })
    .then(json => {
        if(json.error){
            infoDiv(json.error, "red")
        }  
    })
    .catch(error => console.log(error, 'red')); 
}

registration_btn.onclick = () => addUser(createUser());
return_to_index.onclick = () => {location.href = "../index.html"};
