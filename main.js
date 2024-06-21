img = "";
status ="";

function preload()
{
    img = loadImage('air.jpg');
}


function setup()
{
    canvas = createCanvas(640, 420);
    canvas.center();

    objectDetector  = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting objects";
}


function modelLoaded()
{
    console.log("Cocossd is loaded");
    status = true;
    objectDetector.detect(img, gotResult);
}

function draw()
{
    image(img, 0,0,640, 420);
    fill('#FF0000');
    text("Aeroplane", 45, 75);

    noFill();

    stroke("#FF0000");

    rect(30, 60, 525, 200);
}





function gotResult(error, results)
{
    if(error) {
        console.log(error);
    }

    console.log(results);
}




let results = [];
let status;
let video;
let model;
let isModelLoaded = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  status = select('#status'); // Assumes you have an element with id 'status' in your HTML

  start();
}

function start() {
  cocoSsd.load().then(loadedModel => {
    model = loadedModel;
    console.log('Model loaded successfully');
    status.html('Status: Model loaded');
    isModelLoaded = true;
  }).catch(err => {
    console.error('Failed to load model:', err);
    status.html('Status: Model failed to load');
  });
}

function draw() {
  image(video, 0, 0, width, height);
  
  if (isModelLoaded) {
    detectObjects();
    updateStatus();
  }
}

function detectObjects() {
  model.detect(video.elt).then(predictions => {
    results = predictions;
  });
}

function updateStatus() {
  let detectedObjectsCount = results.length;
  let totalObjects = ''; // Update with your logic to get total objects in the image
  
  // Update your HTML element with the detected objects count and total objects
  let statusText = `Detected ${detectedObjectsCount} objects out of ${totalObjects}`;
  status.html(statusText);

  // Display detected objects on canvas
  for (let i = 0; i < results.length; i++) {
    let object = results[i];
    let label = object.label;
    let confidence = nf(object.score * 100, 2, 1); // Convert confidence to percentage with two decimal places
    let x = object.x;
    let y = object.y;
    let w = object.width;
    let h = object.height;

    // Draw rectangle around the object
    stroke(0, 255, 0);
    noFill();
    rect(x, y, w, h);

    // Display label and confidence near the object
    fill(255);
    textSize(20);
    text(`${label} ${confidence}%`, x + 5, y + 20);
  }
}
