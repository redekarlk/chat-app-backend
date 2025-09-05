
import mongoose from "mongoose";


const testSchema = new mongoose.Schema({
    fName: {
        type: String,
    },
    lName: {
        type: String,
    },
    image: {
        type: String
    },

    public_id: { type: String },  // Cloudinary public_id

});

const testModel = mongoose.model("test", testSchema);
export default testModel;