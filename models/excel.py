import pandas as pd
import numpy as np
# import matplotlib.pyplot as plt
# import seaborn as sns


class Excel:

    reporte_df = pd.read_csv('/uploads/Reporte2024')
    
    # Se le indica a pandas que no limite el número de columnas mostradas
    pd.set_option('display.max_columns',None)
    # Imprime las primeras 5 filas del DataFrame
    reporte_df.head(5)

