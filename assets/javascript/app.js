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
        con.onDisconnect().remove();
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
    var versusText = "";
    $("#name-submit").on("click", function () {
        event.preventDefault();
        var player = $("#player-name").val();
        $("#player-name").val("");
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
        if (playerNum === 1) {
            firstPlayer.set({
                playerOneChoice: choice
            });
        } else if (playerNum === 2) {
            secondPlayer.set({
                playerTwoChoice: choice
            });
        };
    });

    firstPlayer.on("value", function (snap) {
        if (typeof snap.val().playerName !== "undefined") {
            console.log(snap.val().playerName);
            console.log(versusText);
            if (versusText !== "") {
                versusText = snap.val().playerName + " VS " + versusText;
            }
            else {
                versusText = snap.val().playerName;
            }
        }
        console.log(versusText);
        showPlayers();
    });

    secondPlayer.on("value", function (snap) {
        if (typeof snap.val().playerName !== "undefined") {
            console.log(snap.val().playerName);
            console.log(versusText);
            if (versusText !== "") {
                versusText = versusText + " VS " + snap.val().playerName;
            }
            else {
                versusText = snap.val().playerName;
            }
        }
        console.log(versusText);
        showPlayers();
    });

    function showPlayers() {
        $("#player-names").text(versusText);
    }
});
