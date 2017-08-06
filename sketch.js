var cells = [];
var startCells = 10;
var maxCells = 1500;
var zapRate = 0.01;
var zapSize = 5;
var zapLethality = 0.015;
var zapRange = 80;
var killMode = false;

function setup() {
  createCanvas(800, 600);
  
  for (var i = 0; i < startCells; i++) {
    cells.push(new Cell());
  }
}

function draw() {
  background(220, 220, 220);
  
  for (var i = cells.length - 1; i >= 0; i--) {
    cells[i].update();
    if (cells[i].isDead()) {
      cells.splice(i, 1);
    }
  }
  
  for (var i = cells.length - 1; i >= 0; i--) {
    cells[i].show();
  }

  if (random(0, 1) <= zapRate) {
    zap(random(width), random(height));
  }
  
  checkKeys();
  checkMouseZap();
  drawZapArea();
}

function checkKeys() {
  if (keyIsDown(UP_ARROW)) {
    zapRange *= 1.01;
  }
  
  if (keyIsDown(DOWN_ARROW)) {
    zapRange /= 1.01;
  }
}

function keyReleased() {
  if (keyCode === 32) {
    killMode = !killMode;
  }
}

function checkMouseZap() {
  if (mouseIsPressed) {
    if (killMode) {
      kill();
    } else {
      var r = random(zapRange / 2);
      var a = random(TWO_PI);
      var x = mouseX + cos(a) * r;
      var y = mouseY + sin (a) * r;
      
      zap(x, y);
    }
  }
}

function drawZapArea() {
  push();
    stroke(0, 50);
    if (killMode) {
      fill(255, 0, 0, 30);
    } else {
      noFill();
    }
    ellipse(mouseX, mouseY, zapRange);
  pop();
}

function kill() {
  for (var i = cells.length - 1; i >= 0; i--) {
    if (dist(cells[i].pos.x, cells[i].pos.y, mouseX, mouseY)
        <= zapRange / 2) {
      cells.splice(i, 1);
    }
  }
  
  push();
    stroke(0, 50);
    fill(255, 0, 0, 80);
    ellipse(mouseX, mouseY, zapRange);
  pop();
}

function zap(w, h) {
  var hit = createVector(w, h);
  var zapKill;
  if (random(0, 1) <= zapLethality) {
    zapKill = true;
  } else {
    zapKill = false;
  }
  
  push();
    noStroke();
    fill(0);
    ellipse(hit.x, hit.y, zapSize);
  pop();
  
  for (var i = cells.length - 1; i >= 0; i--) {
    if (dist(cells[i].pos.x, cells[i].pos.y, hit.x, hit.y)
        <= cells[i].gen.size) {
      if (zapKill) {
        cells.splice(i, 1);
      } else {
        cells[i].dna.mutate();
      }
    }
  }
}
