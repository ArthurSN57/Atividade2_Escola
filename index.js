const prompt = require('prompt-sync')();

// Objeto que conterá todas as informações do estudante.
let estudanteDados = {
    "nome": "",
    "materias": [],
    "mediaFinal": 0,
    "totalFaltas": 0,
    "statusFinal": ""
};

// Função centralizadora do fluxo a ser seguido pelo estudante.
function CadastrarNotasEscolares(){
    estudanteDados["nome"] = CadastrarNome();
    estudanteDados["materias"] = CadastrarMaterias();

    CadastrarNotasFaltas(estudanteDados["materias"]);
    
    ShowResultados();
}

// Função para cadastro de dados do aluno (Por hora, apenas solicita o nome)
function CadastrarNome(){
    let nome = prompt("Escreva seu nome: ");

    console.log(`Bem-vindo ${nome}!`);
    console.log(" ");

    return nome;
}

// Função para cadastro de nomes das matérias, retorna o objeto de cada matéria pronto para uso.
function CadastrarMaterias(){
    let materiaSelecionada = "";
    let materiaLista = [];

    // Loop para inserções opcionais, até que o próprio usuário finalize.
    if(materiaSelecionada.toLocaleUpperCase() != 'FIM'){
        do {
            let materiaDados = {
                "notas": [],
                "nome": "",
                "faltas": 0,
                "status": "",
                "media": 0
            };
            
            if(materiaLista.length < 3){
                materiaSelecionada = prompt("Digite a matéria que deseja inserir: ");
            } else {
                materiaSelecionada = prompt("Digite a matéria que deseja inserir. (Caso deseje finalizar, escreva 'FIM'): ");
            }

            // Tratativas para inserção da matéria na lista do estudante.
            if(materiaSelecionada.toLocaleUpperCase() != 'FIM'){
                let materiaExistente = materiaLista.some((item, index) => {
                    return item.nome === materiaSelecionada;
                })
                
                if(materiaExistente){
                    console.log("Matéria não inserida, este nome foi utilizado anteriormente.");
                } else {
                    materiaDados["nome"] = materiaSelecionada;
                
                    materiaLista.push(materiaDados);
                    console.log(`Matéria ${materiaSelecionada} inserida com sucesso!`);
                }
            } else if(materiaLista.length < 3){
                console.log("Matéria não inserida, a palavra 'Fim' é reservada pelo sistema.")
            }

            console.log(' ');
        } while(materiaSelecionada.toLocaleUpperCase() != "FIM" || materiaLista.length < 3);
    }

    return materiaLista;
}

//Função para cadastrar todas as notas e faltas para cada matéria.
function CadastrarNotasFaltas(listaMaterias){
    for(let i = 0; i < listaMaterias.length; i++){
        for(let j = 1; j <= 3; j++){
            let nota = prompt(`Digite a ${j}ª nota da matéria ${listaMaterias[i]["nome"]}: `);

            // Tentativa dupla de inserção de valores corretos, caso falhe duas vezes, o valor fica zerado.
            if(nota >= 0 && nota <=  10){
                listaMaterias[i]['notas'].push(parseInt(nota));
            } else {
                nota = prompt("Valor de nota inválido, digite novamente (O valor deve estar entre 0 e 10): ");

                if(nota >= 0 && nota <=  10){
                    listaMaterias[i]['notas'].push(parseInt(nota));
                } else {
                    console.log("Duas tentativas incorretas, o valor desta nota será 0.");

                    listaMaterias[i]['notas'].push(0);
                }
            }
        }
        console.log(" ");

        // Tratativas para inserção de faltas por matéria.
        let faltasNumero = parseInt(prompt(`Digite a quantidade de faltas que teve na matéria ${listaMaterias[i]['nome']}: `));

        if(faltasNumero < 0){
            faltasNumero = parseInt(prompt(`Valor incorreto, o número de faltas deve ser maior que 0. Tente novamente: `));   
        }

        listaMaterias[i]['faltas'] = faltasNumero;
        console.log(" ");
    }
}

//Função para apresentação de resultados do estudante.
function ShowResultados(){
    let listaNotasCompleta = [];

    // Loop para construção de resultados gerais e status.
    for(let i = 0; i < estudanteDados["materias"].length; i++){
        let materia = estudanteDados["materias"][i];

        listaNotasCompleta = listaNotasCompleta.concat(materia["notas"]);

        estudanteDados["totalFaltas"] += materia["faltas"];

        let totalNotasMateria = materia["notas"].reduce((a, b) => {
            return a + b;
        }, 0);

        materia["media"] = parseFloat((totalNotasMateria / materia["notas"].length).toFixed());

        if(materia["media"] < 5){
            materia["status"] = "Reprovado";
            estudanteDados["statusFinal"] = "Reprovado";
        } else if(materia["faltas"] > 5){
            materia["status"] = "Reprovado por faltas";
            estudanteDados["statusFinal"] = "Reprovado";
        } else {
            materia["status"] = "Aprovado";
        }
    }

    let notasSomatorio = listaNotasCompleta.reduce((a, b) => {
        return a + b;
    }, 0);

    estudanteDados["mediaFinal"] = parseFloat((notasSomatorio / listaNotasCompleta.length).toFixed());

    if(estudanteDados["statusFinal"] == ""){
        estudanteDados["statusFinal"] = "Aprovado";
    }

    console.log(`Caro(a) Sr(a). ${estudanteDados["nome"]},`);
    console.log(`Seu resultado final foi ${estudanteDados["statusFinal"]}, com média geral de ${estudanteDados["mediaFinal"]} e ${estudanteDados["totalFaltas"]} faltas.`)
    console.log(" ")
    console.log("Seguem seus resultados por matérias:")

    // Loop para apresentação de resultados por matérias.
    for(let i = 0; i < estudanteDados["materias"].length; i++){
        let materia = estudanteDados["materias"][i];

        console.log(" ");
        console.log(`Matéria: ${materia["nome"]}`);
        console.log(`Média: ${materia["media"]}        Faltas: ${materia["faltas"]}        Status: ${materia["status"]}`);
        console.log(" ");
        console.log("-----------------------------------------------------------------------------------------------------")
    }
}

CadastrarNotasEscolares();