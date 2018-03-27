import paho.mqtt.publish as publish
import time

publish.single("Xcharge/switch", True, hostname="test.mosquitto.org")
time.sleep(15)
publish.single("Xcharge/switch", False, hostname="test.mosquitto.org")
print("Done")
