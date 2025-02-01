let GameName = "Guess The Word";
document.title = GameName;
document.querySelector("h1").innerHTML = GameName;
document.querySelector("footer").innerHTML = `${GameName} Game Created By 0xdeep`;

let NumberOfTries = 6;
let NumberOfLetters = 6;
let CurrentTry = 1;
let NumberOfHints = 2;

let WordGuess = "";
const Words = ["Create","Update","Delete","Master","Branch","Mainly","Elzero","School"];
WordGuess = Words[Math.floor(Math.random() * Words.length)].toLowerCase();
console.log(WordGuess);
let MassageArea = document.querySelector(".massage");

document.querySelector(".hint span").innerHTML = NumberOfHints;
const GetHintButton = document.querySelector(".hint");
GetHintButton.addEventListener("click",gethint)

function GenerateInput(){
    const InputContainer = document.querySelector(".inputs");

    for(let i = 1; i <= NumberOfTries; i++){
        const TryDiv = document.createElement("div");
        TryDiv.classList.add(`try-${i}`);
        TryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i !== 1)TryDiv.classList.add("disabled-inputs");

        for(let j = 1; j<=NumberOfLetters; j++){
            const Input = document.createElement("input");
            Input.type = "text";
            Input.id = `guess-${i}-letter-${j}`;
            Input.setAttribute("maxlength","1");
            TryDiv.appendChild(Input);
        }

        InputContainer.appendChild(TryDiv);
    }
    InputContainer.children[0].children[1].focus();

    const InputsDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    InputsDisabledDiv.forEach((input) => (input.disabled = true));

    const Inputs = document.querySelectorAll("input");
    Inputs.forEach((input, index) => {
        input.addEventListener("input",function(){
            this.value = this.value.toUpperCase();
            const NextInput = Inputs[index + 1]; 
            if(NextInput) NextInput.focus();
        })
        
        input.addEventListener("keydown", function(event){
            const CurrentIndex = Array.from(Inputs).indexOf(event.target);

            if(event.key === "ArrowRight"){
                const NextInput = CurrentIndex + 1;
                if(NextInput < Inputs.length) Inputs[NextInput].focus();
            }

            if(event.key === "ArrowLeft"){
                const PrevInput = CurrentIndex - 1;
                if(PrevInput >= 0) Inputs[PrevInput].focus();
            }
        });
    });
}

const GuessButton = document.querySelector(".check")
GuessButton.addEventListener("click",HandleGuesses);

function HandleGuesses(){
    let SuccessGuess = true;
    for(let i = 1; i<=NumberOfLetters; i++){
        const InputField = document.querySelector(`#guess-${CurrentTry}-letter-${i}`);
        const Letter = InputField.value.toLowerCase();
        const ActuallLetter = WordGuess[i - 1];

        if(Letter === ActuallLetter){
            InputField.classList.add("yes-in-place");
        }else if(WordGuess.includes(Letter) && Letter!==""){
            InputField.classList.add("not-in-place");
            SuccessGuess = false;
        }else{
            InputField.classList.add("no");
            SuccessGuess = false;
        }
    }
    if(SuccessGuess){
        MassageArea.innerHTML = `Your Win The Word Is <span>${WordGuess}</span>`;
        if(NumberOfHints === 2){
            MassageArea.innerHTML = `<p>Congratz You Didn\`t Use Hint</p> `;
        }
        let AllTries = document.querySelectorAll(".inputs > div");
        AllTries.forEach((TryDiv) => TryDiv.classList.add("disabled-inputs"))
        GuessButton.disabled = true;
        GetHintButton.disabled = true;
    }else{
        document.querySelector(`.try-${CurrentTry}`).classList.add("disabled-inputs");
        const CurrentTryInputs = document.querySelectorAll(`.try-${CurrentTry} input`);
        CurrentTryInputs.forEach((input) => (input.disabled = true));

        CurrentTry++;

        const NextTryInput = document.querySelectorAll(`.try-${CurrentTry} input`);
        NextTryInput.forEach((input) => (input.disabled = false));

        let el = document.querySelector(`.try-${CurrentTry}`);
        if(el){
            document.querySelector(`.try-${CurrentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        }else{
            GuessButton.disabled = true;
            GetHintButton.disabled = true;
            MassageArea.innerHTML = `You lose The word Is <span>${WordGuess}</span>`;
        }
    }
}
function gethint(){
    if(NumberOfHints > 0){
        NumberOfHints--;
        document.querySelector(".hint span").innerHTML = NumberOfHints;
    }
    if(NumberOfHints === 0){
        GetHintButton.disabled = true;
    }

    const EnabledInputs = document.querySelectorAll("input:not([disabled])");
    const EmptyEnabledInputs = Array.from(EnabledInputs).filter((input) => input.value === "");

    if(EmptyEnabledInputs.length > 0){
        const RandomIndex = Math.floor(Math.random() * EmptyEnabledInputs.length);
        const RandomInput = EmptyEnabledInputs[RandomIndex];
        const IndexToFill = Array.from(EnabledInputs).indexOf(RandomInput);
        if(IndexToFill !== -1){
            RandomInput.value = WordGuess[IndexToFill].toUpperCase();
        }
    }

}

function HandleBackSpace(event){
    if(event.key==="Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const CurrentIndex = Array.from(inputs).indexOf(document.activeElement);
        
        if(CurrentIndex > 0){
            const CurrentInput = inputs[CurrentIndex];
            const PrevInput = inputs[CurrentIndex - 1];
            CurrentInput.value = "";
            PrevInput.value = "";
            PrevInput.focus();
        }
    }
}

document.addEventListener("keydown", HandleBackSpace)

window.onload=function(){
    GenerateInput();
}