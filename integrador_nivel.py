import requests
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta


def getJson(url):
    s = requests.Session()
    s.get(url)
    json_value = s.get(url).content.decode("utf-8")
    return json_value

def getDate():
    date = datetime.now() # current date and time
    return date

def getNivel(date):
    year = date.strftime("%Y")
    month = date.strftime("%m")
    day = date.strftime("%d")
    time = date.strftime("%H:%M:%S")
    date_time = date.strftime("%m/%d/%Y, %H:%M:%S")	
    
    #Posto 33767 é a estação 413
    url = f"http://sibh.daee.sp.gov.br/grafico_nivel_novo.csv?postos[]=33767&periodo={day}/{month}/{year}%20-%20{day}/{month}/{year}&tipo_dados=coleta&formato=1"
    json_value = getJson(url)
    with open(r"/Users/fernandosaraiva/Desktop/Mestrado/Engenharia_de_Software/Nivel.csv","w") as file:
        file.write(json_value + "\n")
    return json_value

if __name__ == '__main__':
    date = getDate()    
    nivel = getNivel(date)
    print('Concluído')
