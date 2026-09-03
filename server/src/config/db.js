import mongoose from 'mongoose';
import dns from 'dns';
import { MONGO_URI } from './env.js';

// Configure DNS to use Google DNS for MongoDB Atlas SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const origLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  dns.resolve4(hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      if (options && options.all) {
        return callback(null, addresses.map(a => ({ address: a, family: 4 })));
      }
      return callback(null, addresses[0], 4);
    }
    origLookup(hostname, options, callback);
  });
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('================================================');
    console.log('MongoDB Atlas Connected: ' + conn.connection.host);
    console.log('Database Name: ' + conn.connection.name);
    console.log('================================================');
  } catch (error) {
    console.error('MongoDB Connection Error: ' + error.message);
    process.exit(1);
  }
};

export default connectDB;
