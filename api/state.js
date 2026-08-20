const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside Vercel');
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db('teceze');
    const collection = db.collection('state');

    if (req.method === 'GET') {
      // Load state
      const stateDoc = await collection.findOne({ _id: 'globalState' });
      if (stateDoc) {
        return res.status(200).json(stateDoc.state);
      } else {
        return res.status(200).json(null);
      }
    } else if (req.method === 'POST') {
      // Save state
      const newState = req.body;
      await collection.updateOne(
        { _id: 'globalState' },
        { $set: { state: newState, updatedAt: new Date() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
