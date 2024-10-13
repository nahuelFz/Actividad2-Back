const http = require('http');
const fs = require('fs');

// Leer el archivo JSON
const frutas = JSON.parse(fs.readFileSync('frutas.json'));

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (method === 'GET') {
        if (url === '/frutas/all') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(frutas));
        } else if (/^\/frutas\/id\/(\d+)$/.test(url)) {
            const id = parseInt(url.split('/')[3]);
            const fruta = frutas.find(f => f.id === id);
            if (fruta) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(fruta));
            } else {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end('Fruta no encontrada');
            }
        } else if (/^\/frutas\/nombre\/(.*)$/.test(url)) {
            const nombre = url.split('/')[3].toLowerCase();
            const frutasEncontradas = frutas.filter(f => f.nombre.toLowerCase().includes(nombre));
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(frutasEncontradas));
        } else if (/^\/frutas\/existe\/(.*)$/.test(url)) {
            const nombre = url.split('/')[3].toLowerCase();
            const existe = frutas.some(f => f.nombre.toLowerCase() === nombre);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(existe ? 'La fruta existe' : 'La fruta no existe');
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Ruta no encontrada');
        }
    } else {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Método no permitido');
    }
});

server.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});