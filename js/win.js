let winner = document.getElementById('winner');
let winSound = new Audio('../sound/winsound.mp3');

// Display the winner
if (sessionStorage.getItem('computer') == "COMPUTER WON!!!") {
    winSound.play();
    winner.textContent = sessionStorage.getItem('computer');
    console.log('computer won');
} else if(sessionStorage.getItem('player') == "PLAYER WON!!!"){
    winSound.play();
    winner.textContent = sessionStorage.getItem('player');
    console.log('player won!');
}

// Reset the scores when either computer or player won
sessionStorage.setItem('computerScore', 0);
sessionStorage.setItem('playerScore', 0);