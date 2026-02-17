let table;
let bins = [];
let binSize = 10;
let maxCount = 0;
let yMax = 0; // to store the rounded-up y axis limit

function preload() {
  table = loadTable('../pokemon.csv', 'csv', 'header');
}

function setup() {
  let cnv = createCanvas(800, 600);
  cnv.parent('chart-container'); 

  let rows = table.getRows();
  
  // initialize bins
  let numBins = 250 / binSize;
  for (let i = 0; i < numBins; i++) {
    bins[i] = 0;
  }

  // process
  for (let i = 0; i < rows.length; i++) {
    let hp = rows[i].getNum('hp');
    let binIndex = floor(hp / binSize);
    
    if (binIndex >= numBins) {
      binIndex = numBins - 1;
    }
    
    bins[binIndex]++;
  }

  // find highest count
  for (let i = 0; i < bins.length; i++) {
    if (bins[i] > maxCount) {
      maxCount = bins[i];
    }
  }
  
  // round maxCount up to the nearest multiple of 20 to find upper end of range
  yMax = ceil(maxCount / 20) * 20;
}

function draw() {
  background(230);

  let leftMargin = 80;
  let rightMargin = 50;
  let topMargin = 50;
  let bottomMargin = 80;

  let graphHeight = height - topMargin - bottomMargin;
  let graphWidth = width - leftMargin - rightMargin;
  let barWidth = graphWidth / bins.length;

  // axis lines
  // x
  stroke(215); // Lighter gray than the horizontal lines
  strokeWeight(1);
  for (let i = 0; i < bins.length; i++) {
    // mark every 5 bins
    if (i % 5 === 0) {
      let x = leftMargin + (i * barWidth);
      line(x, topMargin, x, height - bottomMargin);
    }
  }

  // y lines & labels
  textAlign(RIGHT, CENTER);
  for (let yVal = 0; yVal <= yMax; yVal += 20) {
    let yPos = map(yVal, 0, yMax, height - bottomMargin, topMargin);
    
    // line
    stroke(200);
    line(leftMargin, yPos, width - rightMargin, yPos);
    
    // label
    noStroke();
    fill(0);
    text(yVal, leftMargin - 10, yPos);
  }

  // bars
  for (let i = 0; i < bins.length; i++) {
    let binCount = bins[i];
    
    let barHeight = map(binCount, 0, yMax, 0, graphHeight);
    
    let x = leftMargin + (i * barWidth);
    let y = (height - bottomMargin) - barHeight;
    
    fill(70, 130, 200); 
    stroke(0);         
    strokeWeight(1);
    
    rect(x, y, barWidth, barHeight);

    // x axis labels
    if (i % 5 === 0) {
      noStroke();
      fill(0); 
      textAlign(CENTER, TOP);
      text(i * binSize, x, height - bottomMargin + 10);
    }
  }

  // axes
  stroke(0);
  strokeWeight(2);
  line(leftMargin, topMargin, leftMargin, height - bottomMargin);
  line(leftMargin, height - bottomMargin, width - rightMargin, height - bottomMargin);
  
  // axis titles
  fill(0);
  noStroke();
  textAlign(CENTER);
  textSize(16);
  
  text("HP", leftMargin + graphWidth / 2, height - 45);
  
  push();
  translate(30, topMargin + graphHeight / 2);
  rotate(-HALF_PI);
  text("Count", 20, -20);
  pop();
}