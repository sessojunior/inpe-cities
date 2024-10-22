// Importando o módulo 'fs' para leitura e escrita de arquivos
const fs = require("fs")

// Função para ler e ordenar o arquivo cities.json
fs.readFile("cities.json", "utf8", (err, data) => {
	if (err) {
		console.error("Erro ao ler o arquivo:", err)
		return
	}

	// Parse do conteúdo JSON
	let cities = JSON.parse(data)

	// Ordenando o array de cidades pela propriedade "name"
	cities.sort((a, b) => a.name.localeCompare(b.name))

	// Exibindo as cidades ordenadas
	console.log(cities)

	// Salva o resultado ordenado em um novo arquivo (ou sobrescrevendo o existente)
	fs.writeFile("cities_sorted.json", JSON.stringify(cities, null, 2), (err) => {
		if (err) {
			console.error("Erro ao escrever o arquivo:", err)
		} else {
			console.log("Arquivo cities_sorted.json foi salvo com sucesso!")
		}
	})
})
