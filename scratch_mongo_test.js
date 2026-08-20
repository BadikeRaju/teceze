const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://sherusricharan_db_user:FZTXUbtgz2paGAZ3@cluster0.fefolfi.mongodb.net/?appName=Cluster0";

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db('teceze');
    const collection = db.collection('state');
    const doc = await collection.findOne({ _id: 'globalState' });
    console.log("Current state doc:", doc ? "Exists" : "Null");
    
    // Try to write to it to test permissions
    await collection.updateOne(
      { _id: 'globalState' },
      { $set: { testWrite: true } },
      { upsert: true }
    );
    console.log("Write successful!");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await client.close();
  }
}
test();
