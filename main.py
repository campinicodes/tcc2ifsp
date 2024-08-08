# https://consultasiszon.prefeitura.sp.gov.br/FormsRestrict/frmConsultaSQCL.aspx?SQCL=052185000033

from bs4 import BeautifulSoup as bs
import requests

url = "https://consultasiszon.prefeitura.sp.gov.br/FormsRestrict/frmConsultaSQCL.aspx?SQCL=039146000052"

response = requests.get(url)
soup = bs(response.text, 'html.parser')

tabela = soup.find('table', class_='zoneamento')

print(tabela)