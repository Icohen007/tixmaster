import mongoose from 'mongoose';
import PasswordManager from '../services/PasswordManager';

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
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
      delete ret.__v;
    },
  },
});

userSchema.pre('save', async function hashHook(done) {
  if (this.isModified('password')) {
    const hashedPassword = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashedPassword);
  }
  done();
});

// eslint-disable-next-line @typescript-eslint/no-use-before-define
userSchema.statics.build = (attributes: UserAttributes) => new User(attributes);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
