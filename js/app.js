//Variables constantes
const inpKey =   document.getElementById("inpKey");
const inpValue = document.getElementById("inpValue");
const lsOutput = document.getElementById("lsOutput");
const title =    document.getElementById("clase");
const secret =   document.getElementById("hidden");
const results =  document.getElementById("result");


const arrayWarrior =  {hitpoints:"500",Mana:"0",   Energy:"1000",Strenght:"100",Speed:"35%",Faith:"None",  Dexterity:"5",  Pact:"Imperial"};
const arrayMage =     {hitpoints:"150",Mana:"3000",Energy:"500",Strenght:"5",   Speed:"50%",Faith:"Medium",Dexterity:"20", Pact:"Republic"};
const arrayAssassin = {hitpoints:"300",Mana:"500", Energy:"700",Strenght:"60",  Speed:"80%",Faith:"Low",   Dexterity:"100",Pact:"Caotic"};
const arrayScholar =  {hitpoints:"100",Mana:"1000",Energy:"350",Strenght:"20",  Speed:"40%",Faith:"High",  Dexterity:"35", Pact:"Neutral"};
const arrayDeprived = {hitpoints:"250",Mana:"750", Energy:"500",Strenght:"40",  Speed:"55%",Faith:"None",  Dexterity:"40", Pact:"Renegade"};

const arrayClasses = [arrayWarrior,arrayMage,arrayAssassin,arrayScholar,arrayDeprived];

//Nombres en formato JSON
const namesJson = {
    "nombre1": "Raghat",
    "nombre2": "Uhmla",
    "nombre3": "Borto",
    "nombre4": "Rexxar",
    "nombre5": "Gul'Dan",
    "nombre6": "Grommash",
    "nombre7": "Pocho'Feo"
};

//Array de imagenes para el avatar
const imageArray = ["./image/index1.png",
                    "./image/index2.png",
                    "./image/index3.png",
                    "./image/index4.png",
                    "./image/index5.png",
                    "./image/index6.png"];


//Clase constructora
class Character {
    constructor(level) {
        this.level = Number(level);
    }
    calculateExp(){
        return 1000 - this.level * 10;
    }
}


//JQUERY READY con todas las funciones jquery del proyecto
$(()=>{
    //Funcion onchange para la clase constructora 
    $("#level").on("change", function expCalc() { 
        let inputValue = document.getElementById("level").value;
        if((inputValue >= 1 && inputValue <= 100)){
            let expTest = new Character(inputValue);
            results.innerHTML = `At level ${inputValue} you need ` + (expTest.calculateExp()) + ` Experience to get Max lvl`;
        }else{
            results.innerHTML = "Type a Number between 1 to 100";
        }
    });

    //Boton para conseguir un nombre random del JSON nombres
    $("#btnName").click(function names() {
        let properties = Object.values(namesJson);
        let index = Math.floor(Math.random() * properties.length);
        document.getElementById("message").innerHTML = properties[index];
    });

    //Boton para conseguir una imagen random del Array
    $("#btnImage").click(function image() {
        let randomNumber = Math.floor(Math.random()*imageArray.length);
        document.getElementById("mainImage").src = (imageArray[randomNumber]);
    });
    
    //Boton para insertar daatos en el localstorage
    $("#btnInsert").click(()=>{
        let key = inpKey.value;
        let value = inpValue.value;
        if(key && value){
            localStorage.setItem(key, value);
            location.reload();
        }
    });

    //Boton para borrar los datos y campos del localstorage
    $("#btnDelete").click(()=>{
        localStorage.clear();
        location.reload();
        document.getElementById("inpKey").value = "";
    });

    //Efecto de slide para las clases secretas
    $(".check_secret").click(()=>{ 
        $("#hidden").slideToggle();
    });

    //Efecto de hover para los fieldsets
    $("fieldset").hover(function () {
            $(this).addClass("rainbowAnim");
        }, function () {
            $(this).removeClass("rainbowAnim");
        }
    );

    //darkmode hecho con cambio de clases
    $("#dark_mode_toggle").click(()=>{ 
        if($("#dark_mode_toggle").is(":checked")){
            $("body").addClass("bodydark");
            $("fieldset").addClass("fieldsetdark");
            $("a").addClass("anchordark");
        }else{
            $("body").removeClass("bodydark");
            $("fieldset").removeClass("fieldsetdark");
            $("a").removeClass("anchordark");
        }
    });

    //Funciones onFocus para el formato mobile
    $("#power").on("focus",()=>{document.getElementById("power").value = "";});
    $("#inpKey").on("focus",()=>{document.getElementById("inpKey").value = "";});

    //AJAX y consumo de API
    let ajax = new XMLHttpRequest();
    ajax.open("GET",`https://www.dnd5eapi.co/api/magic-items`);
    ajax.send();
    ajax.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200){
            let tmp = JSON.parse(this.responseText);
            let datos = (tmp.results);
            for(let i = 0;(i < 6 && i < datos.length); i++){
                $("#items").append(`<option value="${datos[i].name}">${datos[i].name}</option>`);
            }
        }
    }
})

