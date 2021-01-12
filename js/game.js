const canvas = document.getElementById('canvasTest');
const ctx = canvas.getContext('2d');



let x = 0
let y = 0
canvas.width = document.documentElement.clientWidth || document.body.clientWidth;
canvas.height = document.documentElement.clientHeight || document.body.clientHeight;
var ongoingTouches = [];
var rectToMove = []

function rect_create(x, y, w, h, color, dx, dy) {
  let obj = {
    x: x,
    y: y,
    w: w,
    h: h,
    color: color,
    dx: dx,
    dy: dy,
    directionHorizontal: true,
    directionVertical: true,
  }
  rectToMove.push(obj)
}

var img = new Image()
img.src = "img/DVD_logo.png"

function gameLoop() {

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  //ctx.drawImage(img, x, y, 100, 100)

  if (rectToMove[0] != null) {
    rectToMove.forEach(element => {
      ctx.fillStyle = element.color;
      ctx.fillRect(element.x, element.y, element.w, element.w);

      //ctx.globalCompositeOperation = "destination-in";
      //ctx.drawImage(img,element.x,element.y,element.w,element.h);
      ///ctx.globalCompositeOperation = "source-over";
      
    });
  }

  if (rectToMove[0] != null) {
    rectToMove.forEach(element => {

      if (element.directionHorizontal) {
        element.x += element.dx
      } else {
        element.x -= element.dx
      }

      if (element.directionVertical) {
        element.y += element.dy
      } else {
        element.y -= element.dy
      }
    });
  }

  rectToMove.forEach(element => {
    if (element.x > canvas.width - 100 || element.x < 0) {
      element.color = 'rgba('+ Math.floor(Math.random()*255 )+','+Math.floor(Math.random()*255 )+','+Math.floor(Math.random()*255 )+')'
      element.directionHorizontal = !element.directionHorizontal
    } else if (element.y > canvas.height - 100 || element.y < 0) {
      element.color = 'rgba('+ Math.floor(Math.random()*255 )+','+Math.floor(Math.random()*255 )+','+Math.floor(Math.random()*255 )+')'
      element.directionVertical = !element.directionVertical
    }
  });




}

setInterval(gameLoop, 1000 / 60)

function startup() {
  var el = document.getElementById("canvasTest");
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
}

document.addEventListener("DOMContentLoaded", startup);

function handleStart(evt) {
  evt.preventDefault();
  //console.log("touchstart.");

  var el = document.getElementById("canvasTest");
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;
  //console.log(touches[0].pageX + "." + touches[0].pageY)
  //that's the variables to change the touches because we can't change touches[0].pageX
  var touchX = 0
  var touchY = 0

  if (touches[0].pageX < 49) {
    touchX = touches[0].pageX + 50
  } else if (touches[0].pageX > canvas.width - 49) {
    touchX = touches[0].pageX - 50
  } else {
    touchX = touches[0].pageX
  }
  if (touches[0].pageY < 49) {
    touchY = touches[0].pageY + 50
  } else if (touches[0].pageY > canvas.height - 49) {
    touchY = touches[0].pageY - 50
  } else {
    touchY = touches[0].pageY
  }

  rect_create(touchX - 50, touchY - 50, 100, 100, "red", Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1);

  for (var i = 0; i < touches.length; i++) {
    //console.log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));
    var color = colorForTouch(touches[i]);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
    //console.log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var el = document.getElementById("canvasTest");
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      //console.log("continuing touch " + idx);
      ctx.beginPath();
      //console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      //console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      console.log(".");
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  //console.log("touchend");
  var el = document.getElementById("canvasTest");
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
      ongoingTouches.splice(idx, 1); // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  console.log("touchcancel.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1); // remove it; we're done
  }
}

function colorForTouch(touch) {
  var r = touch.identifier % 16;
  var g = Math.floor(touch.identifier / 3) % 16;
  var b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  //console.log("color for touch with identifier " + touch.identifier + " = " + color);
  return color;
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}

function copyTouch({
  identifier,
  pageX,
  pageY
}) {
  return {
    identifier,
    pageX,
    pageY
  };
}