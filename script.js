let captlizedalist = [];
let wordsCounter = 0 ;
let totalNumberWords;
let timeCounter;
let totalTime;
 
async function getWordsForLevel(level){
await fetch("./levels.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load JSON");
    }
    return response.json();
  })
  .then((data) => {
    data[level].forEach((word)=>{
	let captlizedaWord= word.slice(0, 1).toUpperCase() + word.slice(1, word.length)
		captlizedalist.push(captlizedaWord)
    })
    console.log(data[level])
    totalNumberWords= data[level].length
  })
  .catch((error) => {
    console.error(error);
  });
  
}

window.onload = () => {
    rules();
};

  
const selectDifficulty= document.querySelector("select");

selectDifficulty.value ="";
document.querySelector(".container").classList.add("hidden")

selectDifficulty.addEventListener("change",async ()=>{
	document.querySelector(".container").classList.remove("hidden")
	selectDifficulty.classList.add("select-disabled");
	await getWordsForLevel(selectDifficulty.value);
  creatingWordsInPage(captlizedalist)
	chosingRandomWord(captlizedalist)
	forTime()
	getAndcheckingValue()
	
});

function rules (){
	selectDifficulty.classList.add("hidden")
	document.querySelector("label").classList.add("hidden")
	document.querySelector("header").classList.add("hidden")
	
	const rulesDiv= document.querySelector(".rules-message");
	const title= document.createElement("h1")
	title.textContent= "game rules"
	rulesDiv.prepend(title)
	creatingMessage(
		rulesDiv,
		"green",
`1. Time Limit: You have a limited number of seconds to type the word shown on the screen.

2. Correct Match: Your input must match the displayed word exactly, including capital letters, lowercase letters, spaces, and punctuation.

3. Multiple Attempts: You may press Enter and try again as many times as you want until the timer runs out.

4. Submit: Press Enter to check your answer.

5. Feedback: After each submission, you will immediately be told whether your answer is Correct or Incorrect.

6. Next Word: If your answer is correct, the next word will appear and the timer will reset.

7. Game Over: If the timer reaches 0 before you enter the correct word, the game ends.`,
		"win"
		)
		
	document.querySelector(".rules-message button.close-button").classList.add("hidden")
		
   const readyButton= document.createElement("button")
   readyButton.textContent= 'ready';
   readyButton.classList.add("btn-primary", "btn-ready")
   readyButton.addEventListener("click",()=>{
	rulesDiv.classList.add("hidden")
	selectDifficulty.classList.remove("hidden")
	document.querySelector("label").classList.remove("hidden")
	document.querySelector("header").classList.remove("hidden")
   })
   
   
   rulesDiv.append(readyButton)
}

function creatingWordsInPage(words){
	document.querySelector(".wining-date").textContent = localStorage.getItem("lastWiningDate")  || "Last Wining Date will appear here"
	
		words.forEach((word)=>{
		let wordDiv=document.createElement('div');
		wordDiv.textContent= word;
		wordDiv.classList.add("word-chip");
		document.querySelector('.container .words').append(wordDiv)
	})
	  document.querySelector(".word-number-now").textContent = `word : ${wordsCounter + 1} from ${totalNumberWords }`
}


function chosingRandomWord(words){
	if( wordsCounter !== totalNumberWords ){
	let randomWord= words[Math.floor(Math.random() * words.length )];
	document.querySelector(".chosen-word").textContent = randomWord
	captlizedalist= captlizedalist.filter(item => item !== randomWord)
	document.querySelector(".words").innerHTML=""
	creatingWordsInPage(captlizedalist)
	document.querySelector(".input-filed").focus()
	if(selectDifficulty.value === "easy") {  timeCounter= 5} 
	else if(selectDifficulty.value === "moderate") { timeCounter= 6} 
	else if(selectDifficulty.value === "hard") { timeCounter= 7} 
	else if(selectDifficulty.value === "imposible") { timeCounter = 9} 
	totalTime= timeCounter
if(wordsCounter === 0) timeCounter = totalTime * 2
	}
	else {
				wining()
				timeCounter = 0
				document.querySelector(".timer").textContent = timeCounter
			}
}

