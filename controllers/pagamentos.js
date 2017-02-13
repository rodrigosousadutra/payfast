module.exports = function(app) {

    app.get("/pagamentos",function(req, res) {
        res.send('ok');
    });

    app.post("/pagamentos/pagamento",function(req, res) {
        var pagamento = req.body;
        console.log(JSON.stringify(req.body));
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatória.").notEmpty();
        req.assert("valor", "Valor é obrigatório e deve ser um decimal.").notEmpty().isFloat();
        req.assert("moeda", "Moeda é obrigatória e deve ter 3 caracteres").notEmpty().len(3,3);

        var errors = req.validationErrors();

        if (errors){
            console.log("Erros de validação encontrados");
            res.status(400).send(errors);
            return;
        }
        console.log('processando pagamento...');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.pagamentosDao(connection);

        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function(exception, result){
            console.log('pagamento criado: ' + result);

            res.location('/pagamentos/pagamento/' + result.insertId);

            pagamento.id = result.insertId;

            res.status(201).json(pagamento);
        });
    });

    app.put('/pagamentos/pagamento/:id', function(req, res){

        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro){
            if (erro){
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento criado');
            res.send(pagamento);
        });

    });

    app.delete('/pagamentos/pagamento/:id', function(req, res){
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro){
            if (erro){
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento cancelado');
            res.status(204).send(pagamento);
        });
    });

    app.post("/pagamentos/pagamento/autorizacao",function(req, res){
        const cartoesClient = new app.servicos.CartoesClient();
        const cartao = req.body;
        cartoesClient.autoriza(cartao, function (err, request, response, retorno) {
            if (err) {
                console.log("Erro ao consultar serviço de cartões.");
                res.status(400).send(err);
                return;
            }

            console.log('Retorno do servico de cartoes: %j', retorno);

            res.status(201).json(retorno);
        });
    });
}
