import "dotenv/config";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  clientUrl: process.env.CLIENT_URL,
};

const requiredEnv = [
  ["MONGO_URI", env.mongoUri],
  ["JWT_SECRET", env.jwtSecret],
];

for (const [name, value] of requiredEnv) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

export default env;