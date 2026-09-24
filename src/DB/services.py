# <class 'pandas.DataFrame'>
# Index: 2013303 entries, 249969 to 763804
# Data columns (total 13 columns):
#  #   Column                   Dtype  
# ---  ------                   -----  
#  0   step                     int64  
#  1   amount                   float64
#  2   oldbalanceOrg            float64
#  3   newbalanceOrig           float64
#  4   oldbalanceDest           float64
#  5   newbalanceDest           float64
#  6   hour                     int64  
#  7   is_night                 int64  
#  8   sender_balance_change    float64
#  9   receiver_balance_change  float64
#  10  orig_balance_zero        Int64  
#  11  dest_balance_zero        int64  
#  12  type_TRANSFER            int64  
# dtypes: Int64(1), float64(7), int64(5)
# memory usage: 217.0 MB



from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo import ReturnDocument
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e) 

db = client["UPI_db"]

class Transaction:
    def __init__(self,db):
        self.recipients_col = db["recipients"]
        self.sender_col = db["senders"]
        self.transactions_col = db["transactions"]
    def process_transaction(self,sender):
        sender_phone = sender["senderPhone"]
        receiver_phone = sender["receiverPhone"]
        amount = sender["amount"]
        time = sender["updatedAt"]#TODO get the step
        step = self.step_finder(time)

        sender_old_balance = sender["preBalance"]
        sender_new_balance = sender_old_balance - amount
        sender_balance_change= sender_old_balance - sender_new_balance 

        counter = db.counters.find_one_and_update(
            {"_id":"transaction_id"},
            {"$inc":{"seq":1}},
            upsert=True,
            return_document=ReturnDocument.AFTER
        )

        transaction_id = f"TXN{counter["seq"]:06d}"


        receiver = self.recipients_col.find_one(
            {"recipient_ph":receiver_phone}
        )

        if receiver is None:
            pass #TODO show that user is not present



        receiver_old_balance = receiver["old_balance"]

        receiver_new_balance = receiver_old_balance + amount
        receiver_balance_change = receiver_new_balance - receiver_old_balance

        payment_type = sender["tranction"].upper()

        counter = db.counters.find_one_and_update(
            {"_id":"transaction_id"},
            {"$inc":{"seq":1}},
            upsert=True,
            return_document=ReturnDocument.AFTER
        )

        transaction_id = f"TXN{counter["seq"]:06d}"

        transaction = {
            "transaction_id": transaction_id,
            "step": step,
            "amount":amount,
            "oldbalanceOrg":sender_old_balance,
            "newbalanceOrig":sender_new_balance,
            "oldbalanceDest":receiver_old_balance,
            "newbalanceDest":receiver_new_balance,
            "sender_balance_change":sender_balance_change,
            "receiver_balance_change":receiver_balance_change,
            "payment_type":payment_type

       }
        result = self.transactions_col.insert_one(transaction)

        transaction_id = result.inserted_id
        print(f"{transaction_id} inserted successfully")
        return transaction_id

    def listner(self):
        with self.sender_col.watch(
        [{"$match":{"operationType":"insert"}}]
    ) as stream :
            for change in stream:
                self.sender = change["fullDocument"]
                self.process_transaction(self.sender)
    def step_finder(self,time):
        hour = time.hour + (time.minute / 60.0) + (time.second / 3600.0)
        step = hour * 24
        return int(step)

    def last_transaction_df(self):
        transaction_id = self.listner()
        latest_transaction = self.transactions_col.find_one(
            {"_id":transaction_id}
        )

        df = pd.DataFrame([latest_transaction])
        return df


    

