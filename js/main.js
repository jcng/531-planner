'use strict';

/**
 * Module for managing state of 5/3/1 Planner
 *  Returns:
 *    fillTable() - method for writing workout into cells
 *    showTable() - method for revealing the table
 * @param {String} rawBench     One rep max for bench, without 90% modifier
 * @param {String} rawSquat     One rep max for squat, without 90% modifier
 * @param {String} rawShoulder  One rep max for shoulder press, without 90% modifier
 * @param {String} rawDeadlift  One rep max for deadlift, without 90% modifier
 */
function createPlanner(rawBench, rawSquat, rawShoulder, rawDeadlift, selectedVariant) {
  const WORKING_MULT = 1; // can set this to 0.9 if calculating initial lifts | TODO: Create button for first time program?
  const wBench = rawBench * WORKING_MULT;
  const wSquat = rawSquat * WORKING_MULT;
  const wShoulder = rawShoulder * WORKING_MULT;
  const wDeadlift = rawDeadlift * WORKING_MULT;

  // Variant Accessories
  const boringButBig = {
    name: "Boring But Big",
    bench: ['5x10 Bench', '5x10 Lat/Bicep/Trap'],
    squat: ['5x10 Squat', 'Core'],
    shoulder: ['5x10 Shoulder Press', '5x10 Lat/Bicep/Trap'],
    deadlift: ['5x10 Deadlift', 'Core']
  }
  let variant;
  switch(selectedVariant) {
    case 'boringButBig':
      variant = boringButBig;
      break;
    default:
      throw new Error('Unknown variant')
  }

  function weights (exercise, percent) {
    percent *= 0.01;
    switch(exercise) {
      case 'bench':
        return Math.round(wBench * percent);
        break;
      case 'squat':
        return Math.round(wSquat * percent);
        break;
      case 'shoulder':
        return Math.round(wShoulder * percent);
        break;
      case 'deadlift':
        return Math.round(wDeadlift * percent);
        break;
    }
  }

  /**
   * Fills out a single day on the planner grid
   * @param {String}   exercise ID for exercise ('bench', 'squat', 'shoulders', 'deadlift')
   * @param {Integer}  week     The week (cycle) to generate the day for
   * @param {Object}   accs     Object containing arrays of accessories by main lift
   */
  function fillTableDay(exercise, week, accs) {
    let id = exercise + week;
    // Warmups
    let dayString =
`5r @ ${weights(exercise, 30)}
5r @ ${weights(exercise, 40)}
5r @ ${weights(exercise, 50)}
`;

    // Set working sets based on week
    switch(week) {
      case 1:
        dayString +=
`
Working Sets
5r @ ${weights(exercise, 65)}
5r @ ${weights(exercise, 75)}
5r + ARAP @ ${weights(exercise, 85)}
`;
        break;
      case 2:
        dayString +=
`
Working Sets
3r @ ${weights(exercise, 70)}
3r @ ${weights(exercise, 80)}
3r + ARAP @ ${weights(exercise, 90)}
`;
        break;
      case 3:
        dayString +=
`
Working Sets
5r @ ${weights(exercise, 75)}
3r @ ${weights(exercise, 85)}
1r + ARAP @ ${weights(exercise, 95)}
`;
      break;
    case 4:
      // overridde warmups since it's deload week
      dayString =
`
Warm-Up

Working Sets
5r @ ${weights(exercise, 40)}
5r @ ${weights(exercise, 50)}
5r @ ${weights(exercise, 60)}
`;
      break;
    } // End switch(week)

    // Set accessories
    dayString +=
`
Accessories
${accs[exercise][0]}
${accs[exercise][1]}
`;

    document.getElementById(id).innerHTML = dayString;
  }

  /**
   * (Public) Calls fillTableDay for every day in the month
   */
  function fillTable() {
    for (let i = 0; i < 4; i++) {
      fillTableDay('bench', i+1, variant);
      fillTableDay('squat', i+1, variant);
      fillTableDay('shoulder', i+1, variant);
      fillTableDay('deadlift', i+1, variant);
    }
  }

  /**
   * Displays table
   */
  function showTable() {
    document.getElementById('weight-table').style.opacity = 1;
    document.getElementById('main-header').innerHTML = "5/3/1 Planner - " + variant.name;
  }

  return {
    fillTable,
    showTable
  }
}

/**
 * Actions triggered on form submission
 */
function submitFormHandler() {
  const form = document.getElementById('main-lifts-form');
  const formElements = form.elements;

  window.onsubmit = (event) => {
    event.preventDefault();

    var planner = createPlanner(formElements['bench-1rm'].value, 
                          formElements['squat-1rm'].value,
                          formElements['shoulder-1rm'].value,
                          formElements['deadlift-1rm'].value,
                          formElements['variant-select'].value);

    planner.fillTable();
    planner.showTable();
  }
}

window.onload = function() {
  submitFormHandler();
}