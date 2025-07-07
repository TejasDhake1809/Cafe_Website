import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: String,      // sequence name, e.g., "cashOrderId"
  seq: { type: Number, default: 0 }
});

counterSchema.statics.getNextSequence = async function getNextSequence(sequenceName) {
  const counter = await this.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }  // create doc if doesn't exist
  );
  return counter.seq;
}


const Counter = mongoose.model('Counter', counterSchema);
export default Counter;
