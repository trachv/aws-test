import { Schema } from 'dynamoose';
import { v4 as uuidv4 } from 'uuid';

export const UserSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
    default: uuidv4,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
});
