import manejoArchivo from "./manejoArchivo.js";
import express from "express";

const app = express();
const PORT = 4000;
const manager = new manejoArchivo("./src/datos.json");

app.use(express.urlencoded({ extended: true }));


app.get("/", async(req, res) => {
    res.send("Desafío 3 - Servidor en express");
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
});

app.get("/products", async (req, res) => {
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
    const products = await manager.getAllProducts();
    if (products.length>0){
        let { limit } = req.query;
        let data;
        if (!limit) {
            data = products;
        } else {
            data = products.slice(0, parseInt(limit));
        }
        res.send(data);
    }else{
        res.send("No hay productos en el archivo o éste no existe")
    }

});

app.get("/products/:pid", async (req, res) => {
    if (!manager.checkArchivo()){
        await manager.cargarArchivo(); 
    }
    const product = await manager.getProductById(parseInt(req.params.pid));
    JSON.stringify(product)
    if (product){
        //res.send(JSON.stringify(product)) //En caso de quererlo en formato string
        res.send(`Producto: ${product.title} con la descripción: ${product.description } y el precio ${product.price} `)
    }else{
        res.send("No se encontró el producto")
    }
});

app.listen(PORT, () => {
    console.log(`Server on port:${PORT}`);
});