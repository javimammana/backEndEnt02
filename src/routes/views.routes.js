import { Router } from "express";
import { ProductManager } from "../manager/ProductManager.js";
import ChatManager from "../manager/ChatManager.js";
import { CartManager } from "../manager/CartManager.js";

const router = Router();
const manager = new ProductManager();
const managerCart = new CartManager();

router.get("/", async (req, res) => {
    try {
        const products = await manager.getProducts();
        console.log(products)
        res.render("home", {
            title: "Productos",
            fileCss: "style.css",
            products
        });
    } catch (error) {
        res.status(500).json({error: "Error del servicor"});
        console.log (error)
    }
});

router.get("/products", async (req, res) => {
    try {
        const { query, page, limit, sort } = req.query;
        const products = await manager.getProductsPaginate(limit, page, query, sort);

        let elementos = products.docs.map(prod => {
            const cosas = prod.toObject();

            return cosas;
        });
        console.log(elementos)

        const pages = []

        if (products.totalPages != 1) {
            for (let i = 1; i <= products.totalPages; i++) {
                pages.push({page: i, limit: limit, filtro: query, sort: sort, pageNow: i == products.page ? true : false });
            }
        }

        res.render("products", {
            title: "Productos",
            fileCss: "style.css",
            products,
            elementos,
            pages,
            sort,
            query,
        });

    } catch (error) {
        res.status(500).json({error: "Error del servicor"});
        console.log (error)
    }
});

router.get ("/product/:pid", async(req, res) => {
    try {
        const {pid} = req.params;
        const product = await manager.getProductById(pid);
        console.log(product)
        res.render("product", {
            title: product ? product.title : "El producto no existe",
            fileCss: "style.css",
            product
        });
    } catch (error) {
        res.status(500).json({error: "Error del servicor"});
        console.log (error)
    }
})

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;

    const cart = await managerCart.getCartById(cid);

    const cartTotal = cart.products.map(inCart => {
        const totalProd = {
            ...inCart,
            totalPrice: inCart.quantity * inCart.product.price,
            }
        return totalProd
    })

    const cartRender = {
        ...cart,
        products: cartTotal
    }
    console.log(cartRender)
    // console.log(cartTotal)

    res.render("cart", {
        title: "Carrito",
        fileCss: "style.css",
        cid,
        cartRender,
    });
})

router.get("/realtimeproducts", (req, res) => {
    try {
        res.render("realTimeProducts", {
            title: "Manager de productos",
            fileCss: "style.css"
        });
    } catch (error) {
        res.status(500).json({error: "Error del servidor"});
    }
})

//CHAT//
router.get ("/messages", async (req, res) => {
    try {
        const chats = await ChatManager.getAllMessages();
        // console.log(chats);
        res.render("chat", {
            title: "CHAT",
            fileCss: "style.css",
            chats,
        });
    } catch (e) {
        console.log(e);
        res.json({
            message: "Error al leer Mensajes",
            e,
        });
    }
})


export default router;