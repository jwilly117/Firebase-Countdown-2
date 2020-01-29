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
