const header = document.querySelector('header');
const toDoSection = document.querySelector(".to_do_section");
const addBtn = document.querySelector("#add_task_btn");
const tbodyTag = document.querySelector('tbody');
const trTag = tbodyTag.getElementsByTagName('tr');
const logedUser = localStorage.getItem("user");

//gaunama visi taskai ir isfiltuojama pagal vartotoja
const getusersTasks = (user) =>{  
    fetch(`https://localhost:7171/api/ToDo`)
    .then(response => response.json())
    .then(json => {json.error? infoDiv(json.error, "red"):  displayUsersTasks(user, json)})
    .catch(error => console.log(error, "red"));
}

//atvaizduoja visus vartotojo taskus
const displayUsersTasks = (user, tasks) =>{ 
    const userId = user.split(',')[0];
    const usersTasks = tasks.filter(task => task.userId == userId);
    for(let task of usersTasks){        
        displayTask(task);        
    }
    if(trTag.length == 0){
        infoDiv("Sarasas tuscias", "green");
    }
}

//atvaizduojama task eilute sarase
const displayTask = (task) => { 
    const trTask = document.createElement('tr');
    trTask.setAttribute('id', task.id);
    tbodyTag.appendChild(trTask);
    
    const tdType = document.createElement('td');
    tdType.innerHTML = task.type;
    trTask.appendChild(tdType);

    const tdTContent = document.createElement('td');
    tdTContent.innerHTML = task.content;
    trTask.appendChild(tdTContent);

    const tdEndDate = document.createElement('td');
    tdEndDate.innerHTML = task.endDate;
    trTask.appendChild(tdEndDate);

    const tdAction = document.createElement('td');
    const btnUpdate = document.createElement('button');
    btnUpdate.setAttribute('id', 'update_task_btn');
    btnUpdate.innerHTML = "Redaguoti";
    const btnDelete = document.createElement('button');
    btnDelete.setAttribute('id', 'delete_task_btn');
    btnDelete.innerHTML = "Istrinti";
    tdAction.appendChild(btnUpdate);
    tdAction.appendChild(btnDelete);
    trTask.appendChild(tdAction);

    btnUpdate.onclick = () => {createTaskInputs('update',task), console.log(task)};
    btnDelete.onclick = () => deleteTask(task);
}

//atvaizduojamas vartotojas
const displayUser = (user) =>{ 
    const userName = user.split(',')[1];
    const userTagH3 = document.createElement('h3');
    const h3 = header.querySelector('h3');
    userTagH3.innerHTML = `Prisijunges vartotojas: ${userName}`;
    header.insertBefore(userTagH3, h3);
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
    toDoSection.insertBefore(infoDiv, addBtn);
    
}

//istrinamas vartotojas is localstorage ir grazinamas i index
const logOut = () =>{ 
    localStorage.removeItem("user");
    location.href = "../index.html"
}
//atvaizduojama inputai tasko kurimui bei action mygtukai
const createTaskInputs = (action, task) => { 
    
    const trTag = document.createElement('tr');
    if (action == 'create'){
        tbodyTag.appendChild(trTag);
    }else if(action == 'update'){
        const trById = document.querySelector('tr[id = "'+task.id+'"]');
        console.log(trById);
        trById.style.display = 'none';
        trById.insertAdjacentElement("afterend", trTag);
    }

    const tdType = document.createElement('td');
    const inputType = document.createElement('input');
    inputType.setAttribute('type', 'text');
    inputType.setAttribute('name', 'task_type');    
    tdType.appendChild(inputType);
    trTag.appendChild(tdType);

    const tdContent = document.createElement('td');
    const inputContent = document.createElement('textarea');
    inputContent.setAttribute('name', 'task_content');
    tdContent.appendChild(inputContent);
    trTag.appendChild(tdContent);

    const tdEndDate = document.createElement('td');
    const inputEndDate = document.createElement('input');
    inputEndDate.setAttribute('type', 'datetime-local');
    inputEndDate.setAttribute('name', 'task_EndDate');    
    tdEndDate.appendChild(inputEndDate);
    trTag.appendChild(tdEndDate);

    const tdActions = document.createElement('td');
    const btnConfirm = document.createElement('button');
    btnConfirm.setAttribute('id', 'btn_confirm_task');
    btnConfirm.innerHTML = "Ivesti";
    tdActions.appendChild(btnConfirm);

    const btnCancel = document.createElement('button');
    btnCancel.setAttribute('id', 'btn_cancel_task');
    btnCancel.innerHTML = "Atsaukti";    
    tdActions.appendChild(btnCancel);    
    trTag.appendChild(tdActions);
    if (action == 'create'){        
        btn_confirm_task.onclick =()=> addTaskToList(createTask(logedUser));

    }else if(action == 'update'){
        inputType.value = task.type;
        inputContent.value = task.content;
        inputEndDate.value = task.endDate;
        btn_confirm_task.innerHTML = "Irasyti pakeitmus";
        btn_confirm_task.onclick =()=> updateTaskinList(createTask(logedUser, task.id));
    }else{
        console.log("kazkas negerai")
    }
    
    btn_cancel_task.onclick = () => window.location.reload();
}

//sukuriama task objektas
const createTask = (user, id = 0) =>{   
    do{
        const userId = user.split(',')[0]; 
        const inputTypeValue = document.querySelector('input[name = "task_type"]').value;
        const inputContentValue = document.querySelector('textarea[name = "task_content"]').value;
        const inputEndDateValue = document.querySelector('input[name = "task_EndDate"]').value;
        
        if(inputTypeValue == "" || inputContentValue == "" || inputEndDateValue == ""){
            infoDiv("Ne visi laukai uzpildyti", "red");
        }else{
            const task = {
                "userId": userId,
                "type": inputTypeValue,
                "content": inputContentValue,
                "endDate": inputEndDateValue 
            }
            if(id != 0){ // id paduodamas kuriant nauja taska esamam taskui redaguoti
                task.id = id;
            }   
            return task;
        }
    }while(!task);
   
    console.log(task);
}

//atnaujina taska db
const updateTaskinList = (task) => {
    fetch('https://localhost:7171/api/ToDo/'+task.id,{
        method:'PUT', 
        body: JSON.stringify(task),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(json => {json.error?  infoDiv(json.error, "red"): console.log(json)})
    .catch(error => console.log(error)); 

    if(task.type != "" & task.content != "" & task.endDate != ""){
        window.location.reload();        
    }
    console.log(task);
}

//pridedama taskai prie saraso i db
const addTaskToList = (task) => { 
    fetch('https://localhost:7171/api/ToDo',{
        method:'POST', 
        body: JSON.stringify(task),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.json())
    .then(json => {json.error?  infoDiv(json.error, "red"): console.log(json)})
    .catch(error => console.log(error)); 
  
    if(task.type != "" & task.content != "" & task.endDate != ""){
       window.location.reload();        
    }   
}
const deleteTask = (task) => {
    fetch('https://localhost:7171/api/ToDo/'+task.id,{
        method:'DELETE', 
        body: JSON.stringify(task),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    .then(response => response.ok? (infoDiv("istrinta sekmingai", 'green'),  window.location.reload() ): infoDiv("nepavyko", 'red'))
 
}

    
add_task_btn.onclick = () => {createTaskInputs('create'), addBtn.style.display = "none"};

getusersTasks(logedUser);
displayUser(logedUser);
log_out_btn.onclick =()=> logOut();

