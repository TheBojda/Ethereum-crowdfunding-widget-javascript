import { createServer, IncomingMessage, ServerResponse } from 'http';
import { lambdaHandler } from './index';

const port = 3000

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const returnValue = await lambdaHandler(undefined);
    const buff = Buffer.from(returnValue.body, 'base64')
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buff.length
    });
    res.end(buff);
});

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

