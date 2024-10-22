const getAllHeroes = () => {fetch ('https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json')
    .then(responce => responce.json())
    .then(json => {heoresTitles(json),members(json)})
    .catch(error => console.error(error));
}

const bodyTag = document.querySelector('body');

const heoresTitles = (json) => {    
    const header = document.createElement('header');
    const titleH1 = document.createElement("h1");
    const titleH3 = document.createElement("h3");
    bodyTag.appendChild(header);
    header.appendChild(titleH1);
    titleH1.innerText = json.squadName;
    header.appendChild(titleH3);
    titleH3.innerHTML = ` Hometown: ${json.homeTown} // Formed: ${json.formed}`
}

const members = (json) => {
    let members = json.members;
    const section = document.createElement('section');
    section.classList.add('members_section')
    bodyTag.appendChild(section);
    members.forEach(member => {
        const oneMemberDiv = document.createElement('div');   
        oneMemberDiv.classList.add('member_div') 
               
        const titleH2 = document.createElement('h2');
        const identityTag = document.createElement('p');
        const ageTag = document.createElement('p');
        const powersTitleTag = document.createElement('p');
        const poversListTag = document.createElement('ul');


        titleH2.textContent = member.name;
        identityTag.innerHTML = `Secret identity: ${member.secretIdentity}`;
        ageTag.innerHTML = `Age: ${member.age}`;
        powersTitleTag.innerHTML = 'Superpowers: ';
        const powersList = member.powers;
        console.log(powersList);
        for(let i = 0; i < powersList.length; i++){
            const liTag = document.createElement('li');
            liTag.innerHTML = powersList[i];
            poversListTag.appendChild(liTag);
        }
         
        oneMemberDiv.appendChild(titleH2);        
        oneMemberDiv.appendChild(identityTag);
        oneMemberDiv.appendChild(ageTag);
        oneMemberDiv.appendChild(powersTitleTag);
        oneMemberDiv.appendChild(poversListTag);
        section.appendChild(oneMemberDiv);   
        
    });
    
}
getAllHeroes();