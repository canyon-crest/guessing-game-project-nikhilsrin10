setInterval(() => date.textContent = time(), 1000);

let score, answer, level, player_name = "";
const levelArr = document.getElementsByName("level");
const scoreArr = {easy: [], medium: [], hard: []};
let startMs = 0;
let totalTime = {easy: 0, medium: 0, hard: 0};
let fastest = {easy: Infinity, medium: Infinity, hard: Infinity};

let streak = {easy: 0, medium: 0, hard: 0};
let maxStreak = {easy: 0, medium: 0, hard: 0};

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);


function time(){
    let d = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month = months[d.getMonth()];
    let day = d.getDate();

    let suffix = "th";
    if(![11, 12, 13].includes(day % 100)){
        if(day % 10 === 1){
            suffix = "st";
        }
        else if(day % 10 === 2){
            suffix = "nd";
        }
        else if(day % 10 === 3){
            suffix = "rd";
        }
    }

    let hours = d.getHours();
    let minutes = String(d.getMinutes()).padStart(2, "0");
    let seconds = String(d.getSeconds()).padStart(2, "0");
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    let str = `${month} ${day}${suffix}, ${d.getFullYear()}, ${hours}:${minutes}:${seconds} ${period}`;
    return str;
}

function play(){
    if(!player_name){
        player_name = prompt("Enter your name:");
        while(!player_name){
            player_name = prompt("You must enter enter your name:");
        }
        player_name = player_name[0].toUpperCase() + player_name.slice(1).toLowerCase();
    }

    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    guess.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = levelArr[i].id === "e" ? "easy" : levelArr[i].id === "m" ? "medium" : "hard";
        }
    }

    let range = level === "easy" ? 3 : level === "medium" ? 10 : 100;
    answer = Math.floor(Math.random() * range) + 1;
    msg.textContent = player_name + ", guess a number 1-" + range;
    guess.placeholder = "";
    score = 0;
    startMs = new Date().getTime();
}

function makeGuess(){
    let range = level === "easy" ? 3 : level === "medium" ? 10 : 100;
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > range){
        msg.textContent = player_name + ", INVALID, guess a number between 1 and " + range;
        return;
    }
    score++;

    let diff = Math.abs(userGuess - answer);
    let feedback = "";
    if(diff === 0) feedback = "Correct!";
    else if(diff <= range / 10) feedback = "Hot!";
    else if(diff <= range / 5) feedback = "Warm!";
    else feedback = "Cold!";

    if(userGuess < answer){
        msg.textContent = feedback + " Too low, try again " + player_name + "!";
    }
    else if(userGuess > answer){
        msg.textContent = feedback + " Too high, try again " + player_name + "!";
    }
    else{
        let endMs = new Date().getTime();
        msg.textContent = "Correct! " + player_name + ", you got it in " + score + " guesses.";
        reset();
        updateScore();
        updateTimers(endMs);
    }
}

function giveUp(){
    msg.textContent = player_name + ", you gave up! The answer was " + answer + ". Better luck next time buddy!";
    streak[level] = 0;
    if(document.getElementById("bonus")) document.getElementById("bonus").textContent = "Streak bonus multiplier: x1.00";
    reset();
}

function reset(){
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;
    for(let i = 0; i < levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(){
    scoreArr[level].push(score);
    wins.textContent = "Total wins (" + level + "): " + scoreArr[level].length;
    let sum = 0;
    scoreArr[level].sort((a, b) => a - b);
    const lb = document.getElementsByName("leaderboard");
    
    for(let i = 0; i < scoreArr[level].length; i++){
        sum += scoreArr[level][i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[level][i];
        }
    }
    let avg = sum/scoreArr[level].length;

    streak[level]++;
    if(streak[level] > maxStreak[level]) maxStreak[level] = streak[level];

    if(!document.getElementById("streak")){
        let p = document.createElement("p");
        p.id = "streak";
        document.body.appendChild(p);
    }
    document.getElementById("streak").textContent = 
        "Current streak (" + level + "): " + streak[level] + " | Max streak: " + maxStreak[level];

    let bonus = 1 + 0.05 * streak[level];
    if(!document.getElementById("bonus")) {
        let p = document.createElement("p");
        p.id = "bonus";
        document.body.appendChild(p);
    }
    document.getElementById("bonus").textContent = "Streak bonus multiplier: x" + bonus.toFixed(2);

    avgScore.textContent = "Average guesses (" + level + "): " + (avg / bonus).toFixed(2);
}

function updateTimers(endMs){
    let roundTime =(endMs - startMs)/1000;
    totalTime[level] += roundTime;
    if(roundTime < fastest[level]) fastest[level] = roundTime;

    if(!document.getElementById("fastest")){
        let p1 = document.createElement("p");
        p1.id = "fastest";
        document.body.appendChild(p1);
        let p2 = document.createElement("p");
        p2.id = "avgTime";
        document.body.appendChild(p2);
    }

    document.getElementById("fastest").textContent = "Fastest game (" + level + "): " + fastest[level].toFixed(2) + " sec";
    document.getElementById("avgTime").textContent = "Average time (" + level + "): " +(totalTime[level]/scoreArr[level].length).toFixed(2) + " sec";
}