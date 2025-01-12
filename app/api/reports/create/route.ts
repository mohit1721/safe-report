import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// const enum ReportType {
//   EMERGENCY,
//   NON_EMERGENCY
// }


export async function POST(request: Request )
{
  

    try {
        
        const {
            reportId,
            type,
            specificType,
            title,
            description,
            location,
            latitude,
            longitude,
            image,
            video,
            status
            
          } = await request.json();
      

          const report = await prisma.report.create({
            data: {
              reportId,
              type : type || "EMERGENCY",    
              title,
              description,
              reportType: specificType,
              location,
              latitude: latitude || null,
              longitude: longitude || null,
              image: image || null,
              video:video || null,
              status: status || "PENDING",
              
            },
          });
          return NextResponse.json({
            success: true,
            reportId: report.reportId,
            message: "Report submitted successfully",
          });


    } catch (error) {
        console.error("Error creating report:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit report",
      },
      { status: 500 }
    );
    }

}
/*
This code defines an API route that handles the creation of a new report in the database. It:

Extracts the report details from the request body.
Creates a new report record in the database using Prisma.
Returns a success message with the report's ID if the creation is successful.
*/


// --
// import { NextResponse } from "next/server";
// // import { IncomingForm } from "formidable";
// import path from "path";
// import fs from "fs";
// import prisma from "@/lib/prisma"; // Adjust this path if necessary
// import IncomingForm from "formidable";

// // Extending the type definition for Formidable if needed
// declare module "formidable" {
//   interface IncomingForm {
//     keepExtensions: boolean;
//   }
// }

// export async function POST(request: Request) {
//   // Create a new instance of IncomingForm using the formidable function
//   const form = formidable({
//     uploadDir: path.join(process.cwd(), "/public/uploads"), // Set the upload directory
//     keepExtensions: true, // Retain the original file extensions
//   });

//   return new Promise((resolve, reject) => {
//     form.parse(request, async (err: any, fields: { reportId: any; type: any; specificType: any; title: any; description: any; location: any; latitude: any; longitude: any; image: any; video: any; status?: "PENDING" | undefined; }, files: { files: any[]; }) => {

//       if (err) {
//         console.error("Error parsing form:", err);
//         return reject(
//           NextResponse.json(
//             { success: false, error: "Failed to parse form data" },
//             { status: 500 }
//           )
//         );
//       }

//       try {
//         // Assuming files are in files.files and can be processed
//         const uploadedFiles = (files.files as any[]).map((file: any) => ({
//           filePath: file.filepath, // Path to the uploaded file
//           fileType: file.mimetype, // MIME type of the file
//         }));

//         const {
//           reportId,
//           type,
//           specificType,
//           title,
//           description,
//           location,
//           latitude,
//           longitude,
//           image,
//           video,
//           status = "PENDING",
//         } = fields;

//         // Create a new report in the database
//         const report = await prisma.report.create({
//           data: {
//             reportId,
//             type: type || "EMERGENCY",
//             title,
//             description,
//             reportType: specificType,
//             location,
//             latitude: latitude || null,
//             longitude: longitude || null,
//             image: image || null,
//             video: video || null,
//             status,
//             files: uploadedFiles.length
//               ? {
//                   create: uploadedFiles.map((file) => ({
//                     filePath: file.filePath,
//                     fileType: file.fileType,
//                   })),
//                 }
//               : undefined,
//           },
//         });

//         return resolve(
//           NextResponse.json({
//             success: true,
//             reportId: report.reportId,
//             message: "Report submitted successfully",
//           })
//         );
//       } catch (error) {
//         console.error("Error creating report:", error);
//         return reject(
//           NextResponse.json(
//             {
//               success: false,
//               error: "Failed to submit report",
//             },
//             { status: 500 }
//           )
//         );
//       }
//     });
//   });
// // }
// function formidable(arg0: {
//   uploadDir: string; // Set the upload directory
//   keepExtensions: boolean;
// }) {
//   throw new Error("Function not implemented.");
// }



// --- cloudinary
// import { NextResponse } from "next/server";
// // import formidable from "formidable";
// import prisma from "@/lib/prisma"; // Adjust this path if necessary
// import { cloudinaryConnect } from "@/utils/cloudinary";
// import { v2 as cloudinary , UploadApiResponse } from 'cloudinary';
// // import { IncomingMessage } from "node:http";
// // API Route: POST /api/reports/create
// import { extname, join } from "path";

// export async function POST(request: Request) {
//   try {
//     // Initialize Cloudinary connection
//     cloudinaryConnect();
// console.log("cloudinary connected")
//     // Parse the incoming request as FormData
//     const formData = await request.formData();
//     console.log("form req from fe-> ", formData)
//     // Retrieve file from formData (assuming the field name is 'file')
//     const file = formData.get("file") as Blob | null;
//     const filename = formData.get("fileName") as string | null; // Get file name from formData

//     if (!file || !filename) {
//       return NextResponse.json(
//         { error: "File and fileName are required." },
//         { status: 400 }
//       );
//     }

//     // Convert the file Blob into a buffer
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // Sanitize the filename (to prevent issues with special characters)
//     const uniqueFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.]/g, "_")}${extname(filename)}`;

//     // Upload the file to Cloudinary
//     const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { folder: "reports" }, // Cloudinary folder
//         (error, result) => {
//           if (error) {
//             reject(error);
//           }
//           resolve(uploadResult); // This result will now be typed as UploadApiResponse
//         }
//       ).end(buffer);
//     });

//     // Ensure the result is valid
//     const filePath = uploadResult?.secure_url || ""; // Cloudinary URL of the uploaded file
//     const uploadedFileType = uploadResult?.resource_type || ""; // MIME type (image, video, etc.)

//     // Save the report data to the database using Prisma
//     const {
//       reportId,
//       type,
//       specificType,
//       title,
//       description,
//       location,
//       latitude,
//       longitude,
//       image,
//       video,
//       status = "PENDING",
//     } = Object.fromEntries(formData.entries());

//     const report = await prisma.report.create({
//       data: {
//         reportId,
//         type: type || "EMERGENCY",
//         title,
//         description,
//         reportType: specificType,
//         location,
//         latitude: latitude || null,
//         longitude: longitude || null,
//         image: image || null,
//         video: video || null,
//         status,
//         files: filePath
//           ? {
//               create: [
//                 {
//                   filePath: filePath, // File uploaded to Cloudinary
//                   fileType: uploadedFileType, // Resource type (e.g., image, video)
//                 },
//               ],
//             }
//           : undefined,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       reportId: report.reportId,
//       message: "Report submitted successfully",
//     });
//   } catch (error) {
//     console.error("Error creating report:", error);
//     return NextResponse.json(
//       { error: "Failed to submit report" },
//       { status: 500 }
//     );
//   }
// }