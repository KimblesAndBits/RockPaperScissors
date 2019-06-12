# RockPaperScissors
Rock Paper Scissors Multiplayer game

Play against one other person in this exciting Rock Paper Scissors game!
Choose a name for yourself, then play!
Pick an option, and see who won! Chat with your opponent!

# Problem:
Create a multiplayer Rock, Paper, Scissors game that does the following:
Only two users can play at the same time.
Both players pick either rock, paper or scissors. After the players make their selection, the game will tell them whether a tie occurred or if one player defeated the other.
The game will track each player's wins and losses.
Throw some chat functionality in there! No online multiplayer game is complete without having to endure endless taunts and insults from your jerk opponent.

# Solution:
Using firebase I assigned the two playes a number when they connect to the website. Each player is asked to type in a name before they can begin. After both names are picked they will be displayed under the title. I used firebase to update the name area after both names were input. Now the playes can chose rock paper or scissors and can chat with each other. After a player clicks on an option, it checks their player number and assigns a variable in firebase. After both players have picked it compares them and displays the winner or if they tied. Then the area with wins losses and ties updates accordingly for each player. The chat function saves the contents of the input area to a firebase variable along with the player's name who pressed the submit button. Then each time the variable updates it prepends the new value to the chat area for both players so that there is a log of their chat.
