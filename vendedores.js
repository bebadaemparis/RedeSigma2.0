document.addEventListener('DOMContentLoaded', function() {
    const nomeVendedorInput = document.getElementById('nome-vendedor');
    const form = document.querySelector('.vendedores-form');

    // Função para salvar dados no Firebase
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nomeVendedor = nomeVendedorInput.value;

        // Adiciona um novo documento à coleção 'vendedores'
        db.collection('vendedores').add({
            nomeVendedor: nomeVendedor
        }).then(() => {
            alert('Vendedor cadastrado com sucesso!');
            form.reset();
        }).catch(error => {
            console.error('Erro ao cadastrar vendedor: ', error);
        });
    });
});
