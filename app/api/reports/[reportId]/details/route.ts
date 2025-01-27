// going to do is to heb the admin or
// emergency um authority to handle the status of this report . to change the status from pending to completed

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";


const prisma = new PrismaClient();

// Calls an API endpoint (/api/reports/${reportId}/details) to retrieve the report data.

export async function GET(
    request: Request,
    { params }: { params: { reportId: string } }
  ) {
    try {
      const report = await prisma.report.findUnique({
        where: {
          reportId: params.reportId,
        },
      });
  
      if (!report) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
  
      return NextResponse.json(report);

    } catch (error) {
      console.error("Error fetching report details:", error);
      return NextResponse.json(
        { error: "Failed to fetch report details" },
        { status: 500 }
      );
    }
  }

//   this patch is for updating
// the state of the report by the admins
// 

// PATCH -> only update one field at a time...****

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { status } = await request.json();
      const report = await prisma.report.update({
        where: { id: params.id },
        data: { status },
      });
  
      return NextResponse.json(report);
    } catch (error) {
      return NextResponse.json(
        { error: "Error updating report" },
        { status: 500 }
      );
    }
  }