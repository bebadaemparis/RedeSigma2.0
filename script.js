// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRfd3UOOhC3a6tacm9yctEnn5a4rFzPLs",
    authDomain: "sistemadeveiculos.firebaseapp.com",
    projectId: "sistemadeveiculos",
    storageBucket: "sistemadeveiculos.appspot.com",
    messagingSenderId: "777269427564",
    appId: "1:777269427564:web:9aed6c35c62a9ace754749"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('nav a');
    const formContainers = document.querySelectorAll('.form-container');
    const closeButtons = document.querySelectorAll('.close-btn');
    const overlay = document.createElement('div');
    
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const target = this.getAttribute('data-target');
            formContainers.forEach(container => {
                if (container.id === target) {
                    event.preventDefault();
                    container.style.display = 'block';
                    overlay.style.display = 'block';
                } else {
                    container.style.display = 'none'; // Esconde outros formulários
                }
            });
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.form-container').style.display = 'none';
            overlay.style.display = 'none';
        });
    });

    overlay.addEventListener('click', function() {
        formContainers.forEach(container => {
            container.style.display = 'none';
        });
        overlay.style.display = 'none';
    });
});


// Função para atualizar o último cliente cadastrado
function atualizarUltimoCliente() {
    db.collection('clientes').get().then((snapshot) => {
        if (!snapshot.empty) {
            // Obter todos os documentos e encontrar o com o maior ID
            let ultimoCliente = snapshot.docs.reduce((maxDoc, doc) => {
                return doc.id > maxDoc.id ? doc : maxDoc;
            }, snapshot.docs[0]);

            // Exibir o nome do último cliente
            document.getElementById('cliente-nome').innerText = ultimoCliente.data().nome;
        } else {
            document.getElementById('cliente-nome').innerText = 'Nenhum cliente cadastrado';
        }
    }).catch((error) => {
        console.error("Erro ao buscar último cliente: ", error);
        document.getElementById('cliente-nome').innerText = 'Erro ao carregar dados';
    });
}

// Atualizar informações ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    atualizarUltimoCliente();
    atualizarUltimosVeiculos();
});

        // Função para atualizar os últimos veículos vendidos
        function atualizarUltimosVeiculos() {
            db.collection('vendas').orderBy('data', 'desc').limit(5).get().then((snapshot) => {
                var veiculosList = document.getElementById('veiculos-list');
                veiculosList.innerHTML = '';
                snapshot.forEach((doc) => {
                    var venda = doc.data();
                    var li = document.createElement('li');
                    li.innerText = `Veículo: ${venda.veiculo}, Cliente: ${venda.cliente}, Valor: ${venda.valor_total}`;
                    veiculosList.appendChild(li);
                });
                if (veiculosList.childElementCount === 0) {
                    veiculosList.innerHTML = '<li>Nenhuma venda registrada</li>';
                }
            }).catch((error) => {
                console.error("Erro ao buscar veículos vendidos: ", error);
                document.getElementById('veiculos-list').innerHTML = '<li>Erro ao carregar dados</li>';
            });
        }

        // Atualizar informações ao carregar a página
        document.addEventListener('DOMContentLoaded', function() {
            atualizarUltimoCliente();
            atualizarUltimosVeiculos();
        });