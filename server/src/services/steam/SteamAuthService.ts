import mongoose from 'mongoose';
import { AuthMethod } from "../../models/AuthMethod";
import { User } from '../../models/User';

export class SteamAuthService {

  async findOrCreateSteamUser(steamId: string, displayName: string){
    const authMethodDocument = await AuthMethod.findOne({
      provider: 'steam',
      steamId: steamId
    }).populate('userId')

    if (authMethodDocument) {
      const userDocument = authMethodDocument.userId
      return userDocument
    } else {
      let newUser;
      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          [newUser] = await User.create([{ displayName: displayName }], { session });
          await AuthMethod.create([{
            userId: newUser._id,
            provider: 'steam',
            steamId: steamId
          }], { session });
        });
      } finally {
        session.endSession()
      }
      return newUser;
    }
  }
}
