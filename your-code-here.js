function tick() {
    let car = document.querySelector('#car') //get reference to car
    if (car.facing) {
    } else {
        car.facing = 'east'
    }
    drive(car, 10) //Drive the car
}

function drive(car, increment) {
    car.props = getProps(car)
    car.coords = [car.props.left, car.props.top]
    car = initDirection(car)

    car.tilePos = getTilePosition(car)
    let currTile = getTile(car.tilePos[0], car.tilePos[1], 0, 0)

    switch (currTile.type) {
        case 't':
            turn(car, increment)
            break
        case 'i':
            // Check intersection
            break
        case 'f':
            slowToStop(car, increment)
            break
        default:
            let next = getNextTile(car, 1)
            switch (next.type) {
                case 't':
                case 'f':
                    console.log('Slowing down')
                    increment = increment / 2
                    move(car, increment)
                    break
                case 'i':
                    // Check intersection
                    break
                case 'g':
                case 'undefined':
                    slowToStop(car, increment)
                    break
                default:
                    let following = getNextTile(car, 2)
                    switch (following.type) {
                        case 'undefined':
                        // Next tile is g or f.
                        case 't':
                        case 'i':
                        case 'f':
                        case 'g':
                            console.log('Slowing down')
                            increment = increment / 1.25
                            move(car, increment)
                            break
                        default:
                            move(car, increment)
                    }
            }
    }
}

function initDirection(car) {
    switch (car.facing) {
        case 'east':
            car.leadingEdge = car.props.left + car.props.width
            car.rowIncrement = 0
            car.columnIncrement = 100
            break
        case 'south':
            car.leadingEdge = car.props.left + car.props.height
            car.rowIncrement = 100
            car.columnIncrement = 0
            break
        case 'west':
            car.leadingEdge = car.props.left
            car.rowIncrement = 0
            car.columnIncrement = -100
            break
        case 'north':
            car.leadingEdge = car.props.left + car.props.width
            car.rowIncrement = -100
            car.columnIncrement = 0
            break
    }
    return car
}

function getTilePosition(car) {
    let row
    let column
    if (car.props.top >= 100) {
        row = Number(car.props.top.toString()[0])
        for (let i = 0; i < car.props.top.toString().length - 1; i++) {
            row += '0'
        }
    } else {
        row = 0
    }
    if (car.leadingEdge >= 100) {
        column = Number(car.leadingEdge.toString()[0])
        for (let i = 0; i < car.leadingEdge.toString().length - 1; i++) {
            column += '0'
        }
    } else {
        column = 0
    }

    return [Number(row), Number(column)]
}

function getNextTile(car, multiplier) {
    let row = car.tilePos[0]
    let column = car.tilePos[1]
    let rowIncrement = car.rowIncrement * multiplier
    let columnIncrement = car.columnIncrement * multiplier

    let nextTile = getTile(row, column, rowIncrement, columnIncrement)

    return nextTile
}

function getTile(row, column, rowIncrement, columnIncrement) {
    let tileClass = `pos-${row + rowIncrement}-${column + columnIncrement}`
    let tileElement = document.getElementsByClassName(tileClass)
    let tileType = tileElement[0].getAttribute('data-square-type')
    return {tile: tileElement[0], type: tileType}
}

function move(car, increment) {
    car.style.left = car.props.left + increment + 'px' //move car
}

function turn(car, increment) {
    console.log('Time to turn!')
    let newFacing = 'east'
    car.facing = newFacing
}

function slowToStop(car, increment) {
    console.log('Time to stop!')
}
