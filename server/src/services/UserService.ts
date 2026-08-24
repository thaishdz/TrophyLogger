import { HydratedDocument} from 'mongoose';
import { AuthMethod } from "../models/AuthMethod";
import { HttpException } from '../exceptions/HttpException';
import { IUser } from '../models/User';




export class UserService {

  async getSteamId(user: HydratedDocument<IUser>) {
    const authMethodDocument = await AuthMethod.findOne({
      userId: user._id
    })
    if (!authMethodDocument) {
      throw new HttpException(404, "Authmethod not found")
    }
      return authMethodDocument.steamId;
  }
}
