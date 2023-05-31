import sys
import requests
import pandas as pd
from datetime import datetime, timedelta


def getLevel(station):
    """Get data measured at given station and save as a CSV file"""

    date = datetime.utcnow()

    year = date.strftime("%Y")
    month = date.strftime("%m")
    day = date.strftime("%d")
    date_yesterday = date - timedelta(days=1)
    year_yesterday = date_yesterday.strftime("%Y")
    month_yesterday = date_yesterday.strftime("%m")
    day_yesterday = date_yesterday.strftime("%d")

    # 33767 is station 413
    url = (
        f"http://sibh.daee.sp.gov.br/grafico_nivel_novo.csv?postos[]="
        f"{station}&periodo={day_yesterday}/{month_yesterday}/"
        f"{year_yesterday}%20-%20{day}/{month}/{year}"
        f"&tipo_dados=coleta&formato=1"
    )

    # write CSV to file
    csv_value = requests.Session().get(url).content.decode("utf-8")
    with open("Level.csv", "w",) as file:
        file.write(csv_value + "\n")

    # read file with pandas
    df = pd.read_csv("Level.csv")

    # if the file has not been successfully written, return an error
    if df.empty:
        print("[ERROR] No data available")
        last_level = last_time = csv_value = None
        return last_level, last_time, csv_value

    # otherwise, show last available data as a confirmation that it worked
    last_level = df["valor_leitura_flu"].iloc[-1]
    last_time = df["intervalo"].iloc[-1]
    print("Last available river level:", last_level)
    print("Last available time:       ", last_time)
    print("Success!")


def main():
    """Executed from the terminal"""
    getLevel(sys.argv[1])


if __name__ == "__main__":
    main()
