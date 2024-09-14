document.addEventListener('DOMContentLoaded', function() {
    const formVenda = document.querySelector('.vendas-form');
    const numeroVendaInput = document.getElementById('numero-venda');
    const dataInput = document.getElementById('data');
    const clienteSelect = document.getElementById('cliente');
    const vendedorSelect = document.getElementById('vendedor');
    const veiculoSelect = document.getElementById('veiculo');
    const valorEntradaInput = document.getElementById('valor-entrada');
    const valorFinanciadoInput = document.getElementById('valor-financiado');
    const parcelasInput = document.getElementById('parcelas');
    const valorParcelasInput = document.getElementById('valor-parcelas');
    const valorTotalInput = document.getElementById('valor-total');

    // Função para gerar número único de venda
    function gerarNumeroVenda() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString();
        return `V-${timestamp}-${random}`;
    }

    // Preenche automaticamente o campo número da venda com um valor único
    numeroVendaInput.value = gerarNumeroVenda();

    // Função para buscar dados do Firebase e preencher o select
    function preencherSelect(collectionName, selectElement, fieldName) {
        console.log(`Buscando dados da coleção ${collectionName}`);
        db.collection(collectionName).get().then((querySnapshot) => {
            selectElement.innerHTML = ''; // Limpa o select antes de adicionar novas opções
    
            if (querySnapshot.empty) {
                console.warn(`A coleção ${collectionName} está vazia.`);
                return;
            }
    
            // Adiciona uma opção padrão
            selectElement.innerHTML = `<option value="">Selecione um ${fieldName}</option>`;
    
            querySnapshot.forEach((doc) => {
                console.log(`Documento ID: ${doc.id}, Dados:`, doc.data()); // Log dos dados do documento
                
                const option = document.createElement('option');
                option.value = doc.id; // Usa o ID do documento como valor
                const fieldValue = doc.data()[fieldName];
    
                if (fieldValue) {
                    option.textContent = fieldValue; // Configura o texto da opção como o valor do campo
                    selectElement.appendChild(option);
                } else {
                    console.warn(`Campo ${fieldName} não encontrado para documento ${doc.id}`);
                }
            });
    
            console.log(`Dados da coleção ${collectionName} preenchidos.`);
        }).catch(error => {
            console.error(`Erro ao buscar dados da coleção ${collectionName}:`, error);
        });
    }

    // Preenche o select de clientes
    preencherSelect('clientes', clienteSelect, 'nome');

    // Preenche o select de vendedores
    preencherSelect('vendedores', vendedorSelect, 'nomeVendedor');

    // Preenche o select de veículos
    preencherSelect('veiculos', veiculoSelect, 'modelo');

    // Função para buscar os nomes baseados nos IDs
    function buscarNomePorId(collectionName, id) {
        return db.collection(collectionName).doc(id).get().then(doc => {
            if (doc.exists) {
                return doc.data().nome || doc.data().nomeVendedor || doc.data().modelo; // Retorna o nome ou modelo
            } else {
                throw new Error(`Documento ${id} não encontrado na coleção ${collectionName}`);
            }
        });
    }

    // Função para salvar a venda no Firebase
    formVenda.addEventListener('submit', function(event) {
        event.preventDefault();

        const numeroVenda = numeroVendaInput.value;
        const data = dataInput.value;
        const clienteId = clienteSelect.value;
        const vendedorId = vendedorSelect.value;
        const veiculoId = veiculoSelect.value;
        const valorEntrada = parseFloat(valorEntradaInput.value);
        const valorFinanciado = parseFloat(valorFinanciadoInput.value);
        const parcelas = parseInt(parcelasInput.value);
        const valorParcelas = parseFloat(valorParcelasInput.value);
        const valorTotal = parseFloat(valorTotalInput.value);

        if (isNaN(valorEntrada) || isNaN(valorFinanciado) || isNaN(parcelas) || isNaN(valorParcelas) || isNaN(valorTotal)) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        // Buscar os nomes antes de salvar a venda
        Promise.all([
            buscarNomePorId('clientes', clienteId),
            buscarNomePorId('vendedores', vendedorId),
            buscarNomePorId('veiculos', veiculoId)
        ]).then(([clienteNome, vendedorNome, veiculoModelo]) => {
            // Adiciona a venda no Firebase com nomes em vez de IDs
            return db.collection('vendas').add({
                numeroVenda: numeroVenda,
                data: data,
                cliente: clienteNome,
                vendedor: vendedorNome,
                veiculo: veiculoModelo,
                valorEntrada: valorEntrada,
                valorFinanciado: valorFinanciado,
                parcelas: parcelas,
                valorParcelas: valorParcelas,
                valorTotal: valorTotal
            });
        }).then(() => {
            alert('Venda cadastrada com sucesso!');
            formVenda.reset();
            numeroVendaInput.value = gerarNumeroVenda(); // Gera novo número de venda
        }).catch(error => {
            console.error('Erro ao cadastrar venda: ', error);
        });
    });
});
