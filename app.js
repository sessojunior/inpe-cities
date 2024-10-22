const axios = require("axios")
const fs = require("fs")

const baseUrl = "https://ftp.cptec.inpe.br/modelos/produtos/BRAMS/ams_15km/grh/json2/2024/10/21/00/"
const maxCityId = 5564 // Número total de cidades do Brasil
const delay = 100 // Intervalo de milissegundos entre as requisições

let totalErrors = 0 // Contador total de erros corrigidos
let correctedErrors = 0 // Contador de erros corrigidos

// Função para criar um atraso
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchCityData(id) {
	let attempts = 0
	let hasError = false

	while (attempts < 10) {
		// Tenta até 10 vezes
		try {
			const url = `${baseUrl}${id}.json`
			const response = await axios.get(url)

			// Verifica se existe a chave 'datasets' e se contém ao menos um elemento
			if (response.data && response.data.datasets && response.data.datasets.length > 0) {
				const area = response.data.datasets[0].area // Acessa o campo 'area' do primeiro dataset

				console.log(`Buscando dados para o id: ${id} - ${area}`)

				if (area) {
					const [name, uf] = area.split("/")

					// Se houve erro anteriormente, marcamos como corrigido
					if (hasError) {
						correctedErrors++
						console.log(`Erro corrigido para o id: ${id}`)
					}

					return {
						id,
						name: name.trim(),
						uf: uf.trim(),
					}
				} else {
					console.error(`Campo 'area' ausente para o id: ${id}`)
					hasError = true // Marca que ocorreu erro
				}
			} else {
				console.error(`Estrutura de dados inválida para o id: ${id}`)
				hasError = true
			}
		} catch (error) {
			console.error(`Erro ao buscar dados para o id: ${id}`, error.message)
			hasError = true
		}

		attempts++
		await sleep(delay) // Aguarda antes de tentar novamente
	}

	// Se chegou aqui, atingiu o número máximo de tentativas
	if (hasError) {
		totalErrors++
		console.error(`Falha ao corrigir erro para o id: ${id} após 10 tentativas.`)
	}
	return null
}

async function fetchAllCities() {
	const cities = []

	for (let id = 1; id <= maxCityId; id++) {
		const cityData = await fetchCityData(id)
		if (cityData) {
			cities.push(cityData)
		}

		// Aguarda 100ms antes de buscar a próxima cidade
		await sleep(delay)
	}

	// Salva o resultado em um arquivo JSON
	fs.writeFileSync("cities.json", JSON.stringify(cities, null, 2))
	console.log(`Processo finalizado. Total de cidades salvas: ${cities.length}`)
	console.log(`Total de erros corrigidos: ${correctedErrors}`)
	console.log(`Total de erros não corrigidos (máximo 1 por cidade): ${totalErrors}`)
}

fetchAllCities()
