const inpKey = document.getElementById("inpKey");
const inpValue = document.getElementById("inpValue");
const lsOutput = document.getElementById("lsOutput");
const title = document.getElementById("clase");
const secret = document.getElementById("hidden");

const arrayWarrior =  {hitpoints:"500",Mana:"0",   Energy:"1000",Strenght:"100",Speed:"35%",Faith:"None",  Dexterity:"5",  Pact:"Imperial"};
const arrayMage =     {hitpoints:"150",Mana:"3000",Energy:"500",Strenght:"5",   Speed:"50%",Faith:"Medium",Dexterity:"20", Pact:"Republic"};
const arrayAssassin = {hitpoints:"300",Mana:"500", Energy:"700",Strenght:"60",  Speed:"80%",Faith:"Low",   Dexterity:"100",Pact:"Caotic"};
const arrayScholar =  {hitpoints:"100",Mana:"1000",Energy:"350",Strenght:"20",  Speed:"40%",Faith:"High",  Dexterity:"35", Pact:"Neutral"};
const arrayDeprived = {hitpoints:"250",Mana:"750", Energy:"500",Strenght:"40",  Speed:"55%",Faith:"None",  Dexterity:"40", Pact:"Renegade"};

const arrayClasses = [arrayWarrior,arrayMage,arrayAssassin,arrayScholar,arrayDeprived];

const namesJson = {
    "nombre1": "Raghat",
    "nombre2": "Uhmla",
    "nombre3": "Borto",
    "nombre4": "Rexxar",
    "nombre5": "Gul'Dan",
    "nombre6": "Grommash",
    "nombre7": "Pocho'Feo"
};

const imageArray = ["./image/index1.png",
                    "./image/index2.png",
                    "./image/index3.png",
                    "./image/index4.png",
                    "./image/index5.png",
                    "./image/index6.png"];


const API_URL = "http://hp-api.herokuapp.com/api/characters";

const HTMLResponse = document.querySelector("#app");


$(()=>{
    $("#btnName").click(function names() {
        let properties = Object.values(namesJson);
        let index = Math.floor(Math.random() * properties.length);
        document.getElementById("message").innerHTML = properties[index];
    });

    $("#btnImage").click(function image() {
        let randomNumber = Math.floor(Math.random()*imageArray.length);
        document.getElementById("mainImage").src = (imageArray[randomNumber]);
    });
    
    $("#btnInsert").click(()=>{
        const key = inpKey.value;
        const value = inpValue.value;
        if(key && value){
            localStorage.setItem(key, value);
            location.reload();
        }
    });

    $("#btnDelete").click(()=>{
        localStorage.clear();
        location.reload();
        document.getElementById("inpKey").value = "";
    });

    $(".checkbox").click(()=>{ 
        if($("input.checkbox").is(":checked")){
            $(".theme").attr("href", "./css/dark.css");
        }else{
            $(".theme").attr("href", "./css/light.css");
        }
    });

    $(".check_secret").click(()=>{ 
        $("#hidden").toggle();
    });

    $("#power").on("focus",()=>{document.getElementById("power").value = "";});
    $("#inpKey").on("focus",()=>{document.getElementById("inpKey").value = "";});
})

for(let i = 0;(i<3 && i < localStorage.length); i++){
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    lsOutput.innerHTML += `${key}: ${value} <br/>`;
}

if($("input.checkbox").is(":checked")){
    $(".theme").attr("href", "./css/dark.css");
}else{
    $(".theme").attr("href", "./css/light.css");
}

if($(".check_secret").is(":checked")){
    $("#hidden").show();
}else{
    $("#hidden").hide();
}

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    $("#power").blur(()=>{ 
        validate();
    });
    title.textContent = "Selecciona tu clase!";
}else{
    $("#power").keydown((e)=>{
        if (e.key === "Enter") {  
            validate(e);
        }
    });
}

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