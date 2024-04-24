import { Router } from "express";
import { ProductManager } from "../manager/ProductManager.js";
import ChatManager from "../manager/ChatManager.js";

const router = Router();
const manager = new ProductManager();

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