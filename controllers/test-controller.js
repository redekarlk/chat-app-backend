import { model } from "mongoose";
import testModel from "../models/test-model.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";




export const testAll = async (req, res) => {

    try {

        const names = await testModel.find();

        if (!names) {
            return res.json({ success: false, message: "No names found" });
        }

        return res.json({ success: true, names });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const testCreate = async (req, res) => {
    const { fName, lName } = req.body;
    const imageUrl = req.file?.path;

    console.log(fName, lName)
    try {
        const test = new testModel({
            fName,
            lName,
            image: imageUrl,
            public_id: req.file?.filename,

        })

        await test.save();
        return res.json({ success: true, message: "data added successfully!" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export const updateTest = async (req, res) => {
    const { fName, lName } = req.body;
    const { id } = req.params;

    try {

        const updateName = await testModel.findByIdAndUpdate(id,
            {
                fName,
                lName
            }
        )
        if (!updateName) {
            return res.json({ success: false, message: "Not updated!" });
        }

        return res.json({ success: true, message: "successfully updated!" });

    } catch (error) {

    }
}


export const deleteTest = async (req, res) => {
    const { id } = req.params;

    try {

        // Find record first
        const record = await testModel.findById(id);
        if (!record) {
            return res.json({ success: false, message: "Not found!" });
        }


        // Delete from Cloudinary if public_id exists
        if (record.public_id) {
            await cloudinary.uploader. destroy(record.public_id);
        }

        const deleteName = await testModel.findByIdAndDelete(id);

        if (!deleteName) {
            return res.json({ success: false, message: "not found!" })
        }

        return res.json({ success: true, message: "Name delete successfully!" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
} 