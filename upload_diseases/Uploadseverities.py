import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# Initiate Firebase
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Conecction to Firestore
db = firestore.client()

# Read CSV file
df = pd.read_csv('SeveritySymptoms.csv')

# Upload 'classified_symptoms' colection
for index, row in df.iterrows():
    symptom = str(row['symptom']).strip().lower()
    severity = str(row['severity']).strip().lower()

    # Symptom name as ID of the document
    doc_ref = db.collection('severity_symptoms').document(symptom)
    doc_ref.set({
        'severity': severity
    })

    print(f'Uploaded: {symptom} → {severity}')
