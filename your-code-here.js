function tick() {
    let cars = document.getElementsByClassName('car')
    for (let car of cars) {
        if (car.facing) {
        } else {
            car.facing = 'east'
            car.angle = 0
        }
        drive(car, 15)
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
            case 'f':
                increment = increment
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
                        checkIntersection(car, increment, next)
                        break
                    case 'g':
                    case 'undefined':
                        car = slowToStop(car, increment / 2)
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
            car.leadingEdge = car.props.top + car.props.height
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
    let row, column, x, xResult, yResult
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

// If a car is detected in the intersection or two tiles along the road
// on the left, yield (slow to stop and wait until I + 2 tiles is clear)
function checkIntersection(car, increment, iTile) {
    let iOccupied = checkTileForCars(car, iTile)
    if (iOccupied) {
        slowToStop(car, increment / 2)
    } else {
        let rowIncrement, columnIncrement, multiplier
        switch (car.facing) {
            case 'east':
                rowIncrement = -100
                columnIncrement = 0
                break
            case 'south':
                rowIncrement = 0
                columnIncrement = 100
                break
            case 'west':
                rowIncrement = 100
                columnIncrement = 0
                break
            case 'north':
                rowIncrement = 0
                columnIncrement = -100
                break
        }
        multiplier = 2
        let row = iTile.row
        let column = iTile.column
        let leftOne = getTile(row, column, rowIncrement, columnIncrement)
        if (leftOne.type === 't') {
            switch (leftOne.getAttribute('data-square-meta')) {
                case '0':
                    if (car.facing === 'south') {
                        columnIncrement += 100
                    } else {
                        rowIncrement += -100
                    }
                    multiplier = undefined
                    break
                case '90':
                    if (car.facing === 'south') {
                        columnIncrement += -100
                    } else {
                        columnIncrement += 100
                    }
                    multiplier = undefined
                    break
                case '180':
                    if (car.facing === 'north') {
                        rowIncrement += -100
                    } else {
                        columnIncrement += 100
                    }
                    multiplier = undefined
                    break
                case '270':
                    if (car.facing === 'north') {
                        rowIncrement = +100
                    } else {
                        columnIncrement += 100
                    }
                    multiplier = undefined
                    break
            }
        }
        let leftTwo = getTile(
            row,
            column,
            rowIncrement,
            columnIncrement,
            multiplier
        )
        let check1 = checkTileForCars(car, leftOne)
        let check2 = checkTileForCars(car, leftTwo)
        if (check1 || check2) {
            slowToStop(car, increment / 2)
        } else {
            move(car, increment)
        }
    }
}

function checkTileForCars(thiscar, tile) {
    let cars = document.getElementsByClassName('car')
    for (let car of cars) {
        if (car.id != thiscar.id) {
            if (
                car.tilePos[0] >= tile.row &&
                car.tilePos[0] <= tile.row + 100 &&
                car.tilePos[1] >= tile.column &&
                car.tilePos[1] <= tile.column + 100
            ) {
                return true
            }
        }
    }
    return false
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
                    if (car.facing === 'east') {
                        car.turn = {
                            p0: {
                                x: car.props.left,
                                y: car.props.top,
                            },
                            p1: {
                                x: car.leadingEdge + 10,
                                y: currTile.row + 15,
                            },
                            p2: {x: currTile.column + 20, y: currTile.row + 60},
                            p3: {
                                x: currTile.column + 10,
                                y: currTile.row + 100,
                            },
                            time: 0,
                            newFacing: 'south',
                        }
                    } else {
                        // car facing north
                        car.turn = {
                            p0: {x: car.props.left, y: car.props.top},
                            p1: {
                                x: currTile.column + 25,
                                y: car.leadingEdge - 25,
                            },
                            p2: {x: currTile.column, y: currTile.row + 10},
                            p3: {
                                x: currTile.column - 81,
                                y: currTile.row + 10,
                            },
                            time: 0,
                            reverseAngle: true,
                            newFacing: 'west',
                        }
                    }
                }
                break
            case '90':
                // S->W
                if (!car.turn) {
                    if (car.facing === 'south') {
                        car.turn = {
                            p0: {
                                x: car.props.left,
                                y: car.props.top,
                            },
                            p1: {
                                x: currTile.column + 10,
                                y: car.leadingEdge,
                            },
                            p2: {x: currTile.column, y: currTile.row + 20},
                            p3: {
                                // Vertical roads are thinner.
                                x: currTile.column - 81,
                                y: currTile.row + 10,
                            },
                            time: 0,
                            newFacing: 'west',
                        }
                    } else {
                        // car facing east
                        car.turn = {
                            p0: {x: car.props.left, y: car.props.top},
                            p1: {x: currTile.column, y: currTile.row},
                            p2: {x: currTile.column + 15, y: currTile.row - 10},
                            p3: {
                                // Vertical roads are thinner.
                                x: currTile.column + 10,
                                y: currTile.row - 81,
                            },
                            time: 0,
                            reverseAngle: true,
                            newFacing: 'north',
                        }
                    }
                }
                break
            case '180':
                // W->N
                if (!car.turn) {
                    if (car.facing === 'west') {
                        car.turn = {
                            p0: {x: car.props.left, y: car.props.top},
                            p1: {x: car.leadingEdge - 15, y: currTile.row + 10},
                            p2: {x: currTile.column + 10, y: currTile.row + 15},
                            p3: {
                                // Vertical roads are thinner.
                                x: currTile.column + 10,
                                y: currTile.row - 81,
                            },
                            time: 0,
                            newFacing: 'north',
                        }
                    } else {
                        // car facing south
                        car.turn = {
                            p0: {x: car.props.left, y: car.props.top},
                            p1: {x: currTile.column + 10, y: currTile.row + 15},
                            p2: {x: currTile.column + 80, y: currTile.row + 15},
                            p3: {
                                x: currTile.column + 100,
                                y: currTile.row + 10,
                            },
                            time: 0,
                            reverseAngle: true,
                            newFacing: 'east',
                        }
                    }
                }
                break
            case '270':
                // N->E
                if (!car.turn) {
                    if ((car.facing = 'north')) {
                        car.turn = {
                            p0: {x: car.props.left, y: car.props.top},
                            p1: {
                                x: currTile.column + 0,
                                y: car.leadingEdge - 50,
                            },
                            p2: {x: currTile.column + 60, y: currTile.row},
                            p3: {
                                x: currTile.column + 100,
                                y: currTile.row + 10,
                            },
                            time: 0,
                            newFacing: 'east',
                        }
                    } else {
                        // car facing west
                        car.turn = {
                            p0: {x: car.props.left, y: car.props.top},
                            p1: {x: car.leadingEdge - 15, y: currTile.row + 10},
                            p2: {x: currTile.column + 10, y: currTile.row + 15},
                            p3: {
                                x: currTile.column + 10,
                                y: currTile.row + 100,
                            },
                            time: 0,
                            reverseAngle: true,
                            newFacing: 'south',
                        }
                    }
                }
                break
        }
    }

    if (!car.turn.point) {
        car = calculateBezierPath(car)
    }
    car.turn.point = interpolate(car.turn.time, car.bezierPoints)

    if (car.turn.time >= 1) {
        console.log('Finished turn!')
        let widthDiff = car.props.left - car.turn.p3.x
        heightDiff = car.props.y - car.turn.p3.y

        car.style.left = car.turn.p3.x - widthDiff + 'px'
        car.style.top = car.turn.p3.y - heightDiff + 'px'
        if (car.turn.reverseAngle) {
            car.angle -= 90
            car.style.transform = `rotate(${car.angle}deg)`
        } else {
            car.angle += 90
            car.style.transform = `rotate(${car.angle}deg)`
        }
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
    if (car.turn.reverseAngle) {
        car.style.transform = `rotate(${car.angle - 90 * car.turn.time}deg)`
    } else {
        car.style.transform = `rotate(${car.angle + 90 * car.turn.time}deg)`
    }
}