function forTime(){
	if (timeCounter === 0) console.log("sorry")
const timer = setInterval(() => {
  timeCounter -= 1;
if (timeCounter >= 0) document.querySelector(".timer").textContent = timeCounter;

  if (timeCounter === 0) {
    clearInterval(timer);
    losing();
  }
}, 1000);}

function getAndcheckingValue(){
	
	if(timeCounter !== 0 ){
		
	document.querySelector(".input-filed").addEventListener("keydown", (event)=>{
		
		if(event.key === "Enter"){
			
		if(document.querySelector(".chosen-word").textContent === document.querySelector(".input-filed").value ) {
			
			document.querySelector(".result-one-word").textContent = "true !";
			
			document.querySelector(".result-one-word").classList.remove("result-wrong")
			document.querySelector(".result-one-word").classList.add("result-correct")
			
			setTimeout(()=> {
				document.querySelector(".result-one-word").textContent = ""
				document.querySelector(".input-filed").value= "";
			
			wordsCounter += 1;
			timeCounter= totalTime 
			chosingRandomWord(captlizedalist);
			}, 500)
			
			
			
		}else{
			document.querySelector(".result-one-word").classList.remove("result-correct")
			document.querySelector(".result-one-word").classList.add("result-wrong")
			document.querySelector(".result-one-word").textContent = "wrong ! try again";
			setTimeout(()=> document.querySelector(".result-one-word").textContent = "", 500)
			document.querySelector(".input-filed").value = ""
		} 
		}
	})
	}else{
		losing()
	}
	
}

function removeAllForMessage() {
  document.querySelector("header").classList.add("dimmed");
  document.querySelector("main").classList.add("dimmed");
}

function losing() {
  removeAllForMessage();

  const losingMessage = document.createElement("div");
  losingMessage.classList.add("message");

  creatingMessage(
    losingMessage,
    "#ef4444",
    `😅 Time's up!`,
    "lose"
  );

  playAgain(".message");
  
  document.querySelector("main").classList.add("locked");
}

function wining() {
  removeAllForMessage();

  const winingMessage = document.createElement("div");
  winingMessage.classList.add("message");

  creatingMessage(
    winingMessage,
    "#22c55e",
    "🎉 Congratulations! You matched all the words!",
    "win"
  );

  playAgain(".message");
  
  document.querySelector("main").classList.add("locked");
  
   const currentDate= new Date();

localStorage.setItem(
  "lastWiningDate",
  `year: ${currentDate.getFullYear()} month: ${currentDate.getMonth() } day: ${currentDate.getDate()} hour: ${currentDate.getHours()} minute: ${currentDate.getMinutes()}`
);
document.querySelector(".wining-date").textContent = `year: ${currentDate.getFullYear()} month: ${currentDate.getMonth() } day: ${currentDate.getDate()} hour: ${currentDate.getHours()} minute: ${currentDate.getMinutes()}`
}

function creatingMessage(element, pColor, text, type) {

  element.classList.add("message-modal", type === "win" ? "message-modal--win" : "message-modal--lose");

  const closeBtn = document.createElement("button");
  closeBtn.classList.add("close-button")
  closeBtn.classList.add("modal-close-btn");
  closeBtn.textContent = "✕";

  closeBtn.onclick = () => {
    element.remove();

    document.querySelector("header").classList.remove("dimmed");
    document.querySelector("main").classList.remove("dimmed");
    document.querySelector("main").classList.remove("locked");
    playAgain("body")
  };

  const p = document.createElement("p");

  p.textContent = text;

  p.classList.add("modal-message-text");
  p.classList.add(type === "win" ? "text-success" : "text-danger");

  element.append(closeBtn);
  element.append(p);

  document.body.append(element);
  
}

function playAgain(place) {

  const playAgainBtn = document.createElement("button");

  playAgainBtn.textContent = "⟳ Play Again";

  playAgainBtn.classList.add("btn-primary", "btn-play-again");

  playAgainBtn.onclick = () => location.reload();

  document.querySelector(place).append(playAgainBtn);
}
