import paho.mqtt.client as mqtt
import time
import grovepi
from grove_rgb_lcd import *
import threading
import math
import unicornhat as unicorn

# Connect the Grove Relay to digital port D4
# SIG,NC, VCC, GND
relay = 4
grovepi.pinMode(relay,"OUTPUT")

unicorn.set_layout(unicorn.AUTO)
unicorn.rotation(0)
unicorn.brightness(0.5)
width,height=unicorn.get_shape()
state = False

def pihat():
    global state
    while state:
        for color in range(8):
            for i in range(color+1):
                for h in range(4):
                    if abs(i-7) == 7:
                        unicorn.set_pixel(abs(i-7), h, 255, 0, 0)
                    elif abs(i-7) == 6:
                        unicorn.set_pixel(abs(i-7), h, 255, 99, 71)
                    elif abs(i-7) == 5:
                        unicorn.set_pixel(abs(i-7), h, 255, 140, 0)
                    elif abs(i-7) == 4:
                        unicorn.set_pixel(abs(i-7), h, 255, 215, 0)
                    elif abs(i-7) == 3:
                        unicorn.set_pixel(abs(i-7), h, 255, 255, 0)
                    elif abs(i-7) == 2:
                        unicorn.set_pixel(abs(i-7), h, 154, 205, 0)
                    elif abs(i-7) == 1:
                        unicorn.set_pixel(abs(i-7), h, 124, 252, 0)
                    elif abs(i-7) == 0:
                        unicorn.set_pixel(abs(i-7), h, 0, 255, 0)
            unicorn.show()
            if not state:
                break
            time.sleep(0.5)
        unicorn.off()

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() - if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("Xcharge/switchA")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    global state
    print(msg.topic+" "+ str(msg.payload))
    if msg.payload == "True":
        print("Received command for charging")
	# Send HIGH to switch on Relay
	state = True
        grovepi.digitalWrite(relay, 1)
        thread = threading.Thread(target=pihat, args=())
        thread.daemon = True
        thread.start()
	#unicorn.set_all(0, 128, 0)
	#unicorn.show()
    else:
        print("Received command to stop charging")
        # Send LOW to switch off Relay
	state = False
        grovepi.digitalWrite(relay,0)
        #thread = threading.Thread(target=pihat, args=())
        #thread.daemon = True
        #thread.start()
	unicorn.off()
	unicorn.clear()

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

if __name__ == "__main__":
    pihat()
