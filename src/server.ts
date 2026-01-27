import app from "./app";
import config from "./config";

import { prisma } from "./lib/prisma";

const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connection with database successful");

    //server
    app.listen(port, () => {
      console.log(`app listening on port ${port}`);
    });
  } catch (error: any) {
    console.error("An error occur", error);
    prisma.$disconnect();
    process.exit(1);
  }
}

main();