//For para insertar los datos conseguidos del localstorage
for(i = 0; i < localStorage.length; i++){
    let key = localStorage.key(i);
    if(showValidate(key)){
        let value = localStorage.getItem(key);
        lsOutput.innerHTML += `${key}: ${value} <br/>`;
        break;
    }
}

//If generales del proyecto (chequeo de mobile para inputs, darkmode check, clases ocultas)

if($(".check_secret").is(":checked")){
    $("#hidden").show();
}else{
    $("#hidden").hide();
}

if($("#dark_mode_toggle").is(":checked")){
    $("body").addClass("bodydark");
    $("fieldset").addClass("fieldsetdark");
    $("a").addClass("anchordark");
}else{
    $("body").removeClass("bodydark");
    $("fieldset").removeClass("fieldsetdark");
    $("a").removeClass("anchordark");
}

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    $("#power").blur(()=>{ 
        validate();
    });
    title.textContent = "Select Your Class!";
}else {
    $("#power").keydown((e)=>{
        if (e.key === "Enter") {  
            validate(e);
        }
    });
    $("#power").on("change",(e)=>{
        validate(e);
    });
}

//Funciones del proyecto (validacion de clases, obtencion de clases de manera exacta y aproximada, muestra de estadisticas segun clase elegida)
function validate(){
    let valorClase = document.getElementById("power").value;
    let claseObtenida = obtainClass(valorClase);
    document.getElementById("clase").innerText= claseObtenida;
}

function obtainClass(attribute){
    let clase = obtainExactClass(attribute);
    if(clase == null){
        clase = obtainPredictionClass(attribute);
    }
    return clase;
}

function obtainExactClass(attribute){
    if (attribute == "Strenght" || attribute == "Size"){
        showStats(0);
        return "Warrior";
    }
    else if (attribute == "Magic"){
        showStats(1);
        return "Mage";
    }
    else if (attribute == "Stealth" || attribute == "Speed"){
        showStats(2);
        return "Assassin";
    }
    else {
        return null;
    }
}

function obtainPredictionClass(attribute){
    if (attribute.length > 10){
        showStats(3);
        return "Scholar";
    }
    else {
        showStats(4);
        return "Deprived";
    }
}

function showStats(index) {
    let column1 = document.getElementById("main_stats");
    let column2 = document.getElementById("secondary_stats")
    let data = arrayClasses[index];
    let row  = `<p>Hitpoint:${data.hitpoints}</p>
                <p>Mana:${data.Mana}</p>
                <p>Energy:${data.Energy}</p>
                <p>Strenght:${data.Strenght}</p>`;
    let row2 = `<p>Speed:${data.Speed}</p>
                <p>Faith:${data.Faith}</p>
                <p>Dexterity:${data.Dexterity}</p>
                <p>Pact:${data.Pact}</p>`;
    column1.innerHTML = row;
    column2.innerHTML = row2;  
}

function showValidate(key){
    if(key == "darkMode"){
        return false;
    }
    return true;
}