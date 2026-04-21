const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const app = express();
app.use(cors()); // Esto evita los errores de bloqueo que viste antes

app.get('/api/tasas', async (req, res) => {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get('https://www.bcv.org.ve/', { httpsAgent: agent });
        const $ = cheerio.load(response.data);

        // Extraemos y limpiamos los precios (cambiando coma por punto)
        const dolar = $('#dolar strong').text().trim().replace(',', '.');
        const euro = $('#euro strong').text().trim().replace(',', '.');

        res.json({
            usd: parseFloat(dolar),
            eur: parseFloat(euro),
            fecha: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Error leyendo el BCV' });
    }
});

const PORT = process.env.PORT || 3000;
aapp.listen(PORT, '0.0.0.0', () => console.log(`API corriendo en puerto ${PORT}`));