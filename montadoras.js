document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do formulário
    const cnpjInput = document.getElementById('cnpj');
    const telefoneInput = document.getElementById('telefone-montadora');
    const celularInput = document.getElementById('celular-montadora');
    const marcaSelectMontadora = document.getElementById('marca-montadora');
    const form = document.querySelector('.montadoras-form');

    // Função para formatar o CNPJ
    function formatCNPJ(value) {
        return value
            .replace(/\D/g, '') // Remove caracteres não numéricos
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18); // Limita a 18 caracteres
    }

    // Função para aplicar a máscara de telefone
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

    // Adiciona a máscara aos campos de telefone e celular
    applyPhoneMask(telefoneInput);
    applyPhoneMask(celularInput);

    // Formata o CNPJ ao digitar
    cnpjInput.addEventListener('input', function() {
        this.value = formatCNPJ(this.value);
    });

    // Adicionar marcas de montadoras de carros
    const marcas = ['Fiat', 'Volkswagen', 'Ford', 'Chevrolet', 'Honda', 'Toyota', 'Nissan', 'Hyundai', 'Kia', 'Mazda'];
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca;
        option.textContent = marca;
        marcaSelectMontadora.appendChild(option);
    });

    // Função para salvar dados no Firebase
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const cnpj = cnpjInput.value;
        const razaoSocial = document.getElementById('razao-social').value;
        const marca = marcaSelectMontadora.value; // Corrigido para pegar o valor correto do select
        const telefone = telefoneInput.value;
        const celular = celularInput.value;

        // Adiciona um novo documento à coleção 'montadoras'
        db.collection('montadoras').add({
            cnpj: cnpj,
            razaoSocial: razaoSocial,
            marca: marca,
            telefone: telefone,
            celular: celular
        }).then(() => {
            alert('Montadora cadastrada com sucesso!');
            form.reset();
        }).catch(error => {
            console.error('Erro ao cadastrar montadora: ', error);
        });
    });
});
