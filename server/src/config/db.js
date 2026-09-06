import mongoose from 'mongoose';
import dns from 'dns';
import { MONGO_URI } from './env.js';

// Configure DNS to use Google & Cloudflare DNS for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS setting is restricted
}

const origLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  // Safeguard localhost and loopback interfaces for CI runners and local testing
  if (hostname === 'localhost' || hostname === '127.0.0.1' || !hostname.includes('.')) {
    return origLookup(hostname, options, callback);
  }

  dns.resolve4(hostname, (err, addresses) => {
    if (!err && addresses && addresses.length > 0) {
      if (options && options.all) {
        return callback(null, addresses.map((a) => ({ address: a, family: 4 })));
      }
      return callback(null, addresses[0], 4);
    }
    origLookup(hostname, options, callback);
  });
};

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('================================================');
    console.error('MongoDB Connection Error: MONGO_URI is missing!');
    console.error('Please create a server/.env file using server/.env.example as a template.');
    console.error('================================================');
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    return;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('================================================');
    console.log('MongoDB Atlas Connected: ' + conn.connection.host);
    console.log('Database Name: ' + conn.connection.name);
    console.log('================================================');
  } catch (error) {
    console.error('MongoDB Connection Error: ' + error.message);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

export default connectDB;
