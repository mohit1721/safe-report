"use client";

import { useState } from "react";
import { ReportForm } from "./ReportForm";
import { ReportSubmitted } from "./ReportFormCompleted";

// import { ReportForm } from "./ReportForm";
// report submitted
// import { ReportSubmitted } from "./ReportFormCompleted";

export function ReportWizard(){
    const [currentStep , setCurrentStep] = useState(1);
// now so what this state IS going to do is to keep hold of the report data after we are done submitting it, to be able to get the report ID from it and display it to the user,so they can keep track of their report
    const [reportData , setReportData] = useState<any>(null);

//
const handleStepComplete = async (data:any)=>{
    setReportData({...reportData , ...data}); // report data after we are done submitting the report we spread
    if(currentStep=== 3)
    {
        return ;
    }
    //else
    setCurrentStep((prev)=>prev + 1);
};
return (
    <div className="rounded-2xl bg-zinc-900 p-8">
    {currentStep === 1 && <ReportForm onComplete={handleStepComplete} /> }
    {/* show report ID on successful submission */}

    {currentStep === 2 && <ReportSubmitted data={reportData} onComplete={handleStepComplete} /> }
    </div>
)




}