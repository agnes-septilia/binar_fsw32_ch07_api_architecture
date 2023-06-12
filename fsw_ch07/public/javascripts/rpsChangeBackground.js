
// Function to change weapon's background when clicked

function changeBackground (element, value) {
    element.style.backgroundColor = value.backgroundColor
    element.style.borderRadius = value.borderRadius
}

const playerWeapons = document.querySelectorAll('.player-weapons');

let buttonClicked = false;

playerWeapons.forEach((weapon) => {
    weapon.addEventListener('click', function onClick() {

        // disregard changes upon any click after the game 
        if (buttonClicked) {
            document.getElementById('loading-image').style.animation = "rotation";
            return;
        }

        // player chooses the weapon
        changeBackground(weapon, {backgroundColor: "#C4C4C4", borderRadius: "20%"})
        
        buttonClicked = true
    })
})