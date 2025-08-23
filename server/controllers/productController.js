import Product from '../model/productModel.js'
import fs from 'fs';
import dotenv from 'dotenv';
import { s3 } from '../lib/s3.js';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {v4 as uuid } from 'uuid';
import crypto from 'crypto';

dotenv.config();

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
        const filepath = fs.readFileSync(req.file.path);
        const hash = crypto.createHash("md5").update(filepath).digest("hex");
        const {name} = req.query;
        const exists = await Product.findOne({name});
        if (exists) {
            fs.unlinkSync(req.file.path);
            return res.status(401).json({error : "Item exists"});
        }
        const uniquekey = `signed_cafe/${hash}`;
        const result = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniquekey}`;
        const check = await Product.findOne({image : result});
        if (check) {
            fs.unlinkSync(req.file.path);
            return res.status(401).json({error : "Same Image exists"});
        }
        const params = {
            Bucket : process.env.AWS_BUCKET_NAME,
            Key : uniquekey,
            Body : filepath,
            ContentType : req.file.mimetype,
        }

        await s3.send(new PutObjectCommand(params));

        //public url
        // const result = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniquekey}`;

        fs.unlinkSync(req.file.path);
        res.status(200).json({imageUrl : result});
    } catch (error) {
        console.error('AWS S3 Upload error', error);
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
        const item = await Product.findById(id);
        const key = item.image.split(".amazonaws.com/")[1];
        try {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
            };
            await s3.send(new DeleteObjectCommand(params));
            console.log("Object deleted successfully:", key);
        } catch (error) {
            console.error("Error deleting object:", error);
            return res.status(400).json("Failed to delete item from bucket");
        }

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