document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.pedidos-form');
    const numeroPedidoInput = document.getElementById('numero-pedido');
    const dataInput = document.getElementById('data');
    const marcaSelect = document.getElementById('marca');
    const modeloSelect = document.getElementById('modelo');
    const quantidadeInput = document.getElementById('quantidade');

    // Função para gerar um número automático de pedido
    function gerarNumeroPedido() {
        return Math.floor(Math.random() * 1000000);
    }

    // Inicializar o número do pedido
    numeroPedidoInput.value = gerarNumeroPedido();

    // Função para salvar dados no Firebase
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Obtenha os valores dos campos
        const numeroPedido = numeroPedidoInput.value;
        const data = dataInput.value;
        const marca = marcaSelect.value;
        const modelo = modeloSelect.value;
        const quantidade = parseInt(quantidadeInput.value, 10);

        // Adicione logs para depuração
        console.log('Número do Pedido:', numeroPedido);
        console.log('Data:', data);
        console.log('Marca:', marca);
        console.log('Modelo:', modelo);
        console.log('Quantidade:', quantidade);

        // Adiciona um novo documento à coleção 'pedidos'
        try {
            await db.collection('pedidos').add({
                numero_pedido: numeroPedido,
                data: data,
                marca: marca,
                modelo: modelo,
                quantidade: quantidade
            });
            alert('Pedido cadastrado com sucesso!');
            form.reset();
            numeroPedidoInput.value = gerarNumeroPedido(); // Gerar um novo número de pedido
        } catch (error) {
            console.error('Erro ao salvar o pedido:', error);
            alert('Erro ao salvar o pedido. Tente novamente.');
        }
    });
});
