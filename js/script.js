const tipos = {
    PRODUCTOS : "productos",
    ENTIDADES : "entidades",
    PERSONAS : "personas",
}

function Elemento(){
    this.id = generateID();
    this.tipo = sessionStorage.getItem('tipo');
    this.nombre = document.getElementById('nombre').value;
    this.fechaInicio = document.getElementById('fecha-inicio').value;
    this.fechaFin = document.getElementById('fecha-fin').value;
    this.imagen = document.getElementById('url-img').value;
    this.wiki = document.getElementById('url-wiki').value;
    this.personas = getCollaborators(tipos.PERSONAS);
    this.entidades = getCollaborators(tipos.ENTIDADES);
}

function generateID(){
    let newId = 4;
    let lastIdGiven = getStorageLastId(); 
    if (lastIdGiven != null){
        newId = lastIdGiven + 1;
    }
    updateStorageLastIdGiven(newId);
    return newId;
}

function getCollaborators(tipo){ 
    const checkboxes = document.querySelectorAll(`input[name=${tipo}]:checked`);
    let elements  = [];
    checkboxes.forEach((checkbox) => {
            elements.push(parseInt(checkbox.value));
    });
    return elements;
}

function main(){
    checkIfLoggedMain();
    setDefaultValues();
    showValues();
}

function mainCreateOrEditWindow(){
    checkIfLoggedWindow();
    if(isEditMode()){ 
        showEditWindow();
        updateEditModeStatus(false);
    }else{ 
        showCreateWindow();
    }
}

function mainReadIndex(){
    checkIfLoggedWindow();
    
    if(getLoginStatus()){
        addEditButton();
    }

    showReadIndexWindow();
    
}

function checkIfLoggedMain(){
    if(getLoginStatus() == true){
        setTimeout(() => {
            showWriterScreen();
        },0)
    }
}

function setDefaultValues(){
if(isFirstLoad()){
    setDefaultUsers();
    setDefaultElements();
}
}

function isFirstLoad(){
if(sessionStorage.getItem('defaultValuesSaved') == null){
    sessionStorage.setItem('defaultValuesSaved','true');
    return true;
}
return false;
}

function setDefaultUsers(){
    let usersAndPassword = {'x':'x','y':'y','z':'z'};
    for(user in usersAndPassword){
        window.localStorage.setItem(user,usersAndPassword[user]);
    }
}

function setDefaultElements(){
    updateStorageArrays(persona1);
    updateStorageArrays(entidad1);
    updateStorageArrays(producto1);
}

function storeArray(array,tipo){
sessionStorage.setItem(tipo,JSON.stringify(array));
}

function showValues(){
    showSection(tipos.PRODUCTOS);
    showSection(tipos.PERSONAS);
    showSection(tipos.ENTIDADES);    
}

function showSection(tipo){
    const array = getStorageArray(tipo);
    const container = document.getElementById(tipo);
    for(element of array){
        let html = getElementHtml(element);
        let resumenElemento = document.createElement("div");
        resumenElemento.setAttribute("class","px-1 col");
        resumenElemento.innerHTML = html;
        container.appendChild(resumenElemento);
    }
}


function checkIfLoggedWindow(){
    if(getLoginStatus() == true){
        setTimeout(() => {
            replaceLoginWithLogout();
        }, 0);
    }
}

function isEditMode(){
    return JSON.parse(sessionStorage.getItem('editMode'));
}

function showEditWindow(){
    const elem = findElement(getStorageTipo(),getStorageIdElementoAPresentar());
    updateForm('edit');
    showEditOrCreateHeader('editar',elem.nombre);
    changeAllInputValues(elem);
    showEditCheckbox(elem);
    showEditSaveButton();
}

function findElement(tipo,id){
    const array = getStorageArray(tipo);
    for (elem of array){
        if(elem.id == id){
            return elem;
        }
    }
    return null;
}

function showEditOrCreateHeader(modo,msg){
    const h2 = document.getElementsByTagName("h2");
    h2[0].innerHTML = `${capitalizeFirstLetter(modo)} ${msg}`;
}

