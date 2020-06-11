const generateId = (array) => {
    let maxId = array.length > 0
        ? Math.max(...array.map(item => item.id))
        : 0

    return maxId + 1
}

module.exports = generateId