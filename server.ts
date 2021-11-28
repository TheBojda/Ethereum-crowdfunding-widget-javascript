import express from 'express';
import { lambdaHandler } from './index';

const app = express()
const port = 3000

app.get('/', async (req, res) => {
    const returnValue = await lambdaHandler(undefined);
    const buff = Buffer.from(returnValue.body, 'base64')
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buff.length
    });
    res.end(buff);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})