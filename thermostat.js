module.exports = function(RED) {
    function ThermostatNode(config) {

        RED.nodes.createNode(this,config);
        var node = this;
        var nodeContext = this.context();

        node.highLimit = config.highLimit;
        node.lowLimit = config.lowLimit;

        statusMsg = "Range: " + node.lowLimit + "-" + node.highLimit + ", temp: -, heater -"
        node.status({text:statusMsg});

        nodeContext.set('heaterOn', null)

        node.on('input', function(msg, send, done) {

            /* Get variables */
            heaterOn    = nodeContext.get('heaterOn')
            currentTemp = parseFloat(msg.payload)

            /* Set heater state */
            oldHeaterOn = heaterOn
            if (currentTemp > node.highLimit)
            {
                heaterOn = false
            }
            else if (currentTemp < node.lowLimit)
            {
                heaterOn = true
            }
            else if (heaterOn == null)
            {
                heaterOn = false
            }

            nodeContext.set('heaterOn', heaterOn)
            stateChanged = oldHeaterOn != heaterOn

            /* Generate output */
            statusMsg = "Range: " + node.lowLimit + "-" + node.highLimit +
                        ", temp: " + currentTemp +
                        ", heater " + (heaterOn ? "on" : "off")

            msg.payload = heaterOn
            node.status({text:statusMsg});

            /* Send message */
            if (stateChanged)
            {
                send = [msg, msg]
                node.send([msg, msg]);
            }
            else
            {
                send = msg
                node.send(msg);
            }

            if (done) {
                done();
            }

        });
    }

    RED.nodes.registerType("thermostat",ThermostatNode);
}
