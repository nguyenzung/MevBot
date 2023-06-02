function padData(input) {
    return input.padStart(64, '0')
}

function getTimestampInSeconds () {
    return Math.floor(Date.now() / 1000)
  }

module.exports = { padData, getTimestampInSeconds };