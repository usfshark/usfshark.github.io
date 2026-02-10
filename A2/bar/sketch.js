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
  for (let i = 0; i < 11; i++) {
    line(currLine, height - bottomMargin, currLine, topMargin);
    textAlign(CENTER, TOP);
    text(i, currLine, height - bottomMargin);
    currLine += axisIncr;
  }


  fill(70, 130, 180);
  stroke(0);

  for (let i = 0; i < topQuakes.length; i++) {
    let curr = topQuakes[i];

    // MAPPING: Convert magnitude to Width (instead of Height)
    // We map 0-10 magnitude to 0-graphWidth pixels
    let barLength = map(curr.magnitude, 0, 10, 0, graphWidth);

    // Y Position: Moves down as 'i' increases
    let y = topMargin + (i * rowHeight);
    
    // X Position: Always starts at the left margin
    let x = leftMargin; 

    // DRAW BAR
    // format: rect(x, y, width, height)
    // We subtract 15 from rowHeight to create a gap between bars
    rect(x, y, barLength, rowHeight - 15);

    // DRAW LABELS
    fill(0);
    noStroke();
    
    // Calculate the vertical center of the current bar for text alignment
    let centerY = y + (rowHeight - 15) / 2;

    // 1. Location Label (Left of the bar)
    textAlign(RIGHT);
    text(curr.location, x - 10, centerY);

    // 2. Magnitude Label (Right of the bar)
    textAlign(LEFT);
    text(curr.magnitude, x + barLength + 10, centerY);

    // Reset styles for the next bar
    fill(70, 130, 180);
    stroke(0);
  }
  
  // axes
  stroke(0);
  strokeWeight(2);
  line(leftMargin, topMargin, leftMargin, height - bottomMargin);
  line(leftMargin, height - bottomMargin, width - rightMargin, height - bottomMargin);

  // title and axis label
  textAlign(RIGHT, CENTER);
  text("Greatest Magnitude Earthquakes", (width / 2) + (leftMargin - rightMargin), 20);
  strokeWeight(0);
  text("Magnitude", (width / 2)+ (leftMargin - rightMargin), height - 30);
  strokeWeight(2);

}