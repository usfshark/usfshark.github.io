let table;
let heights = [];
let min, q1, median, q3, max;

function preload() {
  table = loadTable('../pokemon.csv', 'csv', 'header');
}

function setup() {
  let cnv = createCanvas(800, 400); // Shorter height since it's just one box
  cnv.parent('chart-container'); 

  // load heights into array
  let rows = table.getRows();
  for (let i = 0; i < rows.length; i++) {
    heights.push(rows[i].getNum('height'));
  }

  // sort heights array
  heights.sort((a, b) => a - b);

  // get necessary benchmark values
  minVal = heights[0];
  maxVal = heights[heights.length - 1];
  
  let q1Index = floor(heights.length * 0.25);
  let medianIndex = floor(heights.length * 0.5);
  let q3Index = floor(heights.length * 0.75);

  q1 = heights[q1Index];
  medianVal = heights[medianIndex];
  q3 = heights[q3Index];
}

function draw() {
  background(230);

  let leftMargin = 50;
  let rightMargin = 50;
  let topMargin = 80;
  let bottomMargin = 80;

  let graphWidth = width - leftMargin - rightMargin;

  // axis labels and lines
  strokeWeight(1);
  textAlign(CENTER, TOP);
  textSize(12);


  let tickCount = 15;
  // round up max for x axis range
  let axisMax = ceil(maxVal); 

  for (let i = 0; i <= tickCount; i++) {
    let val = (axisMax / tickCount) * i;
    let x = map(val, 0, axisMax, leftMargin, width - rightMargin);
    
    // grid line
    stroke(215);
    line(x, topMargin, x, height - bottomMargin);
    
    // slightly darker on bottom
    stroke(0);
    line(x, height - bottomMargin, x, height - bottomMargin + 5);
    
    // label
    noStroke();
    fill(0);
    text(val.toFixed(1), x, height - bottomMargin + 10);
  }

  // box setup
  let boxY = topMargin + (height - topMargin - bottomMargin) / 2;
  let boxHeight = 100;
  
  // give bechmark numbers x coordinates
  let xMin = map(minVal, 0, axisMax, leftMargin, width - rightMargin);
  let xQ1 = map(q1, 0, axisMax, leftMargin, width - rightMargin);
  let xMedian = map(medianVal, 0, axisMax, leftMargin, width - rightMargin);
  let xQ3 = map(q3, 0, axisMax, leftMargin, width - rightMargin);
  let xMax = map(maxVal, 0, axisMax, leftMargin, width - rightMargin);

  stroke(0);
  strokeWeight(2);

  // whiskers
  line(xMin, boxY, xQ1, boxY);
  line(xQ3, boxY, xMax, boxY);

  line(xMin, boxY - 10, xMin, boxY + 10);
  line(xMax, boxY - 10, xMax, boxY + 10);

  // main box
  fill(70, 130, 200);
  rectMode(CORNERS); 
  rect(xQ1, boxY - boxHeight/2, xQ3, boxY + boxHeight/2);

  // median
  stroke(0);
  line(xMedian, boxY - boxHeight/2, xMedian, boxY + boxHeight/2);

  // x axis title
  noStroke();
  fill(0);
  textSize(16);
  text("Height (m)", width / 2, height - 30);
}