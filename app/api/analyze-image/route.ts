import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request){
    try {
        const { image } = await request.json();
        const base64Data = image.split(",")[1];
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points: 

        TITLE: Write a clear, brief title  
        TYPE: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
        DESCRIPTION: Write a clear, concise description`;
        const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
              },
            },
          ]);
          const text = await result.response.text(); // Ensure text() is awaited
    // Parse the response more precisely
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const typeMatch = text.match(/TYPE:\s*(.+)/);
    const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

    return NextResponse.json({
        title: titleMatch?.[1]?.trim() || "",
        reportType: typeMatch?.[1]?.trim() || "",
        description: descMatch?.[1]?.trim() || "",
      });

    } catch (error) {
        console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
    }
}

/*
//for multiple images
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const { images } = await request.json(); // Expecting an array of images

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { error: "No images provided or invalid format" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const results = await Promise.all(
            images.map(async (imageBase64: string) => {
                try {
                    const base64Data = imageBase64.split(",")[1];

                    const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points: 

                    TITLE: Write a clear, brief title  
                    TYPE: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
                    DESCRIPTION: Write a clear, concise description`;

                    const result = await model.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: "image/jpeg",
                            },
                        },
                    ]);

                    const text = await result.response.text();

                    // Parse the response
                    const titleMatch = text.match(/TITLE:\s*(.+)/);
                    const typeMatch = text.match(/TYPE:\s*(.+)/);
                    const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

                    return {
                        title: titleMatch?.[1]?.trim() || "",
                        reportType: typeMatch?.[1]?.trim() || "",
                        description: descMatch?.[1]?.trim() || "",
                    };
                } catch (imageError) {
                    console.error("Error analyzing image:", imageError);
                    return { error: "Failed to analyze this image" };
                }
            })
        );

        return NextResponse.json({ results });
    } catch (error) {
        console.error("Error analyzing images:", error);
        return NextResponse.json(
            { error: "Failed to analyze images" },
            { status: 500 }
        );
    }
}




*/