function changeAllInputValues(elem){
    changeInputValues('nombre',elem.nombre);
    changeInputValues('fecha-inicio',elem.fechaInicio);
    changeInputValues('fecha-fin',elem.fechaFin);
    changeInputValues('url-img',elem.imagen);
    changeInputValues('url-wiki',elem.wiki);
}

function changeInputValues(inputId,value){
    const input = document.getElementById(inputId);
    input.setAttribute("value",value);
}

function showEditCheckbox(elem){
    showCreateCheckbox();
    markCheckbox(elem);
}


function markCheckbox(elem){
    const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
    checkboxes.forEach((checkbox) => {
            let value = parseInt(checkbox.getAttribute('value'));
            if(elem.entidades.indexOf(value) > -1 || elem.personas.indexOf(value) > -1){
                checkbox.setAttribute("checked",true);
            }
    });
}


function showEditSaveButton(){
    let button = document.createElement("button");
    const container = document.getElementById("pie-pagina");
    button.setAttribute("class","btn-edit-save");
    button.setAttribute("type","submit");
    button.innerHTML = `<img src="./img/save.svg" alt="Simbolo Guardar">
                        <span>Guardar Cambios</span>`;
    container.appendChild(button);
}


function editElement(e){
    e.preventDefault();

    const elem = findElement(getStorageTipo(),getStorageIdElementoAPresentar());
    const array = getStorageArray(elem.tipo);
    
    updateElementAtrributes(elem);
    changeArray(elem);
    updateArray(array,elem);
    goToHomeWindow();
}

function changeArray(elem){
    elem.nombre = document.getElementById('nombre').value;
    elem.fechaInicio = document.getElementById('fecha-inicio').value;
    elem.fechaFin = document.getElementById('fecha-fin').value;
    elem.imagen = document.getElementById('url-img').value;
    elem.wiki = document.getElementById('url-wiki').value;
    elem.personas = getCollaborators(tipos.PERSONAS)
    elem.entidades = getCollaborators(tipos.ENTIDADES);
}

function showCreateWindow(){
    updateForm('add');
    showCreateHeader();
    showCreateCheckbox();
    showCreateButton();
}

function showCreateHeader(){
    showEditOrCreateHeader('añadir',getStorageTipo());
}

function showCreateCheckbox(){
    const tipo = getStorageTipo();
    if(tipo == tipos.PRODUCTOS || tipo == tipos.ENTIDADES){
        showPersonasOrEntidadesCheckbox(tipos.PERSONAS);
        if(tipo == tipos.PRODUCTOS){
            showPersonasOrEntidadesCheckbox(tipos.ENTIDADES);
        }
    }
}

function showPersonasOrEntidadesCheckbox(tipo){
    const element = document.getElementById(tipo + '-checkbox');
    const array = getStorageArray(tipo);
    const html = getCheckboxHtml(array,tipo);
    
    element.innerHTML = html;
}

function addElement(e){
    e.preventDefault();

    const element = new Elemento();

    updateStorageArrays(element);
    goToHomeWindow();
}


function showCreateButton(){
    const button = getAddButtonHtml("Crear");
    const container = document.getElementById("pie-pagina");
    button.removeAttribute("onclick");
    button.setAttribute("type","submit");
    container.appendChild(button);
}


function addEditButton(){
    const contenedor = document.getElementById('cabecera-index');
    const button = document.createElement("button");
    button.setAttribute("class","col-12 col-lg-5 btn-editar");
    button.setAttribute("onclick","goToEditWindow()");
    button.innerHTML=`<img src="./img/save.svg" alt="Simbolo editar">
                      <span>Editar</span>`;
    contenedor.appendChild(button);
}

function showReadIndexWindow(){
    const element = findElement(getStorageTipo(),getStorageIdElementoAPresentar());
    if (element != null){
        showCard(elem);
    }
}

function showCard(elem){
    showCardName(elem.nombre);
    showCardImg(elem.imagen);
    showCardDates(elem.fechaInicio,elem.fechaFin);
    showCardWiki(elem.wiki);
    showCardCollaborators(elem.personas,tipos.PERSONAS);
    showCardCollaborators(elem.entidades,tipos.ENTIDADES);
}

