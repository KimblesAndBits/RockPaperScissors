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
var chatLog = database.ref("/lastChat");
connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push("true");
        var play;
        con.onDisconnect().remove();
        firstPlayer.onDisconnect().remove();
        secondPlayer.onDisconnect().remove();
        chatLog.onDisconnect().remove();
    }
});

connectionsRef.on("value", function (snap) {
    console.log(snap.numChildren())
    if (!playerNum) {
        if (snap.numChildren() === 1) {
            playerNum = 1;
        } else if (snap.numChildren() === 2) {
            playerNum = 2;
        }
    }
    console.log(playerNum);
});

$(document).ready(function () {
    var p1Name = "", p2Name = "", p1Choice = "", p2Choice = "", winStatus = "";
    var wins = 0, ties = 0, losses = 0;
    $("#name-submit").on("click", function () {
        event.preventDefault();
        nameAssign();
    });

    $('#name-input').keydown(function (event) {
        if (event.keyCode === 10 || event.keyCode === 13) {
            event.preventDefault();
            nameAssign();
        }
    });

    $("#chat-submit").on("click", function () {
        event.preventDefault();
        chatAssign();
    });

    $('#chat-input').keydown(function (event) {
        if (event.keyCode === 10 || event.keyCode === 13) {
            event.preventDefault();
            chatAssign();
        }
    });

    $(".card-img-top").on("click", function () {
        var choice = $(this).attr("alt");
        if (p1Name && p2Name) {
            if (playerNum === 1 && p1Choice === "") {
                firstPlayer.set({
                    playerOneChoice: choice
                });
            } else if (playerNum === 2 && p2Choice === "") {
                secondPlayer.set({
                    playerTwoChoice: choice
                });
            };
        }
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
        displayWins();
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
        displayWins();
    });

    chatLog.on("value", function (snap) {
        if (p1Name && p2Name) {
            if (snap.val().chat) {
                $("#chat-display").prepend(`<p>${snap.val().chat}</p>`)
            }
        }
    });

    function showPlayers() {
        if (p1Name && p2Name) {
            $("#player-names").text(`${p1Name} VS ${p2Name}`);
        };
    };

    function compareChoices() {
        if (p1Choice && p2Choice) {
            if (p1Choice === "paper") {
                if (p2Choice === "rock") {
                    winStatus = `${p1Name} wins with paper!`;
                    if(playerNum === 1) {
                        wins++;
                    } else if (playerNum === 2) {
                        losses++;
                    };
                } else if (p2Choice === "scissors") {
                    winStatus = `${p2Name} wins with scissors!`;
                    if(playerNum === 2) {
                        wins++;
                    } else if (playerNum === 1) {
                        losses++;
                    };
                } else {
                    winStatus = `You both chose paper! It's a tie!`;
                    ties++;
                }
            } else if (p1Choice === "rock") {
                if (p2Choice === "scissors") {
                    winStatus = `${p1Name} wins with scissors!`;
                    if(playerNum === 1) {
                        wins++;
                    } else if (playerNum === 2) {
                        losses++;
                    };
                } else if (p2Choice === "paper") {
                    winStatus = `${p2Name} wins with paper!`;
                    if(playerNum === 2) {
                        wins++;
                    } else if (playerNum === 1) {
                        losses++;
                    };
                } else {
                    winStatus = `You both chose rock! It's a tie!`;
                    ties++;
                }
            } else {
                if (p2Choice === "paper") {
                    winStatus = `${p1Name} wins with scissors!`;
                    if(playerNum === 1) {
                        wins++;
                    } else if (playerNum === 2) {
                        losses++;
                    };
                } else if (p2Choice === "rock") {
                    winStatus = `${p2Name} wins with rock`;
                    if(playerNum === 2) {
                        wins++;
                    } else if (playerNum === 1) {
                        losses++;
                    };
                } else {
                    winStatus = `You both chose scissors! It's a tie!`;
                    ties++;
                }
            }
            alert(winStatus);
            p1Choice = "";
            p2Choice = "";
        };
    };

    function displayWins() {
        $("#wins").text(wins);
        $("#ties").text(ties);
        $("#losses").text(losses);
    };

    function nameAssign() {
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
    };

    function chatAssign() {
        var chatText = $("#chat-input").val();
        $("#chat-input").val("");
        if (playerNum === 1) {
            chatLog.set({
                chat: `${p1Name}: ${chatText}`
            });
        } else if (playerNum === 2) {
            chatLog.set({
                chat: `${p2Name}: ${chatText}`
            });
        };
    };

});
