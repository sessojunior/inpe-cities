# Obter cidades do JSON

Script para obter uma json de cidades do FTP de meteogramas do INPE.

Para executar, é necessário o Node.js instalado na máquina. Depois, executar:

```bash
npm install axios
node app.js
```

Esse comando irá criar um arquivo JSON conforme o exemplo abaixo:

```json
[
  {
    "id": 1,
    "name": "Mâncio Lima",
    "uf": "AC"
  },
  {
    "id": 2,
    "name": "Atalaia do Norte",
    "uf": "AM"
  },
  (...)
```
