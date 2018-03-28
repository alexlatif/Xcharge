import paho.mqtt.publish as publish
import time
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("-s", "--state",
                    type=str,
                    help="True to start charging and False to stop charging")
args = parser.parse_args()

publish.single("Xcharge/switch", args.state, hostname="test.mosquitto.org")
print(args.state, type(args.state))
print("Done")
