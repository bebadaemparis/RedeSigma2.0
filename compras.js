document.addEventListener('DOMContentLoaded', function() {
    const formCompras = document.querySelector('.compras-form');
    const numeroCompraInput = document.getElementById('numero-compra');
    const dataInput = document.getElementById('data');
    const clienteSelect = document.getElementById('cliente');
    const veiculoSelect = document.getElementById('veiculo');
    const valorInput = document.getElementById('valor');

    // Função para gerar número único de compra
    function gerarNumeroCompra() {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString();
        return `C-${timestamp}-${random}`;
    }

    numeroCompraInput.value = gerarNumeroCompra();

    // Função para buscar dados do Firebase e preencher o select
    function preencherSelect(collectionName, selectElement, fieldName) {
        console.log(`Buscando dados da coleção ${collectionName} no Firebase`);

        db.collection(collectionName).get().then((querySnapshot) => {
            selectElement.innerHTML = '<option value="">Selecione</option>'; // Limpa e adiciona opção padrão

            if (querySnapshot.empty) {
                console.warn(`A coleção ${collectionName} está vazia.`);
                return;
            }

            querySnapshot.forEach((doc) => {
                console.log(`Documento ID: ${doc.id}, Dados:`, doc.data()); // Log dos dados do documento
                
                const option = document.createElement('option');
                option.value = doc.id; // Usa o ID do documento como valor
                option.textContent = doc.data()[fieldName] || 'N/A'; // Se o campo não estiver presente, exibe 'N/A'
                selectElement.appendChild(option);
            });

            console.log(`Dados da coleção ${collectionName} preenchidos com sucesso.`);
        }).catch(error => {
            console.error(`Erro ao buscar dados da coleção ${collectionName}:`, error);
        });
    }

    preencherSelect('clientes', clienteSelect, 'nome');
    preencherSelect('veiculos', veiculoSelect, 'modelo');

    // Função para buscar os nomes baseados nos IDs
    function buscarNomePorId(collectionName, id) {
        return db.collection(collectionName).doc(id).get().then(doc => {
            if (doc.exists) {
                return doc.data().nome || doc.data().modelo; // Retorna o nome ou modelo
            } else {
                throw new Error(`Documento ${id} não encontrado na coleção ${collectionName}`);
            }
        });
    }

    // Função para salvar a compra no Firebase
    formCompras.addEventListener('submit', function(event) {
        event.preventDefault();

        const numeroCompra = numeroCompraInput.value;
        const data = dataInput.value;
        const clienteId = clienteSelect.value;
        const veiculoId = veiculoSelect.value;
        const valor = parseFloat(valorInput.dataset.rawValue);

        if (isNaN(valor)) {
            alert('Preencha o valor corretamente.');
            return;
        }

        // Buscar os nomes antes de salvar a compra
        Promise.all([
            buscarNomePorId('clientes', clienteId),
            buscarNomePorId('veiculos', veiculoId)
        ]).then(([clienteNome, veiculoModelo]) => {
            // Adiciona a compra no Firebase com nomes em vez de IDs
            return db.collection('compras').add({
                numeroCompra: numeroCompra,
                data: data,
                cliente: clienteNome,
                veiculo: veiculoModelo,
                valor: valor
            });
        }).then(() => {
            alert('Compra cadastrada com sucesso!');
            formCompras.reset();
            numeroCompraInput.value = gerarNumeroCompra(); // Gera novo número de compra
        }).catch(error => {
            console.error('Erro ao cadastrar compra: ', error);
        });
    });
});
