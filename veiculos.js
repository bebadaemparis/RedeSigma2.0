document.addEventListener('DOMContentLoaded', function() {
    const chassiInput = document.getElementById('chassi');
    const placaInput = document.getElementById('placa');
    const marcaInput = document.getElementById('marca');
    const modeloInput = document.getElementById('modelo');
    const anoFabricacaoInput = document.getElementById('ano-fabricacao');
    const anoModeloInput = document.getElementById('ano-modelo');
    const corInput = document.getElementById('cor');
    const valorInput = document.getElementById('valor');
    const form = document.querySelector('.veiculos-form');

    let chassiAlertShown = false; // Flag para controlar a exibição do alerta

    // Máscara para o campo de Chassi
    chassiInput.addEventListener('input', function() {
        let value = this.value.replace(/[^A-Za-z0-9]/g, ''); // Remove caracteres não alfanuméricos
        if (value.length > 17) {
            value = value.slice(0, 17); // Limita a 17 caracteres
        }
        this.value = value;
    });

    chassiInput.addEventListener('focus', function() {
        if (!chassiAlertShown) {
            chassiAlertShown = true;
            alert('O chassi deve conter letras e números.');
        }
    });

    // Máscara para o campo de Placa
    placaInput.addEventListener('input', function() {
        let value = this.value.replace(/[^A-Za-z0-9]/g, ''); // Remove caracteres não alfanuméricos
        if (value.length > 7) {
            value = value.slice(0, 7); // Limita a 7 caracteres
        }
        this.value = value
            .replace(/^([A-Za-z]{3})([0-9]{1,3})/, '$1-$2')
            .replace(/^([A-Za-z]{3}-[0-9]{1,3})([A-Za-z]{0,1})([0-9]{0,1})/, '$1$2$3');
    });

    // Adicionar marcas e modelos
    const marcas = ['Fiat', 'Volkswagen', 'Ford', 'Chevrolet', 'Honda'];
    const modelos = {
        'Fiat': ['Uno', 'Palio', 'Toro'],
        'Volkswagen': ['Gol', 'Passat', 'Tiguan'],
        'Ford': ['Fiesta', 'Focus', 'EcoSport'],
        'Chevrolet': ['Onix', 'Tracker', 'Camaro'],
        'Honda': ['Civic', 'HR-V', 'Fit']
    };

    // Preencher a lista de marcas
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        marcaInput.appendChild(option);
    });

    // Atualizar modelos com base na marca selecionada
    marcaInput.addEventListener('change', function() {
        const selectedMarca = this.value;
        modeloInput.innerHTML = '<option value="">Selecione um modelo</option>'; // Limpa modelos existentes
        if (modelos[selectedMarca]) {
            modelos[selectedMarca].forEach(modelo => {
                let option = document.createElement('option');
                option.value = modelo;
                option.textContent = modelo;
                modeloInput.appendChild(option);
            });
        }
    });

    // Adicionar opções de ano para os campos Ano de Fabricação e Ano do Modelo
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        let option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        anoFabricacaoInput.appendChild(option);
        anoModeloInput.appendChild(option.cloneNode(true)); // Clona o mesmo ano para ambos os campos
    }

    // Função para formatar a entrada como moeda
    valorInput.addEventListener('input', function() {
        // Remove caracteres não numéricos e mantém somente os dígitos
        let value = this.value.replace(/[^\d]/g, '');
        if (value === '') value = '0';
        // Converte para número e formata como moeda
        let numericValue = parseFloat(value) / 100;
        this.dataset.rawValue = numericValue; // Armazena o valor bruto para envio
        this.value = numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    });

    // Função para salvar dados no Firebase
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const chassi = chassiInput.value;
        const placa = placaInput.value;
        const marca = marcaInput.value;
        const modelo = modeloInput.value;
        const anoFabricacao = anoFabricacaoInput.value;
        const anoModelo = anoModeloInput.value;
        const cor = corInput.value;
        const valor = parseFloat(valorInput.dataset.rawValue || '0'); // Usa o valor bruto armazenado

        // Adiciona um novo documento à coleção 'veiculos'
        db.collection('veiculos').add({
            chassi: chassi,
            placa: placa,
            marca: marca,
            modelo: modelo,
            anoFabricacao: anoFabricacao,
            anoModelo: anoModelo,
            cor: cor,
            valor: valor
        }).then(() => {
            alert('Dados salvos com sucesso!');
            form.reset();
        }).catch(error => {
            console.error('Erro ao salvar dados: ', error);
        });
    });
});
