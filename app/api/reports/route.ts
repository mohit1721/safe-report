// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";

// import { ReportStatus, ReportType } from "@prisma/client";
// // import prisma from "@/lib/prisma";
// import prisma from "../../../lib/prisma";
// // import { authOptions } from "@/lib/auth";

// import { authOptions } from "../../../lib/auth";


// export async function GET(req: Request) {
//     try {
//       const session = await getServerSession(authOptions);
//       if (!session) {
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//       }
  
//       const { searchParams } = new URL(req.url);
//       const status = searchParams.get("status") as ReportStatus | null;
//       const type = searchParams.get("type") as ReportType | null;
//   /*
//   const where = {...}: Dynamically constructs an object for filtering the reports.
// If status is provided, it adds status to the where object.
// Similarly, if type is provided, it adds type to the where object. 
// This is used to filter the database query.
//   */
//       // Build the where clause based on filters
//       const where = {
//         ...(status && { status }),
//         ...(type && { type }),
//       };
  
//       // Add timeout and retry logic
//       /*Promise.race([...]): The query is executed along with a timeout promise. 
//       The query will either succeed or timeout after 15 seconds.
//       */
//       const reports = await Promise.race([
//         prisma.report.findMany({
//           where,
//           orderBy: {
//             createdAt: "desc",
//           },
//           select: {
//             id: true,
//             reportId: true,
//             type: true,
//             title: true,
//             description: true,
//             location: true,
//             latitude: true,
//             longitude: true,
//             image: true,
//             status: true,
//             video:true,
//             createdAt: true,
//             updatedAt: true,
//           },
//         }),
//         new Promise((_, reject) =>
//           setTimeout(() => reject(new Error("Database timeout")), 15000)
//         ),
//       ]);
  
//       return NextResponse.json(reports);
//     } catch (error: any) {
//       console.error("Failed to fetch reports:", error);
  
//       // More specific error messages
//       if (error.code === "P1001") {
//         return NextResponse.json(
//           { error: "Cannot connect to database. Please try again later." },
//           { status: 503 }
//         );
//       }
  
//       if (error.code === "P2024") {
//         return NextResponse.json(
//           { error: "Database connection timeout. Please try again." },
//           { status: 504 }
//         );
//       }
  
//       return NextResponse.json(
//         { error: "Failed to fetch reports" },
//         { status: 500 }
//       );
//     } finally {
//       // Optional: Disconnect for serverless environments
//       if (process.env.VERCEL) {
//         await prisma.$disconnect();
//       }
//     }
//   }
//   /*
//   This code defines a GET API route that fetches reports from a database. 
//   It checks if the user is authenticated using NextAuth, applies optional filters (e.g., status and type), 
//   and queries the reports from the database. It includes a timeout for the query and handles various database-related errors with specific messages. 
//   Finally, it disconnects from Prisma in serverless environments.
//   */


// ***
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { ReportStatus, ReportType } from "@prisma/client";
import prisma from "../../../lib/prisma";
import { authOptions } from "../../../lib/auth";

export const dynamic = "force-dynamic"; // 👈 Ensures dynamic server execution

export async function GET(req: Request) {
  try {
    // ✅ Authentication: Check if the user is logged in
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Extract search parameters from the request URL
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as ReportStatus | null;
    const type = searchParams.get("type") as ReportType | null;

    // ✅ Construct the Prisma query filter dynamically
    const where = {
      ...(status && { status }),
      ...(type && { type }),
    };

    // ✅ Fetch reports with a timeout
    const reports = await Promise.race([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          reportId: true,
          type: true,
          title: true,
          description: true,
          location: true,
          latitude: true,
          longitude: true,
          image: true,
          status: true,
          video: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database timeout")), 15000)),
    ]);

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("Failed to fetch reports:", error);

    // ✅ Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Database timeout. Please try again." }, { status: 504 });
      }
    }

    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  } finally {
    // ✅ Disconnect Prisma in serverless environments
    if (process.env.VERCEL) {
      await prisma.$disconnect();
    }
  }
}
