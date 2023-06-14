import { config } from "./config.js";
import papa from "papaparse";

// Creating variables for text areas that will be used across the script
var downloadArea;
var responseArea;
var logArea;

export const actions = {
  // Function for checking training logs upon launch
  checkLog: async function () {
    // Waiting for 1 second to allow TrainPage elements to load
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);

    /* Assigning values to the variables instantiated at the top of the script.
		The variables will be available to other functions in the script.
		*/
    logArea = document.getElementById("response");
    downloadArea = document.getElementById("download");
    //responseArea = document.getElementById("response");

    // Reading log files
    actions.readLog();
  },

  // Function for reading training logs
  readLog: async function (training = false, noScript = false) {


    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);


    await fetch(`http://${config.api_url}:${config.api_port}/static/logs.txt`)
      .then((response) => response.text())
      .then((response) => (logArea.textContent = response));

    await delay(1000);

    // Behavior while not training. Intended to execute only upon page load or refresh
    // if (training == false) {
    //   // Trying to fetch the TPOT pipeline script
    //   var response = await fetch(
    //     `http://${config.api_url}:${config.api_port}/static/script.py`
    //   );
    //
    //   // Obtaining fetch status code
    //   if (response.status == 404) {
    //     noScript = true;
    //   }
    //
    //   // If the script exists, showing download link and update status message
    //   // if (noScript == false) {
    //   //   downloadArea.hidden = false;
    //   //   responseArea.innerText =
    //   //     "Previously completed training, script available";
    //   //
    //   //   // If the logs are empty, hiding the log area and only show download link
    //   //   if (logArea.innerText != "") {
    //   //     logArea.hidden = false;
    //   //   }
    //   // }
    // }

    // Scrolling to the bottom of the training logs
    logArea.scrollTop = logArea.scrollHeight;
  },

  // Function for training TPOT
  trainTPOT: function () {
    console.log("trained pot")
    // Obtaining the provided CSV dataset and selected training mode
    var file = document.getElementById("data").files[0];
    var fileName = document.getElementById("model_name").value;
    //var mode = document.querySelector('input[name="mode"]:checked').value;
    var mode = actions.toggle_choice;

    // Obtaining the values of provided parameters
    var generations = document.getElementById("generations").value;
    var populationSize = document.getElementById("population_size").value;
    var offspringSize = document.getElementById("offspring_size").value;
    var mutationRate = document.getElementById("mutation_rate").value;
    var crossoverRate = document.getElementById("crossover_rate").value;
    //var scoring = document.getElementById("scoring").value = recall;
    var scoring = "recall";

    var cv = document.getElementById("cv").value;
    var subsample = document.getElementById("subsample").value;
    var nJobs = document.getElementById("n_jobs").value;
    var maxTimeMins = document.getElementById("max_time_mins").value;
    var maxEvalTimeMins = document.getElementById("max_eval_time_mins").value;
    var randomState = document.getElementById("random_state").value;
    var configDict = document.getElementById("config_dict").value;
    var template = document.getElementById("template").value;
    var earlyStop = document.getElementById("early_stop").value;
    var verbosity = document.getElementById("verbosity").value;
    var useDask = document.getElementById("use_dask").checked;
    var warmStart = document.getElementById("warm_start").checked;

    // Obtaining the button object for training
    var trainButton = document.getElementById("train_button");

    // Hiding the script download link and log area and showing the response area
    // downloadArea.hidden = true;
    // responseArea.hidden = false;
    // logArea.hidden = true;

    // Changing the status message in the response area
    //responseArea.innerText = "Training...";

    /* Setting an interval to continuously monitor training logs
		in order to update them on-screen as training progresses
		*/
    var interval = setInterval(actions.readLog, 1000, true);

    // Trying to parse CSV data and train TPOT
    try {
      papa.parse(file, {
        download: false,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // Defining our JSON payload for POST
          var payload = JSON.stringify({
            data: JSON.stringify(results.data),
            mode: mode,
            generations: generations,
            population_size: populationSize,
            offspring_size: offspringSize,
            mutation_rate: mutationRate,
            crossover_rate: crossoverRate,
            scoring: scoring,
            cv: cv,
            subsample: subsample,
            n_jobs: nJobs,
            max_time_mins: maxTimeMins,
            max_eval_time_mins: maxEvalTimeMins,
            random_state: randomState,
            config_dict: configDict,
            template: template,
            early_stop: earlyStop,
            verbosity: verbosity,
            use_dask: useDask,
            warm_start: warmStart,
            model_name: fileName
          });

          // Showing log area if verbosity isn't 0
          if (verbosity != 0) {
            //logArea.hidden = false;
          }

          // Hiding train button
          // trainButton.style.visibility = "hidden";
          // Sending a POST request to our Python API
          var url = "http://127.0.0.1:5000/setup-train-tpot";
          fetch(url
              ,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: payload,
            }
          )
            .then((response) => response.json())
            //.then((data) => (responseArea.innerText = data.Output)) // Showing the success message defined in the Python API
            .then(() => (downloadArea.hidden = false)) // Showing download link for the pipeline script
            .then(() => (trainButton.style.visibility = "visible")) // Making train button visible
            //.then(() => //clearInterval(interval)) // Clearing the interval that repeatedly checked logs
            .catch((error) => {
              console.error("Error", error);
            });
        },
      });
    } catch {
      // Updating response message if papa.parse fails because a CSV dataset was not selected
      // responseArea.innerText = "Dataset not selected. Please select a dataset for tuning.";
    }
  },
  toggle_train_state : {},
  toggle_choice : "Classification",
  toggle_training_mode : function(id, choice) {
    actions.toggle_choice = choice;
    const possible = ["ball_id", "ball_id2"];
    const elem = document.getElementById(id);
    if(typeof(actions.toggle_train_state[id]) === "undefined") {
      actions.toggle_train_state[id] = false;
    }
    if(actions.toggle_train_state[id]) {
      elem.style.marginLeft = "35px";
      elem.style.background = "limegreen";
      const other_id = possible.filter((x) => x !== id)[0]
      const other_elem = document.getElementById(other_id);
      other_elem.style.marginLeft = "0px";
      other_elem.style.background = "red";
    } else {
      elem.style.marginLeft = "0px";
      elem.style.background = "red";
      const other_id = possible.filter((x) => x !== id)[0]
      const other_elem = document.getElementById(other_id);
      other_elem.style.marginLeft = "35px";
      other_elem.style.background = "limegreen";
    }
    elem.style.transition = "all 0.2s ease-in-out";
    actions.toggle_train_state[id] = !actions.toggle_train_state[id];
  }
};
