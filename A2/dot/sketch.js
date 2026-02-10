let table;
let dailyMax = [];

function preload() {
  table = loadTable('../earthquakes.csv', 'csv', 'header');
}

function setup() {
  let cnv = createCanvas(800, 600);
  cnv.parent('chart-container');

  let rows = table.getRows();
  
  // make temp array to hold values of 0 to find min, 32 days for indices 0-31
  let tempDays = new Array(32).fill(0); 

  for (let i = 0; i < rows.length; i++) {
    let place = rows[i].getString('location.name');
    
    // only check if quake happened in california
    if (place.includes("California") || place.includes("CA")) {
      
      let day = rows[i].getNum('time.day');
      let mag = rows[i].getNum('impact.magnitude');
      
      // if new mag is bigger, use that as new max
      if (mag > tempDays[day]) {
        tempDays[day] = mag;
      }
    }
  }

  // add to final max array, starting at index 1 for day 1
  for (let j = 1; j < tempDays.length; j++) {
    // only add if not zero (failsafe that isn't encountered here)
    if (tempDays[j] > 0) {
      dailyMax.push({ day: j, maxMag: tempDays[j] });
    }
  }

  noLoop();
}

function draw() {
  background(255);
  
  let margin = 60;
  let graphWidth = width - (margin * 2);
  let graphHeight = height - (margin * 2);

  // grid lines
  stroke(220);
  strokeWeight(1);
  for (let i = 0; i <= 6; i++) {
    let y = map(i, 0, 6, height - margin, margin);
    line(margin, y, width - margin, y);
  }
  for (let i = 1; i <= 31; i += 2) { // Every 2 days
    let x = map(i, 1, 31, margin, width - margin);
    line(x, margin, x, height - margin);
  }

  // plot points
  fill(70, 130, 200);
  noStroke();

  for (let i = 0; i < dailyMax.length; i++) {
    let point = dailyMax[i];

    // map day to x position
    let x = map(point.day, 1, 31, margin, width - margin);
    
    // map mag to y position
    let y = map(point.maxMag, 0, 6, height - margin, margin);

    circle(x, y, 10);
  }

  // axes labels
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(12);

  for (let i = 1; i <= 31; i += 2) {
    let x = map(i, 1, 31, margin, width - margin);
    text(i, x, height - margin + 20);
  }

  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= 6; i++) {
    let y = map(i, 0, 6, height - margin, margin);
    text(i, margin - 15, y);
  }
  
  // titles
  textAlign(CENTER);
  text("Day of Month", width/2, height - 15);
  
  push();
  translate(15, height/2);
  rotate(-HALF_PI);
  text("Max Magnitude", 0, 5);
  pop();

  textSize(18);
  text("Highest Magnitude Quakes by Day, California", width / 2, 30);
  textSize(14);

  // annotation
  fill(255, 0, 0);
  circle(628, 540, 15);
  text("The only day without a recorded quake in the period was the 26th!", 520, 520);

  fill()
}