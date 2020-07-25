import mongoose from 'mongoose';

interface PaymentAttributes {
  orderId: string;
  stripeId: string;
}
// no update - no need version
interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attributes: PaymentAttributes): PaymentDoc;
}
// version not included, automatically added by mongoose.
const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  stripeId: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-use-before-define
PaymentSchema.statics.build = (attributes: PaymentAttributes) => new Payment(attributes);

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', PaymentSchema);

export default Payment;
