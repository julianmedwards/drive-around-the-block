function tick() {
    let car = document.querySelector('#mainCar') //get reference to car
    if (car.facing) {
    } else {
        car.facing = 'east'
    }
    if (car.stopped === undefined) {
        car.stopped = false
    }
    if (car.stopped === false) {
        drive(car, 15) //Drive the car
    } else {
        console.log('Car stopped, not running drive.')
    }
}

function drive(car, increment) {
    car.props = getProps(car)
    car = initDirection(car)

    car.tilePos = getTilePosition(car)
    let currTile = getTile(car.tilePos[0], car.tilePos[1], 0, 0)

    if (car.turn) {
        car = turn(car, increment)
    } else {
        switch (currTile.type) {
            case 't':
                car = turn(car, increment, currTile)
                break
            case 'i':
                // Check intersection
                break
            case 'f':
                increment = increment / 2.5
                car = slowToStop(car, increment)
                break
            default:
                let next = getTile(
                    car.tilePos[0],
                    car.tilePos[1],
                    car.rowIncrement,
                    car.columnIncrement,
                    1
                )
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
                        car = slowToStop(car, increment)
                        break
                    default:
                        let following = getTile(
                            car.tilePos[0],
                            car.tilePos[1],
                            car.rowIncrement,
                            car.columnIncrement,
                            2
                        )
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
}

function initDirection(car) {
    switch (car.facing) {
        case 'east':
            car.leadingEdge = car.props.left + car.props.width
            car.rowIncrement = 0
            car.columnIncrement = 100
            break
        case 'south':
            car.leadingEdge = Math.trunc(car.props.top + car.props.height)
            car.rowIncrement = 100
            car.columnIncrement = 0
            break
        case 'west':
            car.leadingEdge = car.props.left
            car.rowIncrement = 0
            car.columnIncrement = -100
            break
        case 'north':
            car.leadingEdge = car.props.top
            car.rowIncrement = -100
            car.columnIncrement = 0
            break
    }
    return car
}

function getTilePosition(car) {
    let row, column, x, y, xResult, yResult
    if (car.facing === 'west' || car.facing === 'east') {
        x = car.props.top
    } else {
        x = car.props.left
    }
    if (car.leadingEdge >= 100) {
        yResult = Number(car.leadingEdge.toString()[0])
        for (let i = 0; i < car.leadingEdge.toString().length - 1; i++) {
            yResult += '0'
        }
    } else {
        yResult = 0
    }
    if (x >= 100) {
        xResult = Number(x.toString()[0])
        for (let i = 0; i < x.toString().length - 1; i++) {
            xResult += '0'
        }
    } else {
        xResult = 0
    }
    if (car.facing === 'west' || car.facing === 'east') {
        row = xResult
        column = yResult
    } else {
        row = yResult
        column = xResult
    }
    return [Number(row), Number(column)]
}

function getTile(row, column, rowIncrement, columnIncrement, multiplier) {
    if (multiplier) {
        rowIncrement = rowIncrement * multiplier
        columnIncrement = columnIncrement * multiplier
    }

    let tileClass = `pos-${row + rowIncrement}-${column + columnIncrement}`
    let tileElement = document.getElementsByClassName(tileClass)
    let tileType = tileElement[0].getAttribute('data-square-type')
    return {
        tile: tileElement[0],
        type: tileType,
        row: row + rowIncrement,
        column: column + columnIncrement,
    }
}

function move(car, increment) {
    switch (car.facing) {
        case 'east':
            car.style.left = car.props.left + increment + 'px'
            break
        case 'south':
            car.style.top = car.props.top + increment + 'px'
            break
        case 'west':
            car.style.left = car.props.left - increment + 'px'
            break
        case 'north':
            car.style.top = car.props.top - increment + 'px'
            break
    }
}

function turn(car, increment, currTile) {
    console.log('Time to turn!')

    let timeIncrement = 0.04

    if (!car.turn) {
        switch (currTile.tile.getAttribute('data-square-meta')) {
            case '0':
                // E->S
                if (!car.turn) {
                    car.turn = {
                        p0: {x: car.props.left, y: car.props.top},
                        p1: {x: car.leadingEdge, y: currTile.row + 10},
                        p2: {x: currTile.column + 40, y: currTile.row + 60},
                        p3: {
                            // Must account for rotation.
                            x: currTile.column + 10,
                            y: currTile.row + 100,
                        },
                        time: 0,
                        angle: '90',
                        newFacing: 'south',
                    }
                }
                break
            case '90':
                // S->W
                car.facing = 'west'
                break
            case '180':
                // W->N
                car.facing = 'north'
                break
            case '270':
                // N->E
                car.facing = 'east'
                break
        }
    }
    if (!car.turn.points) {
        car = calculateBezierPath(car)
    }
    car.turn.point = interpolate(car.turn.time, car.turn.points)

    if (car.turn.time >= 1) {
        console.log('Finished turn!')
        let adjustedCarVals = car.getBoundingClientRect()
        let widthDiff = adjustedCarVals.x - car.turn.p3.x
        heightDiff = adjustedCarVals.y - car.turn.p3.y

        car.style.left = car.turn.p3.x - widthDiff + 'px'
        car.style.top = car.turn.p3.y - heightDiff + 'px'
        car.style.transform = `rotate(${car.turn.angle}deg)`
        car.facing = car.turn.newFacing
        car.turn = undefined
        return car
    } else {
        car.turn.time += timeIncrement
        car = moveAlongBezier(car)
    }
    return car
}

function moveAlongBezier(car) {
    car.style.left = car.turn.point.x + 'px'
    car.style.top = car.turn.point.y + 'px'
    car.style.transform = `rotate(${90 * car.turn.time}deg)`
}

function calculateBezierPath(car) {
    // Add a button to HUD that toggles this.
    showBezierPoints(car.turn.p0, car.turn.p1, car.turn.p2, car.turn.p3)

    car.turn.points = bezier(car.turn.p0, car.turn.p1, car.turn.p2, car.turn.p3)

    return car
}

function showBezierPoints(p0, p1, p2, p3) {
    let p0El = document.getElementById('p0')
    let p1El = document.getElementById('p1')
    let p2El = document.getElementById('p2')
    let p3El = document.getElementById('p3')

    p0El.style.display = 'initial'
    p0El.style.left = p0.x + 'px'
    p0El.style.top = p0.y + 'px'
    p1El.style.display = 'initial'
    p1El.style.left = p1.x + 'px'
    p1El.style.top = p1.y + 'px'
    p2El.style.display = 'initial'
    p2El.style.left = p2.x + 'px'
    p2El.style.top = p2.y + 'px'
    p3El.style.display = 'initial'
    p3El.style.left = p3.x + 'px'
    p3El.style.top = p3.y + 'px'
}

let Vector = function (x, y) {
    ;(this.x = x || 0), (this.y = y || 0)
}
Vector.prototype.multiply = function (v) {
    return new Vector(this.x * v, this.y * v)
}
Vector.prototype.add = function (vec) {
    return new Vector(this.x + vec.x, this.y + vec.y)
}
Vector.prototype.subtract = function (vec) {
    return new Vector(this.x - vec.x, this.y - vec.y)
}

function bezier(p0, p1, p2, p3) {
    return {
        p0: new Vector(p0.x, p0.y), //Start point
        p1: new Vector(p1.x, p1.y), //Control point 1
        p2: new Vector(p2.x, p2.y), //Control point 2
        p3: new Vector(p3.x, p3.y), //End point
    }
}

function interpolate(t, bezier) {
    /*http://devmag.org.za/2011/04/05/bzier-curves-a-tutorial*/
    var u = 1 - t
    var tt = t * t
    var uu = u * u
    var uuu = uu * u
    var ttt = tt * t

    var p = bezier.p0.multiply(uuu)
    p = p.add(bezier.p1.multiply(3 * uu * t))
    p = p.add(bezier.p2.multiply(3 * u * tt))
    p = p.add(bezier.p3.multiply(ttt))

    return p
}

function slowToStop(car, increment) {
    console.log('Time to stop!')
    let endPoint, endPointDiff, coordinate
    switch (car.facing) {
        case 'east':
            endPoint = car.tilePos[1] + 99
            coordinate = car.style.left
            break
        case 'west':
            endPoint = car.tilePos[1]
            coordinate = car.style.left
            break
        case 'south':
            endPoint = car.tilePos[0] + 99
            coordinate = car.style.top
            break
        case 'north':
            endPoint = car.tilePos[1]
            coordinate = car.style.top
            break
    }

    endPointDiff = Math.abs(endPoint - car.leadingEdge)
    if (car.leadingEdge != endPoint) {
        increment = endPointDiff / increment
    } else {
        coordinate = endPoint
        console.log('Stopped!')
        car.stopped = true
        return car
    }

    if (increment < 1) {
        increment = 1
    }
    move(car, increment)
    return car
}
