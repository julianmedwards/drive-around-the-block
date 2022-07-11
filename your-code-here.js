function tick() {
    let car = document.querySelector('#car'); //get reference to car
    moveLeft(car, 10); //move the car left
}

function moveLeft(element, increment) {
    let props = getProps(element); //get the positional information you need to move an element
    console.dir(props); //check the console for what props has in it!
    element.style.left = (props.left + increment) + 'px'; //move element
}