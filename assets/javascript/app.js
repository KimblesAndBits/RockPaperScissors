var playerNum = 0;

var firebaseConfig = {
    apiKey: "AIzaSyCaB0wV9xC7EblcMQKu6XE6HDiZrgmwBT4",
    authDomain: "rps-multiplayer-kimblesandbits.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-kimblesandbits.firebaseio.com",
    projectId: "rps-multiplayer-kimblesandbits",
    storageBucket: "rps-multiplayer-kimblesandbits.appspot.com",
    messagingSenderId: "520181996708",
    appId: "1:520181996708:web:aa5d8dec63ba2a1d"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var connectedRef = database.ref(".info/connected");
var connectionsRef = database.ref("/connections");
var firstPlayer = database.ref("/playerOne");
var secondPlayer = database.ref("/playerTwo");
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push("true");
        var play;
        con.onDisconnect().remove();
        firstPlayer.onDisconnect().remove();
        secondPlayer.onDisconnect().remove();
    }
});

connectionsRef.on("value", function (snap) {
    console.log(snap.numChildren())
    if (!playerNum) {
        if (snap.numChildren() === 1) {
            playerNum = 1;
        } else {
            playerNum = 2;
        }
    }
    console.log(playerNum);
});

$(document).ready(function () {
    var p1Name = "", p2Name = "", p1Choice = "", p2Choice = "", winStatus = "";
    $("#name-submit").on("click", function () {
        event.preventDefault();
        var player = $("#player-name").val();
        $("#name-input").empty();
        if (playerNum === 1) {
            firstPlayer.set({
                playerName: player
            });
        } else {
            secondPlayer.set({
                playerName: player
            });
        }
    });

    $(".card-img-top").on("click", function () {
        var choice = $(this).attr("alt");
        console.log(choice);
        if (playerNum === 1 && p1Choice === "") {
            firstPlayer.set({
                playerOneChoice: choice
            });
        } else if (playerNum === 2 && p2Choice === "") {
            secondPlayer.set({
                playerTwoChoice: choice
            });
        };
    });

    firstPlayer.on("value", function (snap) {
        if (snap.val().playerName) {
            p1Name = snap.val().playerName;
        };
        if (snap.val().playerOneChoice) {
            p1Choice = snap.val().playerOneChoice;
        };
        showPlayers();
        compareChoices();
    });

    secondPlayer.on("value", function (snap) {
        if (snap.val().playerName) {
            p2Name = snap.val().playerName;
        };
        if (snap.val().playerTwoChoice) {
            p2Choice = snap.val().playerTwoChoice;
        };
        showPlayers();
        compareChoices();
    });

    function showPlayers() {
        if (p1Name && p2Name) {
            $("#player-names").text(`${p1Name} VS ${p2Name}`);
        };
    };
    
    function compareChoices() {
        if(p1Choice && p2Choice) {
            if(p1Choice === "paper"){
                if(p2Choice === "rock"){
                    winStatus = `${p1Name} wins with paper!`;
                }else if (p2Choice === "scissors") {
                    winStatus = `${p2Name} wins with scissors!`;
                }else{
                    winStatus = `You both chose paper! It's a tie!`;
                }
            }else if(p1Choice === "rock") {
                if(p2Choice === "scissors"){
                    winStatus = `${p1Name} wins with scissors!`;
                }else if (p2Choice === "paper") {
                    winStatus = `${p2Name} wins with paper!`;
                }else{
                    winStatus = `You both chose rock! It's a tie!`;
                }
            }else{
                if(p2Choice === "paper"){
                    winStatus = `${p1Name} wins with scissors!`;
                }else if (p2Choice === "rock") {
                    winStatus = `${p2Name} wins with rock`;
                }else {
                    winStatus = `You both chose scissors! It's a tie!`;
                }
            }
            alert(winStatus);
            p1Choice = "";
            p2Choice = "";
        };
    };

});
