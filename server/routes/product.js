import express from 'express'
import { addItem, imageUpload, getAllItems, deleteItem, incrementOrderCount, getAnItem } from '../controllers/productController.js';
import multer from 'multer';

const router = express.Router();

//product upload route
router.post('/add-item', addItem);

//upload image to cloudinary
const upload = multer({dest : 'uploads/'});
router.post('/upload', upload.single('file'), imageUpload);

//fetch items route
router.get('/items', getAllItems);

//delete an item route
router.delete('/items/:id', deleteItem);

//update order count
router.post('/items/update', incrementOrderCount);

//get a number of items
router.get('/items/limited-items', getAnItem);

export default router;