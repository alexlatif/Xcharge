import paho.mqtt.client as mqtt
import time
import grovepi
from grove_rgb_lcd import *
import time,sys
from multiprocessing import Queue
import threading


if sys.platform == 'uwp':
    import winrt_smbus as smbus
    bus = smbus.SMBus(1)
else:
    import smbus
    import RPi.GPIO as GPIO
    rev = GPIO.RPI_REVISION
    if rev == 2 or rev == 3:
        bus = smbus.SMBus(1)
    else:
        bus = smbus.SMBus(0)

# this device has two I2C addresses
DISPLAY_RGB_ADDR = 0x62
DISPLAY_TEXT_ADDR = 0x3e

# Connect the Grove Relay to digital port D4
# SIG,NC, VCC, GND
relay = 4
grovepi.pinMode(relay,"OUTPUT")

state = False

def charging_visual():
    global state

    while state:
        for i in range(16):
	    if state:
	        bus.write_byte_data(DISPLAY_TEXT_ADDR, 0x80, 0x01)
	        bus.write_byte_data(DISPLAY_TEXT_ADDR, 0x80, 0x28)
	        for j in range(i):
 	            bus.write_byte_data(DISPLAY_TEXT_ADDR, 0x40, 0xff)
	        bus.write_byte_data(DISPLAY_TEXT_ADDR, 0x80, 0xc0)
                for j in range(i):
                    bus.write_byte_data(DISPLAY_TEXT_ADDR, 0x40, 0xff)
	        time.sleep(0.3)

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() - if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("Xcharge/switch")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    global state
    print(msg.topic+" "+ str(msg.payload))
    if msg.payload == "True":
        print("Received command for charging")
	# Send HIGH to switch on Relay
	#setText("0xff Charging")
        grovepi.digitalWrite(relay,1)
	setRGB(0, 255, 0)
	state = True
	thread = threading.Thread(target=charging_visual, args=())
	thread.daemon = True
	thread.start()

    else:
        print("Received command to stop charging")
        # Send LOW to switch off Relay
	state = False
	setText("Not Charging")
        grovepi.digitalWrite(relay,0)
	setRGB(0, 0, 0)
	thread = threading.Thread(target=charging_visual, args=())
	thread.daemon = True
	thread.start()

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

