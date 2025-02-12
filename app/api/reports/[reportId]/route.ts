// inside this route.we are going to 
// have a patch function that will be used bt the admins to update the status of a report

// import prisma from "@/lib/prisma";
import prisma from "../../../../lib/prisma"
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// This code defines a PATCH route to allow admins to update the status of a report in a database using the Prisma ORM. 
export async function PATCH(
  request: Request,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    const { status } = await request.json();
    const report = await prisma?.report.update({
      where: { id: params.reportId },
      data: { status }, 
    });

    return NextResponse.json(report);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}



/*
the placement of a file inside a folder named [reportId] indicates that
 the folder is a dynamic route segment.

/api
└── /reports
    └── /[reportId]
        └── route.ts (or route.js)

This structure maps to an API route that handles requests to /api/reports/:reportId.
The :reportId part of the URL can be any string (e.g., a report ID, user ID, or any unique identifier).

*/