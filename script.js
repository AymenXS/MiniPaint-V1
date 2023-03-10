const canvas = document.getElementById("canvas"),
  colorBtns = document.querySelectorAll(".color-field"),
  colorPicker = document.querySelector(".color-picker"),
  penWidth = document.querySelector(".pen-width"),
  clearButton = document.getElementById("clear-button"),
  undoButton = document.getElementById("undo-button");

canvas.width = window.innerWidth - 60;
canvas.height = 400;

let context = canvas.getContext("2d");
let startBackgroundColor = "white";
context.fillStyle = startBackgroundColor;
context.fillRect(0, 0, canvas.width, canvas.height);

let drawColor = "black";
let drawWidth = penWidth.value;
let isDrawing = false;

let restoreArray = [];
let index = -1;

canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

colorBtns.forEach((button) => {
  button.addEventListener("click", changeColor);
});

colorPicker.addEventListener("input", changeColorPicker);
penWidth.addEventListener("input", changeWidth);
undoButton.addEventListener("click", undoLast);
clearButton.addEventListener("click", clearCanvas);

function start(event) {
  isDrawing = true;
  context.beginPath();
  event.preventDefault();
}

function draw(event) {
  if (isDrawing) {
    context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    context.strokeStyle = drawColor;
    context.lineWidth = drawWidth;
    context.stroke();
  }
}

function stop(event) {
  if (isDrawing) {
    context.stroke();
    isDrawing = false;
  }

  if (event.type != "mouseout") {
    restoreArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
  }
}

function changeColor() {
  drawColor = getComputedStyle(this).backgroundColor;
}

function changeColorPicker() {
  drawColor = this.value;
}

function changeWidth() {
  drawWidth = this.value;
}

function clearCanvas() {
  context.fillStyle = startBackgroundColor;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);

  restoreArray = [];
  index = 1;
}

function undoLast() {
  if (index <= 0) {
    clearCanvas();
  } else {
    index -= 1;
    restoreArray.pop();
    context.putImageData(restoreArray[index], 0, 0);
  }
}
