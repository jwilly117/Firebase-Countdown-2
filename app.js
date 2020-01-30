  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDKn1ffRT-0K5JpwhjtWKwBgyPStv8rihE",
    authDomain: "clickmonitor-d53e1.firebaseapp.com",
    databaseURL: "https://clickmonitor-d53e1.firebaseio.com",
    projectId: "clickmonitor-d53e1",
    storageBucket: "clickmonitor-d53e1.appspot.com",
    messagingSenderId: "879460493695",
    appId: "1:879460493695:web:c52cc0e0a8ef95b1f7924a",
    measurementId: "G-EXLPYXHKR7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// Create a variable to reference to the database
var database = firebase.database();

// ConnectionsRef is a variable that will reference a specific
// location in the database containing all the connections

var  connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase
// it is updated every time the clients connection changes
// '.info/connected is a boolean value, true if the client is connected
var connectedRef = database.ref(".info/connected");

// When the clients connection state changes..
connectedRef.on("value", function(snapshot){

    // if they are connected 
    if(snapshot.val()){

        // Add user to the connections list.
        var con = connectionsRef.push(true);

        // And remove them when they disconnect()
        con.onDisconnect().remove();
    }
});

//When first loaded or when the connections list changes...
connectionsRef.on("value", function(snapshot){

    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list
    $("#numWatchers").text(snapshot.numChildren());
});


// /////////////////////////////////////////////////
// CRITICAL BLOCK for click countdown
// /////////////////////////////////////////////////

// Set the initial Counter
var initialValue = 100;
var clickCounter = initialValue;

// At page load....
database.ref("/clicks").on("value", function(snapshot){
    // Print the local data to the console.
    console.log(snapshot.val());

    // Change the HTML to reflect the local value in firebase
    clickCounter = snapshot.val().clickCount;

    // Log the value of the clickCounter
    console.log(clickCounter);

    // Change the HTML to reflect the local value in firebase
    $("#click-value").text(clickCounter);

    // Make the value of the progress bar change
    $("#progress").css("width", (clickCounter + "%"));


}, function(err){
    console.log("The read failed: " + err.code);
});

///////////////////////////////////////////////////////////////
// Whenever a user clicks a button
////////////////////////////////////
$("#click-button").on("click", function(){

    // Reduce the counter by 1
    clickCounter--;

    // Alert the user and reset the counter
    if (clickCounter === 0){
        alert("You made it to zero");
        clickCounter = initialValue;
    }

    // save new value in firebase
    database.ref("/clicks").set({
        clickCount: clickCounter
    });

    // Log the value of the clickCounter
    console.log(clickCounter);
})

// Now code out what happens if restart is pressed
$("#restart").on("click", function(){

    // set clickcounter back to initial value
    clickCounter = initialValue;

    // database ref
    database.ref("/clicks").set({
        clickCount: clickCounter
    });

    //Log the new local count
    console.log("Count Reset to: " + clickCounter);

    // set the click value text to the value of clickcounter
    $("#click-value").text(clickCounter);

})