import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_SECRET = 'dummySecret';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const dummyPayload = { id: 'testId', email: 'test@test.com' };
  const sessionJSON = JSON.stringify({ jwt: jwt.sign(dummyPayload, process.env.JWT_SECRET!) });
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // return a string thats the cookie with the encoded data, array for supertest to be happy
  return [`express:sess=${base64}`];
};
