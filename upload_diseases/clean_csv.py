import pandas as pd

# Read original CSV 
df = pd.read_csv('diseases.csv')

# Create a dictionary to group symptoms and diseases
disease_symptoms_dict = {}


for index, row in df.iterrows():
    disease_name = row['Disease'].strip()  # Remove spaces

   # Obtaining all symptoms from that row (ignoring empty values)
    symptoms_list = [str(row[col]).strip() for col in df.columns[1:] if pd.notna(row[col])]
    
    # Add symptoms to the dictionary, ensuring no duplicates
    if disease_name in disease_symptoms_dict:
        disease_symptoms_dict[disease_name].update(symptoms_list)
    else:
        disease_symptoms_dict[disease_name] = set(symptoms_list)  

# Create a new cleaned DataFrame
cleaned_data = {
    'Disease': [],
    'Symptoms': []
}

for disease, symptoms in disease_symptoms_dict.items():
    cleaned_data['Disease'].append(disease)
    cleaned_data['Symptoms'].append(', '.join(symptoms))   # Join symptoms into a single comma-separated string


#  Save as a new cleaned CSV
clean_df = pd.DataFrame(cleaned_data)
clean_df.to_csv('diseases_clean.csv', index=False)


