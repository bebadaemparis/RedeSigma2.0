document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const celularInput = document.getElementById('celular');
    const rendaInput = document.getElementById('renda');
    const form = document.getElementById('clientes-form');

    // Função para aplicar a máscara de CPF
    cpfInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        if (value.length > 11) {
            value = value.slice(0, 11); // Limita a 11 caracteres
        }
        this.value = value
            .replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4'); // Aplica a máscara
    });

    // Máscara para Telefone e Celular
    function applyPhoneMask(input) {
        input.addEventListener('input', function() {
            let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
            if (value.length > 11) {
                value = value.slice(0, 11); // Limita a 11 caracteres
            }
            if (value.length <= 10) {
                input.value = value
                    .replace(/^(\d{2})(\d{0,4})/, '($1) $2')
                    .replace(/(\d{4})(\d{0,4})/, '$1-$2');
            } else {
                input.value = value
                    .replace(/^(\d{2})(\d{0,5})/, '($1) $2')
                    .replace(/(\d{5})(\d{0,4})/, '$1-$2');
            }
        });
    }

    applyPhoneMask(telefoneInput);
    applyPhoneMask(celularInput);

    // Função para formatar a renda como moeda
    rendaInput.addEventListener('input', function() {
        // Remove caracteres não numéricos e converte para número
        let value = this.value.replace(/[^\d]/g, '');
        if (value === '') value = '0';
        let numericValue = parseFloat(value) / 100;
        this.value = numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    });

    // Função para salvar dados no Firebase
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const cpf = cpfInput.value;
        const nome = document.getElementById('nome').value;
        const endereco = document.getElementById('endereco').value;
        const telefone = telefoneInput.value;
        const celular = celularInput.value;
        const renda = parseFloat(rendaInput.value.replace(/[^\d]/g, '')) / 100;

        // Adiciona um novo documento à coleção 'clientes'
        db.collection('clientes').add({
            cpf: cpf,
            nome: nome,
            endereco: endereco,
            telefone: telefone,
            celular: celular,
            renda: renda
        }).then(() => {
            alert('Dados salvos com sucesso!');
            form.reset();
        }).catch(error => {
            console.error('Erro ao salvar dados: ', error);
        });
    });
});
