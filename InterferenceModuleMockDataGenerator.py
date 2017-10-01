from firebase import firebase
from random import randint
import time

firebase_connect = firebase.FirebaseApplication("https://dwslgrid.firebaseio.com/") 

packetsSent = 0
packetsRecieved = 0

while True:

	packetsSent += 1
	packetsRecieved += randint(0,1)

	transmitterDict = { 
                "packetsSent" : packetsSent 
                }
        result1 = firebase_connect.put('/radios', 'node1', transmitterDict)
        recieverDict = {
                "packetsRecieved" : packetsRecieved 
                }
        result2 = firebase_connect.put('/radios', 'node2', recieverDict)
        print result1
        print result2
        time.sleep(3)