function calculateBezierPath(car) {
    car.bezierPoints = bezier(
        car.turn.p0,
        car.turn.p1,
        car.turn.p2,
        car.turn.p3
    )
    if (globalStates.showBezierPoints) {
        showBezierPoints(car)
    }

    return car
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

function showBezierPoints(car) {
    let p0El = document.getElementById(car.id + 'p0')
    let p1El = document.getElementById(car.id + 'p1')
    let p2El = document.getElementById(car.id + 'p2')
    let p3El = document.getElementById(car.id + 'p3')

    p0El.style.left = car.turn.p0.x + 'px'
    p0El.style.top = car.turn.p0.y + 'px'
    p0El.classList.replace('hidden', 'visible')

    p1El.style.left = car.turn.p1.x + 'px'
    p1El.style.top = car.turn.p1.y + 'px'
    p1El.classList.replace('hidden', 'visible')

    p2El.style.left = car.turn.p2.x + 'px'
    p2El.style.top = car.turn.p2.y + 'px'
    p2El.classList.replace('hidden', 'visible')

    p3El.style.left = car.turn.p3.x + 'px'
    p3El.style.top = car.turn.p3.y + 'px'
    p3El.classList.replace('hidden', 'visible')
}

function slowToStop(car, increment) {
    console.log('Time to stop!')
    let endPoint, endPointDiff
    switch (car.facing) {
        case 'east':
            endPoint = car.tilePos[1] + 99
            break
        case 'west':
            endPoint = car.tilePos[1]
            break
        case 'south':
            endPoint = car.tilePos[0] + 99
            break
        case 'north':
            endPoint = car.tilePos[1]
            break
    }

    endPointDiff = Math.abs(endPoint - car.leadingEdge)
    if (car.leadingEdge != endPoint) {
        increment = endPointDiff / increment
    } else {
        console.log('Reached finish, stopping!')
        return car
    }

    if (increment < 1) {
        increment = 1
    }
    move(car, increment)
    return car
}
