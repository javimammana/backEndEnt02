import { Router } from "express";
import { ProductManager } from "../manager/ProductManager.js";

const router = Router();
// const manager = new ProductManager("./src/data/productos.json");
const manager = new ProductManager();


function validateProd (req, res, next) {
    const {title, description, price, code, stock, category} = req.body;
    
    if (!title) {
        return res.json ({
            error: "El Nombre del producto es necesario"
        })
    }

    if (!description) {
        return res.json ({
            error: "La Descripcion del producto es necesaria"
        })
    }

    if (!price) {
        return res.json ({
            error: "El precio del producto es necesario"
        })
    }

    if (!code) {
        return res.json ({
            error: "El codigo del producto es necesario"
        })
    }
    if (!stock) {
        return res.json ({
            error: "El stock de productos es necesario"
        })
    }

    if (!category) {
        return res.json ({
            error: "La categoria de producto es necesaria"
        })
    }

    next();
}

router.get("/", async (req,res) => {
    try {
        const limit = req.query.limit;
        const productos = await manager.getProducts();
        if (limit) {
            res.json(productos.slice(0, limit));
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

router.get ("/:pid", async (req, res) => {
    console.log (req.params);
    const { pid } = req.params;

    const producto = await manager.getProductById(pid);

    res.send (producto);
})

router.post ("/", validateProd, async (req, res) => {

    const prodNvo = req.body;

    let imgPrd = req.body.img

    if (!req.body.img) {
        imgPrd = "sinImg.png"
    } 

    const producto = {
        ...prodNvo,
        img: imgPrd
    }
    console.log("muestro el producto")
    console.log (producto)

    try { const addProduct = await manager.addProduct(producto);
        if (addProduct?.error) { return res.status(409).json({error: addProduct.error})
            }

        res.json ({
            message: "Producto Creado",
            producto,
        });
    } catch (e) {
            res.status(500).json ({
            error: e.message,
        });
    }
});

router.put ("/:pid", validateProd, async (req,res) => {
    console.log (req.params);
    const { pid } = req.params;
    
    const producto = req.body;

    try {
        const upDateProduct = await manager.updateProduct(pid, producto);

        if (upDateProduct?.error) { return res.status(409).json({error: upDateProduct.error})
            }
            res.json ({
            message: "Producto Actualizado",
            producto,
        });
        } catch (e) {
            res.status(500).json ({
            error: e.message,
        });
    }
})

router.delete ("/:pid", async (req, res) => {
    console.log (req.params);
    const { pid } = req.params;
    
    try {
        await manager.deleteProduct(pid);

        res.json ({
            message: "Producto eliminado",
        });
    } catch (e) {
        res.status(500).json ({
            error: e.message,
        });
    }
})




export default router;