// Initialize Firebase
var config = {
  apiKey: "AIzaSyDfTsz2MZYUf1ypexQjVNS_EaryauKUNuo",
  authDomain: "trains-504c1.firebaseapp.com",
  databaseURL: "https://trains-504c1.firebaseio.com",
  projectId: "trains-504c1",
  storageBucket: "trains-504c1.appspot.com",
  messagingSenderId: "802888961935"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

// Initial Variables 
var name = "";
var destination = "";
var time = "";
var frequency = 0;

// Click Button adds info to firebase
$("#submit").on("click", function () {
  // Prevent the page from refreshing
  event.preventDefault();

  // Get inputs
  name = $("#name-input").val().trim();
  destination = $("#destination-input").val().trim();
  time = $("#time-input").val().trim();
  frequency = $("#frequency-input").val().trim();

  var newTrain = {
    name: name,
    destination: destination,
    time: time,
    frequency: frequency
  };

  // Update firebase with new train
  database.ref().push(newTrain);

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");

});

//when a new train is added 
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // assigning the most recent trains info to a var
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  //make sure it assigned correctly
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);

  //claculate the next arrival and minutes away
    //First train time  pushed back 1yr - so it comes before current time
    var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log(trainTimeConverted);

    //getting current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    //difference between two times
    var timeDifference = moment().diff(moment(trainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + timeDifference);

    // time already waited
    var timeWaited = timeDifference % trainFrequency;
    console.log(timeWaited);

    // minutes until train
    var minutesAway = trainFrequency - timeWaited;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    //time of next arriving train
    var nextTrain = moment().add(minutesAway, "minutes");
    nextTrain = moment(nextTrain).format("HH:mm");
    console.log(nextTrain);

  //update HTML
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td>");


});
