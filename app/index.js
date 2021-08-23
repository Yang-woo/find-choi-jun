const imgList = [
  "./src/img/pic_1.JPG",
  "./src/img/pic_2.JPG",
  "./src/img/pic_3.JPG",
  "./src/img/pic_4.JPG",
  "./src/img/pic_5.JPG",
  "./src/img/pic_6.JPG",
  "./src/img/pic_7.JPG",
  "./src/img/pic_8.JPG",
];

const $firstGameScreen = document.querySelector(".first_game_screen");
const $onGameScreen = document.querySelector(".on_game_screen");
const $winGameScreen = document.querySelector(".win_game_screen");
const $loseGameScreen = document.querySelector(".lose_game_screen");

const $startButton = document.querySelector(".start_button");
const $reSrartButton = document.querySelector(".restart_button");
const $statusRemain = document.querySelector(".status_remain");
const $statusTime = document.querySelector(".status_time");

const $bgmCoffee = document.querySelector(".bgm-coffee");
const $bgmCorrect = document.querySelector(".bgm-correct");
const $bgmWrong = document.querySelector(".bgm-wrong");
const $bgmLose = document.querySelector(".bgm-lose");
const $bgmWin = document.querySelector(".bgm-win");

const HIDDEN_CLASSNAME = "hidden";
const CARD_BACK_IMG = "./src/img/pic_back.jpg";
const CARD_SIZE_MEDIATE = "card_size_mediate";

let point = 0;
let remainJun = imgList.length;
let clicked = [];
let completed = [];
let clickable = false;
let timerId = null;
let TIME_LIMIT = 25;

function showResult() {
  $bgmCoffee.pause();
  $onGameScreen.classList.add(HIDDEN_CLASSNAME);

  if (completed.length < imgList.length * 2) {
    $bgmLose.play();
    $loseGameScreen.classList.remove(HIDDEN_CLASSNAME);
    $statusRemain.classList.add(HIDDEN_CLASSNAME);
    $statusTime.classList.add(HIDDEN_CLASSNAME);
  }

  if (completed.length === imgList.length * 2) {
    $bgmWin.play();
    $winGameScreen.classList.remove(HIDDEN_CLASSNAME);
    $statusRemain.classList.add(HIDDEN_CLASSNAME);
    $statusTime.classList.add(HIDDEN_CLASSNAME);
  }
}

function handleCardFlip() {
  if (!clickable || completed.includes(this) || clicked[0] === this) {
    return;
  }
  this.firstElementChild.classList.toggle(HIDDEN_CLASSNAME);
  this.lastElementChild.classList.toggle(HIDDEN_CLASSNAME);
  clicked.push(this);

  if (clicked.length !== 2) {
    return;
  }

  const firstClickedCard = clicked[0];
  const secondClickedCard = clicked[1];
  let firstClickedCardIndex = firstClickedCard.dataset.dataindex;
  let secondClickedCardIndex = secondClickedCard.dataset.dataindex;

  if (firstClickedCardIndex === secondClickedCardIndex) {
    $bgmCorrect.play();
    completed.push(clicked[0]);
    completed.push(clicked[1]);
    clicked = [];
    point++;
    remainJun--;
    $statusRemain.textContent = `남은 준이 : ${remainJun}`;
    if (point !== imgList.length) {
      return;
    }
    setTimeout(() => {
      showResult();
    }, 500);
    return;
  }

  $bgmWrong.play();
  clickable = false;
  setTimeout(() => {
    clicked[0].firstElementChild.classList.toggle(HIDDEN_CLASSNAME);
    clicked[0].lastElementChild.classList.toggle(HIDDEN_CLASSNAME);
    clicked[1].firstElementChild.classList.toggle(HIDDEN_CLASSNAME);
    clicked[1].lastElementChild.classList.toggle(HIDDEN_CLASSNAME);
    clicked = [];
    clickable = true;
  }, 500);
}

