if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const bodyParser = require('body-parser');
const GNRequest = require('./apis/gerencianet');

const app = express();

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const reqGNAlready = GNRequest({
    clientID: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET
});

app.get('/', async (req, res) => {
    const reqGN = await reqGNAlready;
    const dataCob = {
        calendario: {
            expiracao: 3600
        },
        valor: {
            original: '101.00'
        },
        chave: 'f3aba500-0875-46c1-a1b4-f4ceb080ff0f',
        solicitacaoPagador: "Informe o número ou identificador do pedido."
    };


    const cobResponse = await reqGN.post('/v2/cob', dataCob);
    const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);
    
    res.render('qrcode', { qrcodeImage: qrcodeResponse.data.imagemQrcode });
});

app.get('/cobranca', async (req, res) => {
    const reqGN = await reqGNAlready;
    const cobResponse = await reqGN.get('/v2/cob?inicio=2020-10-22T16:01:35Z&fim=2021-11-30T20:10:00Z');
    res.send(cobResponse.data);
})

app.post('/webhook(/pix)?', (req, res) => {
    console.log(req.body);
    res.send('200');
});

app.listen(8000, () => {
    console.log('running');
})

