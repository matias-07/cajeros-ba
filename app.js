const port = process.env.PORT || 3000;
const express = require("express");
const app = express();
const { json } = require("body-parser");
const cajerosRouter = require("./routes/cajeros");

app.use(express.static("./public"));
app.use(json());
app.use("/cajeros", cajerosRouter);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
