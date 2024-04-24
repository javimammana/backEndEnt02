import { CartModel } from "../models/cart.model.js";
import { ProductManager } from "./ProductManager.js";

const manager = new ProductManager();

class CartManager {

    async addCart () {
        try {
            const nvoCart = new CartModel({products: []});
            await nvoCart.save();
            return nvoCart;
        } catch (error) {
            console.log ("Error al crear un carrito Nvo", error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id);
            if (!cart) {
                console.log ("El carrito no existe.");
                return null;
            }
            console.log ("Carrito encontrado.");
            return cart;
        } catch (error) {
            console.log ("Error al buscar carrito por ID", error)
            throw error;
        }
    }
    
    async addProductInCart (cid, pid, res) {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) {
                console.log("El carrito no existe")
                return null;
            }

            const prod = await manager.getProductById(pid);
            if (!prod) {
                console.log("El producto no existe.")
                return null;
            }

            const existProd = cart.products.find(item => item.product.toString() === pid);
            if (existProd) {
                existProd.quantity++;
            } else {
                cart.products.push({product: pid, quantity: 1})
            }

            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.log ("Error al agregar producto al carrito", error);
            throw error;
        }
    }

    async deleteCart (cid) {

    }

    async deleteItem (cid, pid) {
    }
}

class ItemCart {
    constructor (product, quantity) {
        this.product  = product;
        this.quantity = quantity;
    }
}

export { CartManager };