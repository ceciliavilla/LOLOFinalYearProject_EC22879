import pandas as pd

# Leer el CSV original
df = pd.read_csv('diseases.csv')

# Crear diccionario para agrupar síntomas por enfermedad
disease_symptoms_dict = {}

# Recorrer filas del CSV
for index, row in df.iterrows():
    disease_name = row['Disease'].strip()  # Limpiar espacios

    # Obtener todos los síntomas de esa fila (ignorando vacíos)
    symptoms_list = [str(row[col]).strip() for col in df.columns[1:] if pd.notna(row[col])]
    
    # Añadir síntomas al diccionario, asegurando que no haya duplicados
    if disease_name in disease_symptoms_dict:
        disease_symptoms_dict[disease_name].update(symptoms_list)
    else:
        disease_symptoms_dict[disease_name] = set(symptoms_list)  # Usamos set para no repetir síntomas

# Crear nuevo DataFrame limpio
cleaned_data = {
    'Disease': [],
    'Symptoms': []
}

for disease, symptoms in disease_symptoms_dict.items():
    cleaned_data['Disease'].append(disease)
    cleaned_data['Symptoms'].append(', '.join(symptoms))  # Unir los síntomas en una sola cadena separada por comas

# Guardar como nuevo CSV limpio
clean_df = pd.DataFrame(cleaned_data)
clean_df.to_csv('diseases_clean.csv', index=False)

print('✅ CSV limpio creado como "diseases_clean.csv". Revisa la carpeta.')
