import mqtt from "mqtt";

export const mqttConnect = () => {
  const host = "broker.emqx.io";
  const clientId = `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`;
  const port = 8084;
  const url = `wss://${host}:${port}/mqtt`;
  const options = {
    keepalive: 30,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: "WillMsg",
      payload: "Connection Closed abnormally..!",
      qos: 0,
      retain: false,
    },
    rejectUnauthorized: false,
  };
  options.clientId = clientId;
  options.username = "";
  options.password = "";
  return mqtt.connect(url, options);
};

export const mqttDisconnect = (client) => {
  if (client) {
    client.end();
  }
};

export const mqttPublish = (client, context) => {
  if (client) {
    const { topic, qos, payload } = context;
    client.publish(topic, payload, { qos }, (error) => {
      if (error) {
        console.log("Publish error: ", error);
      }
    });
  }
};

export const mqttSub = async (client, subscription) => {
  if (client) {
    const { topic, qos } = subscription;
    client.subscribe(topic, { qos }, (error) => {
      if (error) {
        console.log("Subscribe to topics error", error);
        return;
      } else {
        console.log("Subscribe success");
      }
    });
  }
};

export const mqttUnSub = (client, subscription) => {
  if (client) {
    const { topic } = subscription;
    client.unsubscribe(topic, (error) => {
      if (error) {
        console.log("Unsubscribe error", error);
        return;
      }
    });
  }
};
