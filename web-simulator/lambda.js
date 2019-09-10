/*

  This functions calculates the application rate in mm of a mobile irrigation system,
  based on two factors:
   * the the time it takes for the system to cover the whole field
   * the current flow of the pump. 

  Thus, this function receives 2 inputs:
    * the pump flow in m3 with topic "pumpFlow"
    * the time it takes to cover the field in hours with topic "time". this time could
      also be speed data of the machine, but for the sake of simplicity, we just put time

  There is a third parameter needed which is the surface of the field, but this is fixed,
  so we put it as a constant at the beginning of the code

  Formula:

  pumpFlow in m3
  time in hours
  surface in hectares
  appilcationRate in mm

  applicationRate = ( ( pumpFlow / 10 ) * time ) / surface


 */

// variable needed for calculations
const surface = 50 // hectares

let currentValues = {}

function lambda(irta, packet) {

  let payload = packet.payload.toString()

  switch (packet.topic) {

    case 'time':
      
      if (currentValues.pumpFlow) {
        let time = parseFloat(packet.payload)
        let appRate = getAppRate(currentValues.pumpFlow, time)
        delete currentValues.pumpFlow
        irta.publishNewTopic('applicationRate', appRate)
      } else
        currentValues.time = parseFloat(packet.payload)

      break

    case 'pumpFlow':
      
      if (currentValues.time) {
        let pumpFlow = parseFloat(packet.payload)
        let appRate = getAppRate(pumpFlow, currentValues.time)
        delete currentValues.time
        irta.publishNewTopic('applicationRate', appRate)
      } else
        currentValues.pumpFlow = parseFloat(packet.payload)

      break

    default:
      return true
      break

  }

  return false

}

function getAppRate(pumpFlow, time) {
  return (((pumpFlow / 10) * time) / surface).toFixed(2)
}

module.exports = lambda
