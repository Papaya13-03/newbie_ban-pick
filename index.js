const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

var pickChar = $$('.pick_char');
var pickCharImg = $$('.pick_char img');
const Query = [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1];// 0 is ban | 1 is pick
const Turn  = [0,1,0,1,0,1,0,1,1,0,0,1,1,0,1,0,1,0,0,1,1,0,0,1];// 0 is Lumine | 1 is Aether
var currQuery = 0;
var ban = [0,0];
var leftBan = $$('.ban_left .ban_char img');
var rightBan = $$('.ban_right .ban_char img');
var pick = [0,0];
var leftPick = $$('#left .pick_char img');
var rightPick = $$('#right .pick_char img');
var left = $$('#left .pick_char');
var right = $$('#right .pick_char');
/// Handle Count Down
var countDown = 40;
var characterListData = [];
var characterList = $('#list_char');
var character = [];

function showCharacterList() {
    characterList.innerHTML = "";
    characterListData.forEach((val,index)=>{
        characterList.innerHTML += (`
            <div class="character" vision="${val.vision}">
                <img src="/imgs/square/${val.name}.png" alt="character">
            </div>
        `);
    })
    character = $$('.character');
    character[0].classList.add('is_focus');
    character.forEach((e)=>{
        e.addEventListener('click',()=>{    
            $('.is_focus').classList.remove("is_focus");
            e.classList.add('is_focus');
        })
    })
}

function getCharacterData(){
    fetch("./character.json")
        .then((val)=>val.json())
        .then((data)=>{
            characterListData = data;

            showCharacterList();
        })
}

function resetCountdown(){
    countDown = 40;
    handleQuery();
}

function getCurrImg() {
    var URL = $('.is_focus img').src.split('/');
    var result = URL[URL.length - 1];
    result = result.replace('%20',' ');
    result=result.slice(0,result.length-4);
    return result;
}

function removeCharacter() {
    const currImg = getCurrImg(); 
    let indexCurrImg = 0;
    characterListData.forEach((val,index)=>{
        if(val.name === currImg)indexCurrImg = index;
    })
    var result = characterListData[indexCurrImg];
    characterListData.splice(indexCurrImg,1);
    showCharacterList();
    return result;
}

function handleQuery() {
    const tmp = removeCharacter();
    console.log(tmp);
    const nameCharacter = tmp.name;
    const vision = tmp.vision;
    if(Query[currQuery] == 0){
        if(Turn[currQuery] == 0){
            leftBan[ban[0]].src = `./imgs/square/${nameCharacter}.png`;
            leftBan[ban[0]].setAttribute("vision",vision)
        }
        else {
            rightBan[ban[1]].src = `./imgs/square/${nameCharacter}.png`;
            rightBan[ban[1]].setAttribute("vision",vision);
        }
        ban[Turn[currQuery]]++;
    }
    else {
        if(Turn[currQuery] == 0){
            leftPick[pick[0]].src = `./imgs/rect/${nameCharacter}.png`;
            left[pick[0]].setAttribute("picked","true");
        }
        else {
            rightPick[pick[1]].src = `./imgs/rect/${nameCharacter}.png`;
            right[pick[1]].setAttribute("picked","true");
        }
        pick[Turn[currQuery]]++;
    }
    ++currQuery;
    if(currQuery == 24){
        $(".btn").style.display = "none";
        return;
    }
    if(Query[currQuery] == 0){
        $('.btn').innerHTML = "Ban";
        if(Turn[currQuery] == 0){
            leftBan[ban[0]].src = `./imgs/square/Loading.gif`;
        }
        else {
            rightBan[ban[1]].src = `./imgs/square/Loading.gif`;
        }
    }
    else {
        $('.btn').innerHTML = "Pick";
        // if(Turn[currQuery] == 0){
        //     leftPick[pick[0]].src = `./imgs/rect/loading.gif`;
        // }
        // else {
        //     rightPick[pick[1]].src = `./imgs/rect/loading.gif`;
        // }
    }
}

getCharacterData();

if(Turn[currQuery] == 0){
    leftBan[ban[0]].src = `./imgs/square/Loading.gif`;
}
else {
    rightBan[ban[1]].src = `./imgs/square/Loading.gif`;
}

$('.count_down').innerHTML = countDown;

var countingDown = setInterval(()=>{
    if(countDown == -1)resetCountdown();
    $('.count_down').innerHTML = countDown;
    countDown --;
},1000)

$('.btn').addEventListener('click',()=>{
    resetCountdown();
})

$('.btn').addEventListener('mousedown',function handle(){
    this.style.transform = "scale(0.9)";
})

$('.btn').addEventListener('mouseup',function handle(){
    this.style.transform = "scale(1)";
})