function showCardName(nombre){
    if(nombre){
        const h2 = document.getElementById('nombre-presentacion');
        h2.innerHTML = nombre; 
    }
}

function showCardImg(url){
    if(url){
        const img = document.getElementById('img-presentacion');
        img.setAttribute("src",url);
    }
}

function showCardDates(inicio,fin){
    if(inicio){
        let html = `<span>Fecha de Nacimiento: </span><time>${inicio}</time></span>`;
        showCardAppendDates(html);
    }
    if(fin){
        let html =`<span>Fecha de Fallecimiento: </span><time>${fin}</time></span>`;
        showCardAppendDates(html);
    }
}

function showCardAppendDates(html){
    const p = document.createElement("p");
    const contenedor = document.getElementById('info-presentacion');
    p.innerHTML = html;
    contenedor.appendChild(p);
}

function showCardWiki(url){
    if(url){
        const contenedor = document.getElementById('info-presentacion');
        const pWiki = document.createElement("p");
        pWiki.innerHTML = `Wiki: <a href="${url}" target="_blank">${url}</a>`;
        contenedor.appendChild(pWiki);
    }
}

function showCardCollaborators(array,tipo){
    if(array.length != 0 && array){
        showCardCollaboratorsParagraph(tipo);
        showCardCollaboratorsList(array,tipo);
    }
}

function showCardCollaboratorsParagraph(tipo){
    const contenedor = document.getElementById('info-presentacion');
    const p = document.createElement("p");
    p.innerHTML = `${capitalizeFirstLetter(tipo)} que han participado en el desarrollo: `;
    contenedor.appendChild(p);
}

function showCardCollaboratorsList(array,tipo){
    const contenedor = document.getElementById('info-presentacion');
    const ul = document.createElement("ul");
    for (elementId of array){
        let element = findElement(tipo,elementId);
        ul.innerHTML += `<li><a href="./readIndex.html" data-tipo="${element.tipo}" data-id="${element.id}" onclick="goToReadIndexWindow(this)">
                            ${element.nombre}
                        </a></li>`;
    }
    contenedor.appendChild(ul);
}


function login() {
    if (isUserAndPasswdCorrect()){
        updateLoginStatus(true);
        location.reload();
    }
}

function isUserAndPasswdCorrect(){
    const username = document.getElementById('username').value ;
    const password = document.getElementById('password').value ; 

    return localStorage.getItem(username) == password;
}

function showWriterScreen(){
    replaceLoginWithLogout();
    showDeleteButtons();
    showCreateButtons();
}


function replaceLoginWithLogout(){
    const authentication = document.getElementById("authentication");
    const html = getLogoutButtonHtml();
    authentication.innerHTML = html;
}


function showDeleteButtons(){
    let resumenElementos = document.getElementsByClassName('resumen-descripcion');
    for(resumenElemento of resumenElementos){
        let button = getDeleteButtonHtml();
        resumenElemento.appendChild(button);
    }
    
}


function showCreateButtons(){
    changeHeaders(tipos.PRODUCTOS);
    changeHeaders(tipos.PERSONAS);
    changeHeaders(tipos.ENTIDADES);
}


function changeHeaders(tipoCabecera){
    const cabecera = document.getElementById("cabecera-" + tipoCabecera);
    const button = getAddButtonHtml(tipoCabecera);
    cabecera.appendChild(button);
}

function logout(){
    replaceLogoutWithLogin();
    removeButtons('btn-eliminar');
    removeButtons('btn-aniadir');
    updateLoginStatus(false);
    goToHomeWindow();
}

function replaceLogoutWithLogin(){
    const authentication = document.getElementById("authentication");
    const html = getLoginHtml();
    authentication.innerHTML = html;
    
}

function removeButtons(className){
    const buttons = document.getElementsByClassName(className);
    console.log(buttons);
    while(buttons.length > 0){
        buttons[0].parentNode.removeChild(buttons[0]);
    }
}


