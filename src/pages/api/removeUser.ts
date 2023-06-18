import { removeUserApi } from "../../apis";

export default async function handler(req, res) {
    const userId = JSON.parse(req.body).userId
    
    if (!userId) {
      return res.status(400).json({ message: 'UserId not detected!' });
    }
   
    try {
        const t = await removeUserApi(userId);
        res.status(200).json({ message: `Removed ${userId}'th user` });
    } catch (e) {
        res.status(400).send(e.message);
    }
}