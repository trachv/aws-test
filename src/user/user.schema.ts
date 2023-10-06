import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  id: {
    type: Number,
    hashKey: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});