function remove(elem){
    const contenedor = elem.parentNode.parentNode.parentNode;
    let info = elem.parentNode;
    const tipo = info.getAttribute("data-tipo");
    const id = parseInt(info.getAttribute("data-id"));
    deleteReferences(id);
    deleteSelfFromArray(id,tipo); 
    deleteVisually(contenedor); 
}

function deleteReferences(id){
    const arrayEntidades = getStorageArray(tipos.ENTIDADES);
    const arrayProductos = getStorageArray(tipos.PRODUCTOS);
    for(obj of arrayEntidades){
        deleteInObject(id,obj);
    }
    for(obj of arrayProductos){
        deleteInObject(id,obj);
    }
    storeArray(arrayEntidades,tipos.ENTIDADES);
    storeArray(arrayProductos,tipos.PRODUCTOS);
}


function deleteInObject(id,obj){
    let index = obj.entidades.indexOf(id);
    if (index > -1){
        obj.entidades.splice(index,1);
    }else{
        index = obj.personas.indexOf(id);
        if (index > -1){
            obj.personas.splice(index,1);
        }
    }
    
}

function deleteSelfFromArray(id,tipo){
    const array = getStorageArray(tipo);
    let stop = false;
    let index = 0;
    while(!stop && index < array.length){
        let obj = array[index];
        if(obj.id == id){
            stop = true;
            array.splice(index,1);
        }
        index = index + 1;
    }
    storeArray(array,tipo);
}


function deleteVisually(contenedor){
    contenedor.remove();
}


function getStorageLastId(){
    return JSON.parse(sessionStorage.getItem('lastIdGiven'));
}

function getStorageArray(tipo){
    let array = JSON.parse(sessionStorage.getItem(tipo));
    if(array == null){
        array = [];
    }
    return array;
}

function getStorageTipo(){
    return sessionStorage.getItem('tipo');
}


function getLoginStatus(){
    return JSON.parse(sessionStorage.getItem('logged'));
}

function getStorageIdElementoAPresentar(){
    return parseInt(sessionStorage.getItem('idElementoAPresentar'));
}


function getElementIndex(array,index){
    return array.findIndex(x => x.id == elem.id);
}

function getElementHtml(element){
    return `<div class="resumen-elemento">
                <img src="${element.imagen}"  alt="Imagen de ${element.nombre}" >
                <div class="resumen-descripcion" data-tipo="${element.tipo}" data-id="${element.id}">
                    <a href="./readIndex.html" data-tipo="${element.tipo}" data-id="${element.id}" onclick="goToReadIndexWindow(this)">${element.nombre}</a>
                </div>
            </div>`
            
}

function getAddButtonHtml(tipo){
    let button = document.createElement("button");
    button.setAttribute("class","btn-aniadir");
    button.setAttribute("data-tipo",tipo);
    button.setAttribute("onclick","goToCreateWindow(this)");
    button.innerHTML = `<img src="./img/plus-square.svg" alt="Simbolo añadir">
                        <span>${capitalizeFirstLetter(tipo)}</span>`;
    return button;
}

function getDeleteButtonHtml(){
    let button = document.createElement("button");
    button.setAttribute("class","btn-eliminar");
    button.setAttribute("type","button");
    button.setAttribute("onclick","remove(this)");
    button.innerHTML = `<img src="./img/trash.svg" alt="Icono Basura">`;
    return button;
}


function getLogoutButtonHtml(){
    return `<button class="btn btn-outline-danger col-md-2" type="submit" id="btn-login" onclick="logout()">Logout</button>`;
}

function getLoginHtml(){
    return `<form class="d-flex col-lg-9" id="loginForm">
                <span class="input-group">
                    <span class="input-group-text">
                        <img src="./img/person-fill.svg" alt="Icono Username">
                    </span>
                    <input  class="form-control me-2" id="username" type="text" placeholder="Username" aria-label="Username">
                </span>
                <span class="input-group">
                    <span class="input-group-text">
                        <img src="./img/key-fill.svg" alt="Icono Password">
                    </span>
                    <input class="form-control me-4" id="password" type="password" placeholder="Password" />
                </span>
                
                <button class="btn btn-outline-primary col-md-2" type="submit" id="btn-login" onclick="login()">Login</button>
            </form>`
}

