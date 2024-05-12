import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../model/product.model";
import { validationResult } from "express-validator";


// product creation endpoint
export const createProduct =  async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        const {name, price, category,description, event, discount} = req.body;
        const newProduct = await Product.create({
            name,
            price,
            description,
            event,
            category,
            discount,
        });
        if(!newProduct){
            return res.status(400).json({ message: 'Failed to create product' });
        }
        return res.status(201).json({message: "Product added successfully", newProduct});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// product with a specific event
export const productEvent = async (req: Request, res: Response) => {
    try {
        const {event} = req.params;
        const product = await Product.find({event: event});

        return res.status(200).json({product});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// searched product
export const searchedProduct = async (req: Request, res: Response) => {
    try {
        const { searched } = req.params;
        const searchTerm = searched.trim().toLowerCase();

        const product = await Product.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        if(!product){
            return res.status(404).json({message: `No search results found related to ${searched}`});
        }

        return res.status(200).json({product});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// same category products
export const categoryProduct = async (req: Request, res: Response) => {
    try {
        const {item} = req.params;

        const products = await Product.find({category: item})
        
        return res.status(200).json({products});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}

// update a product
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const update = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, update, {new: true});
        return res.status(200).json({mesaage: "updated successfully", updatedProduct});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"});
    }
}