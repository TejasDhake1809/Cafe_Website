import Product from '../model/productModel.js'
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
import Order from '../model/orderModel.js'

dotenv.config();
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const addItem = async(req,res) => {
    const {name, category, description, image, price} = req.body;
    try {
        const product = await Product.addItem(name,category,description,image,price);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({error : error.message})
    }
}

const imageUpload = async (req,res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder : 'signed_cafe', 
        });

        fs.unlinkSync(req.file.path);
        res.status(200).json({imageUrl : result.secure_url});
    } catch (error) {
        console.error('Cloudinary Upload error', error);
        res.status(500).json({error : error.message || 'Failed to upload image'})
    }
}


const getAllItems = async (req,res) => {
    try {
        const { category } = req.query;

        const filter = category && category.trim() !== "" ? { category } : {};

        const items = await Product.find(filter).sort({ createdAt : -1})
        res.status(200).json(items);
    } catch (error) {
        console.error('could not get item', error);
    }
}

const getAnItem = async (req,res) => {
    try {
        const { limit, category } = req.query;
        const filter = category && category.trim() !== "" ? {category} : {};
        const items = await Product.find(filter).sort({orderCount : -1}).limit(Number(limit) || 0);
        res.status(200).json(items);
    } catch (error) {
        console.error('Could not get an item or a limit of items', error);
        res.status(500).json(error.message);
    }
}

const deleteItem = async (req,res) => {
    try {
        const id = req.params.id;
        const result = await Product.deleteItem(id);
        if (result) {
            res.status(200).json({success : "Item successfully deleted"})
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    } catch (error) {
        res.status(400).json({error : error.message});
    }
}

const incrementOrderCount = async (req,res) => {
    const {productId, incrementBy} = req.body;
    try {
        const update = await Product.updateItemOrderCount(productId,incrementBy);
        if (update) {
            return res.status(200).json("Product Order count has been updated");
        } else {
            return res.status(500).json({error : "Failed to update product order count"});
        }
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
}

export {addItem, imageUpload, getAllItems, deleteItem, incrementOrderCount, getAnItem};