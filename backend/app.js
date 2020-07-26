const port = 3000;
const express = require("express");
const app = express();
const cors = require("cors");
const { json } = require("body-parser");
const cajerosRouter = require("./routes/cajeros");

app.use(cors());
app.use(json());
app.use("/cajeros", cajerosRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
