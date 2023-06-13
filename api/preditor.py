import joblib
import numpy as np

def preditor(ultimo_valor,data,estacao):
    random_forest = joblib.load(f"random_forest_{estacao}.joblib") #carrega o modelo 413, 143 ou 1000958
    predicoes = random_forest.predict(ultimo_valor)
    print(predicoes)
    return predicoes

if __name__ == '__main__':
    ultimo_nivel = 7000
    ultimo_nivel = np.array(ultimo_nivel).reshape(-1,1) #reshape apenas para ajustar a dimensão
    predicoes = preditor(ultimo_nivel,3)