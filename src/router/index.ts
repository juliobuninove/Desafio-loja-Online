import { Router } from "express";
import {
  createUser,
  deleteManyUser,
  getAllUser,
  getOneUser,
} from "../controller/UserController";
import { createAccess, getAllAccesses } from "../controller/AccessController";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getOneProducts,
  updateProduct,
} from "../controller/ProductCrontroller";
import { signIn } from "../controller/SessionController";
import { authMiddleware } from "../middlewares/AuthMiddlewares";
import { createSale, getAllSale, getAllSalesbyBuyer } from "../controller/SaleController";

export const router = Router();

router.post("/user", createUser);
router.delete("/delete-all-users", authMiddleware(["ADM"]), deleteManyUser);
router.get("/get-all-users", authMiddleware(["ADM"]), getAllUser);
router.get("/get-one-user", authMiddleware(["ADM", "Vendedor", "Cliente"]), getOneUser);

router.post("/access", authMiddleware(["ADM"]), createAccess);
router.get("/accesses", authMiddleware(["ADM"]), getAllAccesses);

router.post("/createProduct/:accessName", authMiddleware(["ADM", "Vendedor"]), createProduct);
router.get("/products", getAllProducts);
router.put("/update-product/:productId", authMiddleware(["ADM", "Vendedor"]), updateProduct)
router.get("/get-one-product/:productId", getOneProducts)
router.delete("/delete-product/:productId", authMiddleware(["ADM", "Vendedor"]), deleteProduct)

router.post("/sign-in", signIn);

router.post("/create-sale", authMiddleware(["Cliente"]), createSale)
router.get("/get-all-sale", authMiddleware(["ADM"]), getAllSale)
router.get("/get-all-sale-by-buyer", authMiddleware(["ADM", "Cliente"]), getAllSalesbyBuyer)