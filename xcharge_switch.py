import paho.mqtt.client as mqtt
import time
import grovepi


# Connect the Grove Relay to digital port D4
# SIG,NC, VCC, GND
relay = 4
grovepi.pinMode(relay,"OUTPUT")


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() - if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("Xcharge/switch")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+ str(msg.payload))
    if msg.payload == "True":
        print("Received command for charging")
	# Send HIGH to switch on Relay
        grovepi.digitalWrite(relay,1)

    else:
        print("Received command to stop charging")
        # Send LOW to switch off Relay
        grovepi.digitalWrite(relay,0)

# Create an MQTT client and attach our routines to it.
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("test.mosquitto.org", 1883, 60)

# Process network traffic and dispatch callbacks. This will also handle
# reconnecting. Check the documentation at
# https://github.com/eclipse/paho.mqtt.python
# for information on how to use other loop*() functions
client.loop_forever()

