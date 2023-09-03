import mongoose from "mongoose";
import RateLimiterMongo  from "rate-limiter-flexible";

/**
 * Rate limiter pour l'anti brut force
 */
const mongoOpts = {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 100, // Reconnect every 100ms
  };
  let mongoConn, mongooseInstance;
  const dbName = 'somedb';
  
  // For mongoose version > 5
  try {
    mongooseInstance = await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
    mongoConn = mongooseInstance.connection;
  } catch (error) {
    handleError(error);
  }
  
  const opts = {
    storeClient: mongooseInstance || mongoConn,
    points: 10, // Number of points
    duration: 1, // Per second(s)
  };
    
  const rateLimiterMongo = new RateLimiterMongo(opts);
  rateLimiterMongo.consume(remoteAddress, 2) // consume 2 points
    .then((rateLimiterRes) => {
      // 2 points consumed
    })
    .catch((rateLimiterRes) => {
      // Not enough points to consume
    });
  