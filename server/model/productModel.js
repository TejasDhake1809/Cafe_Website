import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema ({
    name : {type : String,required : true},
    category : {type : String,required : true},
    description : {type : String,required : true},
    image : {type : String,required : true},
    price : {type : Number,required : true}
}, { timestamps: true });

//static add item method
productSchema.statics.addItem = async function(name,category,description,image,price) {
    const exists = await this.findOne({name});
    if (exists)
    {
        throw Error('Product already exists');
    }

    const product = await this.create({name,category,description,image,price})
    return product;
}

productSchema.statics.deleteItem = async function (id) {
    const response = await this.findByIdAndDelete(id);
    if (!response)
    {
        throw Error('Could not delete product');
    }

    return response;
}

const product = mongoose.model('Product', productSchema);
export default product;