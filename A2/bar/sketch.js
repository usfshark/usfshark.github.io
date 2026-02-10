function preload() {
  table = loadTable('../earthquakes.csv', 'csv', 'header');
}

function setup() {
  let cnv = createCanvas(800, 600);
  cnv.parent('chart-container');
  
  let allQuakes = [];
  let rows = table.getRows();
  
  for (let i = 0; i < rows.length; i++) {
    let mag = rows[i].getNum('impact.magnitude');
    let place = rows[i].getString('location.name');
    
    allQuakes.push({ magnitude: mag, location: place });
  }

  // sort data based on magnitude
  allQuakes.sort((a, b) => b.magnitude - a.magnitude);

  // remove all but first 5
  topQuakes = allQuakes.slice(0, 5);
  
  // Optional: Print to console to verify it worked
  console.log(topQuakes);
  
}

function draw() {
  background(230);

  // margins
  let leftMargin = 200;
  let rightMargin = 50;
  let topMargin = 50;
  let bottomMargin = 50;

  // usable graph area
  let graphHeight = height - topMargin - bottomMargin;
  let graphWidth = width - leftMargin - rightMargin;

  // share of height for each bar
  let rowHeight = graphHeight / topQuakes.length;

  let axisIncr = graphWidth / 10;
  let currLine = 200;
  stroke(180);
  fill(0);
  for (let i = 0; i < 11; i++) {
    line(currLine, height - bottomMargin, currLine, topMargin);
    textAlign(CENTER, TOP);
    text(i, currLine, height - bottomMargin);
    currLine += axisIncr;
  }


  fill(70, 130, 200);
  stroke(0);

  for (let i = 0; i < topQuakes.length; i++) {
    let curr = topQuakes[i];

    // map magnitude to bar length, 0 to 10 for full graph area
    let barLength = map(curr.magnitude, 0, 10, 0, graphWidth);

    // x and y offset
    let y = topMargin + (i * rowHeight);
    let x = leftMargin; 

    // each bar, with 15 removed from height for padding
    rect(x, y, barLength, rowHeight - 15);

    // labels 
    fill(0);
    noStroke();
    let centerY = y + (rowHeight - 15) / 2;
    // location
    textAlign(RIGHT);
    text(curr.location, x - 10, centerY);
    // magnitude 
    textAlign(LEFT);
    text(curr.magnitude, x + barLength + 10, centerY);

    // reset styles
    fill(70, 130, 200);
    stroke(0);
  }
  
  // axes
  stroke(0);
  strokeWeight(2);
  line(leftMargin, topMargin, leftMargin, height - bottomMargin);
  line(leftMargin, height - bottomMargin, width - rightMargin, height - bottomMargin);

  // title and axis label
  textAlign(RIGHT, CENTER);
  fill(0);
  noStroke();
  text("Greatest Magnitude Earthquakes", (width / 2) + (leftMargin - rightMargin), 20);
  text("Magnitude", (width / 2)+ (leftMargin - rightMargin), height - 30);

  // annotation
  noStroke();
  text("<- Notice that all\nfive strongest\nrecorded fall\nbelow a mag\nof eight!", 730, 100);

  // final reset of styles
  fill(70, 130, 200);
  strokeWeight(2);
  
}