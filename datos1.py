import pandas as pd
import os

# Carga el archivo Excel
archivo_excel = 'datos.xlsx'  # Asegúrate de que esté en el mismo directorio

if not os.path.exists(archivo_excel):
    print(f"❌ Error: El archivo '{archivo_excel}' no existe.")
    exit()

try:
    df = pd.read_excel(archivo_excel)
except Exception as e:
    print(f"❌ Error al leer el archivo Excel: {e}")
    exit()

# Reemplazar NaN por None
df = df.where(pd.notnull(df), None)

# Validar que las columnas necesarias existan
columnas_esperadas = ['actividad', 'responsable', 'semana', 'stopper', 'duracion', 'dias_al_evento', 'indicador']
if not all(col in df.columns for col in columnas_esperadas):
    print(f"❌ Error: El archivo Excel debe contener las columnas: {', '.join(columnas_esperadas)}")
    exit()

# Preparar las líneas VALUES
lineas = []
for _, row in df.iterrows():
    valores = []
    for valor in row:
        if isinstance(valor, str):
            valor = valor.replace("'", "''")  # Escapar comillas simples
            valores.append(f"'{valor}'")
        elif valor is None:
            valores.append('NULL')
        else:
            valores.append(str(valor))
    lineas.append(f"({', '.join(valores)})")

# Unir todo el script SQL
sql = f"""
-- Eliminar registros existentes
DELETE FROM actividades;

-- Insertar nuevos registros
INSERT INTO actividades (
    actividad,
    responsable,
    semana,
    stopper,
    duracion,
    dias_al_evento,
    indicador
)
VALUES
{',\n'.join(lineas)};
"""

# Guardar a un archivo
output_file = "insert_actividades.sql"
try:
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(sql)
    print(f"✅ Script SQL generado: {output_file}")
except Exception as e:
    print(f"❌ Error al guardar el archivo SQL: {e}")