function assignCard(array) {
  const $card = document.querySelectorAll(".card");
  const $cardBack = document.querySelectorAll(".card_back");
  const $cardFront = document.querySelectorAll(".card_front");
  for (let i = 0; i < array.length; i++) {
    $card[i].setAttribute("data-dataindex", array[i].replace(/[^0-9]/g, "")); // 정규식??
    $cardBack[i].setAttribute("src", CARD_BACK_IMG);
    $cardFront[i].setAttribute("src", array[i]);
    $cardFront[i].classList.add(HIDDEN_CLASSNAME);
  }

  $statusRemain.textContent = `남은 준이 : ${remainJun}`;
}

function shuffleCard() {
  let imgListCopy = imgList.concat(imgList);
  return imgListCopy.sort(() => Math.random() - 0.5);
}

function createCardElement() {
  for (let i = 0; i < imgList.length * 2; i++) {
    const $card = document.createElement("div");
    const $cardBack = document.createElement("img");
    const $cardFront = document.createElement("img");

    $onGameScreen.append($card);
    $card.append($cardBack, $cardFront);
    $card.classList.add("card");
    $cardBack.classList.add("card_back");
    $cardBack.classList.add(CARD_SIZE_MEDIATE);
    $cardBack.setAttribute("style", "-webkit-user-drag: none;");
    $cardFront.classList.add("card_front");
    $cardFront.classList.add(CARD_SIZE_MEDIATE);
    $cardFront.setAttribute("style", "-webkit-user-drag: none;");
  }
}

function gameStart() {
  clickable = true;
  let newShuffledCardList = shuffleCard();
  createCardElement();
  assignCard(newShuffledCardList);
  const $card = document.querySelectorAll(".card");
  for (let i = 0; i < newShuffledCardList.length; i++) {
    $card[i].addEventListener("click", handleCardFlip);
  }
}

function startTimer() {
  let leftTime = TIME_LIMIT;
  $statusTime.textContent = `남은 시간 : ${leftTime}초`;
  timerId = setInterval(() => {
    leftTime--;
    $statusTime.textContent = `남은 시간 : ${leftTime}초`;
    if (leftTime <= 0) {
      clearInterval(timerId);
      showResult();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

function handleStartButtonClicked() {
  $bgmCoffee.play();
  $firstGameScreen.classList.add(HIDDEN_CLASSNAME);
  $startButton.classList.add(HIDDEN_CLASSNAME);
  $reSrartButton.classList.remove(HIDDEN_CLASSNAME);
  $statusRemain.classList.remove(HIDDEN_CLASSNAME);
  $statusTime.classList.remove(HIDDEN_CLASSNAME);
  $onGameScreen.classList.remove(HIDDEN_CLASSNAME);
  $winGameScreen.classList.add(HIDDEN_CLASSNAME);
  $loseGameScreen.classList.add(HIDDEN_CLASSNAME);

  point = 0;
  remainJun = imgList.length;
  clicked = [];
  completed = [];
  clickable = false;
  timerId = null;

  gameStart();
  startTimer();
}

function handleRestartButtonClicked() {
  const $cardList = document.querySelectorAll(".card");

  $firstGameScreen.classList.remove(HIDDEN_CLASSNAME);
  $startButton.classList.remove(HIDDEN_CLASSNAME);
  $reSrartButton.classList.add(HIDDEN_CLASSNAME);
  $statusRemain.classList.add(HIDDEN_CLASSNAME);
  $statusTime.classList.add(HIDDEN_CLASSNAME);
  $onGameScreen.classList.add(HIDDEN_CLASSNAME);
  $winGameScreen.classList.add(HIDDEN_CLASSNAME);
  $loseGameScreen.classList.add(HIDDEN_CLASSNAME);
  $cardList.forEach((element) => {
    element.remove();
  });
  stopTimer();
}

function init() {
  $startButton.addEventListener("click", handleStartButtonClicked);
  $reSrartButton.addEventListener("click", handleRestartButtonClicked);
}

init();
