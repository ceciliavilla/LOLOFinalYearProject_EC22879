import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# Initialize Firebase
cred = credentials.Certificate('serviceAccountKey.json')  # Your Firebase private key
firebase_admin.initialize_app(cred)

# Firestore connection
db = firestore.client()

# Read CSV
df = pd.read_csv('diseases_clean.csv')

# Upload data to Firestore
for index, row in df.iterrows():
    disease_name = row['Disease'].strip()
    symptoms_list = [sym.strip() for sym in row['Symptoms'].split(',')]  # Clean list of symptoms

    # Create document in Firestore
    doc_ref = db.collection('diseases_database').document()
    doc_ref.set({
        'name': disease_name,
        'symptoms': symptoms_list
    })

    print(f'✅ Uploaded: {disease_name} with symptoms {symptoms_list}')

print('🎉 Data upload completed successfully.')
