let status = "";
let video;
let objects = [];
let inputName;
let objectDetected = false;

function setup() {
  let canvasWidth = 380;
  let canvasHeight = 380;
  let canvasX = (windowWidth - canvasWidth) / 2;
  let canvasY = (windowHeight - canvasHeight) / 2 + 150;
  let cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.position(canvasX, canvasY);
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  video.hide();
  textAlign(CENTER);
  inputName = select("#input_name").value();
}

function start() {
  status = "Status: Detecting Objects";
  select("#model_status").html(status);

  let options = { confidence: 0.5 };
  objectDetector = ml5.objectDetector('cocossd', options, modelLoaded);
}

function modelLoaded() {
  console.log("Model Loaded!");
  status = "Model Loaded!";
  select("#model_status").html(status);
  objectDetector.detect(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
  } else {
    objects = results;

    for (let i = 0; i < objects.length; i++) {
      let object = objects[i];
      let confidence = nf(object.confidence * 100, 2, 2) + "%";
      let label = object.label;
      let x = object.x;
      let y = object.y;
      let w = object.width;
      let h = object.height;

      noFill();
      stroke(255, 0, 0);
      strokeWeight(2);
      rect(x, y, w, h);

      fill(255);
      noStroke();
      text(label + ": " + confidence, x + 5, y + 15);

      if (label === inputName) {
        objectDetected = true;
      }
    }

    if (objectDetected) {
      select("#detection_status").html(inputName + " found");
      let msg = new SpeechSynthesisUtterance(inputName + " found");
      speechSynthesis.speak(msg);
    } else {
      select("#detection_status").html(inputName + " not found");
    }
  }
}

function draw() {
  image(video, 0, 0, width, height);
}


