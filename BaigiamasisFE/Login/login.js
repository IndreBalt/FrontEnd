const body = document.querySelector('body');
const loginBtn = document.querySelector("#login_btn");

//sukuria user objekta
const createUser = () =>{
    do{
        const userNameInputValue = document.querySelector('input[name = "login_username"]').value;
        const passwordInputValue = document.querySelector('input[name = "login_password"]').value;
        console.log(userNameInputValue + ',' + passwordInputValue);
        if(userNameInputValue == '' || passwordInputValue == ''){
            infoDiv('Ne visi laukai uzpildyti', 'red');
        }else{
            const user = {
                "userName" : `${userNameInputValue}`,
                "password" : `${passwordInputValue}`
            }
            return user;
        }
    }while(!user);
   
    
}

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
    body.insertBefore(infoDiv, loginBtn);       
}

//gaunamas vartotojas
const getUser = (user)=>{
    fetch(`https://localhost:7171/api/Auth?username=${user.userName}&password=${user.password}`)
        .then(response => response.json())
        .then(json => {json.error?  infoDiv(json.error, "red"):(confirmUser(json), console.log(json))})
        .catch(error => console.log(error));
}

//prideda i localhost ir nukreipia i todo puslapi
const confirmUser = (user) =>{ 
    if(user.id == null){
        infoDiv("Neteisingai uzpildyti laukai", "red");
    }else{
        let arr = [user.id, user.userName]
        console.log(arr);
        localStorage.setItem("user", arr);
        location.href = "../ToDoPage/toDo.html"; 
    }
}


login_btn.onclick = () => getUser(createUser());
return_to_index.onclick = () => {location.href = "../index.html"};
