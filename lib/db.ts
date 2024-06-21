import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

export const db = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("DB is already connected!");
    return;
  }

  try {
    const connectionCurrent = await mongoose.connect(process.env.DB_URL!);

    connection.isConnected = connectionCurrent.connections[0].readyState;

    console.log(connectionCurrent);

    console.log("DB is connected!");
  } catch (error) {
    console.log("error connecting to db: ", error);
    process.exit(1);
  }
};
