"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Report, ReportStatus, ReportType } from "@prisma/client";
import { signOut } from "next-auth/react";
// import Image from "next/image";

//import 'video-react/dist/video-react.css';
// import {
//   BigPlayButton,
//   ControlBar,
//   CurrentTimeDisplay,
//   ForwardControl,
//   PlayToggle,
//   PlaybackRateMenuButton,
//   Player,
//   ReplayControl,
//   TimeDivider,
//   VolumeMenuButton
// } from "@types/video-react";
export default function Dashboard(){
    const { data: session } = useSession();
    const [reports, setReports] = useState<Report[]>([]);
    const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
    const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
    const [isLoading, setIsLoading] = useState(true);

    /*
    get reports the report that we have
in the app. for the aünin
    */
    const fetchReports = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/reports");
          const data = await response.json();
          setReports(data);
        } catch (error) {
          console.error("Error fetching reports:", error);
        } finally {
          setIsLoading(false);
        }
      };

    useEffect(() => {
        fetchReports();
      }, []);

      const updateReportStatus = async (
        reportId: string,
        newStatus: ReportStatus
      ) => {
        try {
          const response = await fetch(`/api/reports/${reportId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: newStatus }),
          });
    
          if (response.ok) {
            fetchReports();
          }
        } catch (error) {
          console.error("Error updating report:", error);
        }
      };
      const filteredReports = reports?.filter((report) => {
        const statusMatch = filter === "ALL" || report.status === filter;
        const typeMatch = typeFilter === "ALL" || report.type === typeFilter;
        return statusMatch && typeMatch;
      });
    
    

      const getStatusColor = (status: ReportStatus) => {
        const colors = {
          PENDING: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
          IN_PROGRESS: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
          RESOLVED: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
          DISMISSED:
            "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
        };
        return colors[status];
      };
    
      if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-black text-white">
          <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <div className="flex items-center gap-6">
                  <span className="text-neutral-400">
                    {session?.user?.name || "Admin"}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-neutral-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </nav>
    
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as ReportStatus | "ALL")
                  }
                  className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                >
                  <option value="ALL">All Statuses</option>
                  {Object.values(ReportStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
    
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as ReportType | "ALL")
                  }
                  className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                >
                  <option value="ALL">All Types</option>
                  {Object.values(ReportType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
    
              <div className="text-neutral-400">
                {filteredReports.length} Reports
              </div>
            </div>
    
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 ">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all"
                >
                  <div className="flex justify-between items-start gap-6">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-medium text-neutral-200">
                          {report.title}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                          </div>
                          {report.type}
                        </span>
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                          </div>
                          {report.location || "N/A"}
                        </span>
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-neutral-800 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-neutral-600"></div>
                          </div>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {report.image && (
                        <img
                          src={report.image}
                          alt="Report"
                          className="mt-4 object-cover rounded-lg w-[20rem] h-[20rem] border border-neutral-800"
                        />
                      )}
             {/* {report?.video ? (
  <video
  src={`${report?.video}`}
    controls
    className="mt-4 object-cover rounded-lg w-[200px] lg:w-[20rem] h-auto lg:h-[20rem] border border-neutral-800"
  />
) : (
  <p className="text-neutral-500">Video not available</p>
)} */}

{/* react-video */}


{/* 
 {report.files && report.files.length > 0 && (
         <div className="mt-4">
         <h3 className="font-medium text-neutral-200">Download Evidence Files</h3>
         <div className="space-y-2">
           {report.files.map((file) => (
             <a
               key={file.id}
               href={file.filePath}
               download
               className="text-blue-500 hover:underline"
             >
               {file.fileType.toUpperCase()} File
             </a>
           ))}
         </div>
       </div>
          )}
 */}
 
{/*  
{report.files && report.files.length > 0 && (
  <div>
    {report.files.map((file) => (
      <div key={file.id}>
        <a
          href={file.filePath}  // File path or URL
          download
          className="mt-4 text-blue-500 hover:underline"
        >
          Download {file.fileType === 'application/pdf' ? 'PDF' : 'Document'}
        </a>
      </div>
    ))}
  </div>
)} */}

                    </div>
                    <select
                      value={report.status}
                      onChange={(e) =>
                        updateReportStatus(
                          report.id,
                          e.target.value as ReportStatus
                        )
                      }
                      className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                    >
                      {Object.values(ReportStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
    
              {filteredReports.length === 0 && (
                <div className="text-center py-12 text-neutral-500 bg-neutral-900/50 rounded-xl border border-neutral-800">
                  No reports found matching the selected filters.
                </div>
              )}
            </div>

 


          </main>
        </div>
      );

}

/*
react-video




{report?.video ? (
      //use video player -npm i video-react
      <Player  
      // ref={`${report?.video}`}
      aspectRatio="16:9"
      playsInline
      src={`${report?.video}`}
      >  
  <BigPlayButton position="center" />        
      <ControlBar>
      <ReplayControl seconds={10} order={1.1} />
      <ForwardControl seconds={30} order={1.2} />
      <PlayToggle />
      <CurrentTimeDisplay order={4.1} />
    
      <TimeDivider order={4.2} />
    
      <PlaybackRateMenuButton
      rates={[0.75, 1, 1.25, 1.5, 1.75, 2]}
      order={7.1}/>
      <VolumeMenuButton />
    </ControlBar>
    </Player>
    ) : (
      <p className="text-neutral-500">Video not available</p>
    )}
    

*/
