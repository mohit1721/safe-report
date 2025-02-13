// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// let prisma: any;
// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   prisma = global.prisma;
// }
// export default prisma;


// export const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prisma = db;
// }


// ******

// import { PrismaClient } from "@prisma/client";

// declare global {
//   // Declare a global variable for the Prisma client
//   var prisma: PrismaClient | undefined; // This is fine as it is
// }
// // let prisma: any;
// let prisma: PrismaClient | undefined; // Use a more specific type instead of 'any'

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
//   if (!globalThis.prisma) {
//     globalThis.prisma = new PrismaClient();
//   }
//   prisma = globalThis.prisma;
// }
// export default prisma;


//*****
//  */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