function getCheckboxHtml(array,tipo){
    let html = "";
    if (array.length != 0){
        html = `<p class="col-sm-3">${capitalizeFirstLetter(tipo)} que han participado:</p>`;
        html += `<div class="col-sm-9">`;
        for(element of array){
            html += `<div>
                        <input type="checkbox" name="${element.tipo}" value="${element.id}">
                        <label for="${element.id}">${element.nombre}</label>
                    </div>`
        }
        html += `</div>`;
    }
    return html;
}

function updateStorageElementId(id){
    sessionStorage.setItem('idElementoAPresentar',id);
}

function updateStorageLastIdGiven(id){
    sessionStorage.setItem('lastIdGiven',id);
}

function updateStorageArrays(element){
    let array = getStorageArray(element.tipo);
    array.push(element);
    storeArray(array,element.tipo);
}

function updateArray(array,elem){
    const index = getElementIndex(array,elem);
    array[index] = elem;
    storeArray(array,elem.tipo);
}

function updateStorageTipo(tipo){
    sessionStorage.setItem('tipo',tipo);
}

function updateForm(modo){
    const form = document.getElementById("creation-form");
    if(modo == 'edit'){
        form.setAttribute("onsubmit","editElement(event)");
    }else{
        form.setAttribute("onsubmit","addElement(event)");
    }
}

function updateElementAtrributes(elem){
    elem.nombre = document.getElementById('nombre').value;
    elem.fechaInicio = document.getElementById('fecha-inicio').value;
    elem.fechaFin = document.getElementById('fecha-fin').value;
    elem.imagen = document.getElementById('url-img').value;
    elem.wiki = document.getElementById('url-wiki').value;
    elem.personas = getCollaborators(tipos.PERSONAS)
    elem.entidades = getCollaborators(tipos.ENTIDADES);
}

function updateLoginStatus(status){
    updateStatus("logged",status);
}

function updateEditModeStatus(status){
    updateStatus("editMode",status);
}

function updateStatus(elem,status){
    sessionStorage.setItem(elem,JSON.stringify(status));
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function goToReadIndexWindow(elem){
    const elementId = elem.getAttribute('data-id');
    const elementTipo = elem.getAttribute('data-tipo');
    updateStorageTipo(elementTipo);
    updateStorageElementId(elementId);
}

function goToHomeWindow(){
    window.location.href = 'index.html';
}

function goToCreateEditWindow(){
    window.location.href = "./createOrEditElem.html";
}

function goToEditWindow(){
    updateEditModeStatus(true);
    goToCreateEditWindow();
}

function goToCreateWindow(elem){
    updateEditModeStatus(false);
    updateStorageTipo(elem.getAttribute("data-tipo"));
    goToCreateEditWindow();
}


let persona1 = {
    id : 1,
    tipo : "personas",
    nombre : "Brendan Eich",
    fechaInicio : "1955-07-04",
    fechaFin : "",
    imagen : "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Brendan_Eich_Mozilla_Foundation_official_photo.jpg/800px-Brendan_Eich_Mozilla_Foundation_official_photo.jpg",
    wiki : "https://es.wikipedia.org/wiki/Brendan_Eich",
    personas : "",
    entidades : ""
}

let entidad1 = {
    id : 2,
    tipo : "entidades",
    nombre : "Sun Microsystems",
    fechaInicio : "1982-02-24",
    fechaFin : "",
    imagen : "https://www.incubaweb.com/wp-content/uploads/2020/04/logo-sun-microsystems.gif",
    wiki : "https://es.wikipedia.org/wiki/Sun_Microsystems",
    personas : [1],
    entidades : []
}

let producto1 = {
    id : 3,
    tipo : "productos",
    nombre : "JavaScript",
    fechaInicio : "1995-12-04",
    fechaFin : "",
    imagen : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/800px-Unofficial_JavaScript_logo_2.svg.png",
    wiki : "https://es.wikipedia.org/wiki/JavaScript",
    personas : [1],
    entidades : [2]
}