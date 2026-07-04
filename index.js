require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

app.post('/create-preference', async (req, res) => {
  try {
    const { items, payer } = req.body;

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items,
        payer: payer || { email: "pdv@cliente.com" },
        back_urls: {
          success: "https://seusite.com/success",
          failure: "https://seusite.com/failure",
          pending: "https://seusite.com/pending"
        },
        auto_return: "approved",
      }
    });

    res.json({ init_point: result.init_point, preference_id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/webhook', (req, res) => {
  console.log('Webhook recebido:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend PDV rodando na porta ${PORT}`));
