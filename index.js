import express from "express";
import bodyParser from "body-parser";
import pg from "pg";



const app = express();
const port = 3000;

const db= new pg.Client({
  user:'postgres',
  host:'localhost',
  database:'Permalist',
  password:'Radha@12345',
  port:5432
}

)
db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async(req, res) => {
  const result = await db.query(`SELECT * FROM items ORDER BY id ASC`);
  console.log(result)
  res.render("index.ejs", {
    listTitle: "To Do List",
    listItems: result.rows,
  });
});

app.post("/add", async(req, res) => {

  const inputval = req.body.newItem;
  try{
  const result = await db.query(`INSERT INTO items (title) VALUES($1)`,[inputval])
  //items.push({ title: item });
  res.redirect("/");
}catch(err){
  console.log(err);
}
});

app.post("/edit", async(req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
   const id = req.body.deleteItemId;
   
   const delete_items = await db.query(`DELETE FROM items WHERE id =$1`,[id])
   const result = await db.query(`SELECT * FROM items`);
   res.render('index.ejs',{listTitle:"To Do List",listItems:result.rows})

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
