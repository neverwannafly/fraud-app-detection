from pymongo import MongoClient

def db():
  client = MongoClient('localhost', 27017)
  db_instance = client['fraud-app-detection']
  return db_instance