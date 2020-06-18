import mongoose from 'mongoose';

interface UserAttributes {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line @typescript-eslint/no-use-before-define
userSchema.statics.build = (attributes: UserAttributes) => new User(attributes);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
