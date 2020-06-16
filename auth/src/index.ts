import express from 'express';
import ROUTES from "./routes";

const app = express();
app.use(express.json());

app.get(ROUTES.CURRENT_USER, (req, res) => {
    res.send('route test');
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})