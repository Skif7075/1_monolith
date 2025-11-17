import express from 'express';
import bodyParser from 'body-parser';
import {router} from "./routes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(bodyParser.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Started on http://localhost:${PORT}`);
});
