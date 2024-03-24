import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../css/Gemini.css"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Gemini() {
  const [docUploaded, setDocUploaded] = useState(false);
  const [pdfFile, setPdfFile] = useState(new Uint8Array());
  const [responseText, setResponseText] = useState("");
  const [responseTextGen, setResponseTextGen] = useState(false);

  async function queryGemini(data: string) {
    setDocUploaded(false)
    const apiKey = import.meta.env.VITE_GEMINI_API;
    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });

    // console.log(data)
    // console.log(apiKey)

    const prompt = "Please review my resume for me: " + data;
    // const prompt = data
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // console.log(response.text());
    setResponseText(response.text());
    console.log(responseText);
    setResponseTextGen(true);
    console.log("Completed");
  }

  async function parseData(event: React.FormEvent) {
    event.preventDefault();
    const file = (document.getElementById("res-sub") as HTMLInputElement)
      .files?.[0];
    console.log(file);
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    if (file?.type == "text/plain") {
      const data = await file.text();
      console.log(data);
      await queryGemini(data);
    } else {
      const buf = await file.arrayBuffer();
      const data = new Uint8Array(buf);
      setPdfFile(data);
      setDocUploaded(true);
      //await queryGemini(file, false)
    }
    // await queryGemini(data)
  }

  async function handleDrop(event: React.DragEvent) {
    console.log("file dropped");
    event.preventDefault();
    if (event.dataTransfer.items) {
        if (event.dataTransfer.items[0].kind === "file") {
          const file = event.dataTransfer.items[0].getAsFile();
          console.log(`file[0].name = ${file?.name}`);
        }
      };
    }
  }

  async function handleDragOver(event: React.DragEvent) {
    console.log("File in the drop zone");
    event.preventDefault();
  }

  return (
    <>
      <div 
        id="drop_zone" 
        onDrop={(handleDrop)} 
        onDragOver={handleDragOver} 
        style={{ border: "2px dashed #aaa", padding: "20px", borderRadius: "1rem" }}>
        <p>Drag and drop your resume as a .pdf or .txt</p>
      </div>
      <form onSubmit={parseData}>
        <label htmlFor="resume-submit">or upload your resume: </label>
        <input
          type="file"
          className="resume-submit"
          id="res-sub"
          name="resume-submit"
          accept=".txt, .pdf"
        />
        <button type="submit">Submit</button>
      </form>
      {docUploaded ? (
        <>
          <Document file={{ data: pdfFile }}>
            <Page
              pageNumber={1}
              onLoadSuccess={async (page) => {
                console.log("SUCCESS LOAD");
                // console.log(page.getTextContent())
                const textObj = await page.getTextContent();
                const text = textObj.items.map((s) => s.str).join("");
                // console.log(text)
                await queryGemini(text);
              }}
            />
          </Document>
        </>
      ) : null}

      {responseTextGen ? (
        <div className="gemini-resp">{responseText}</div>
      ) : null}
    </>
  );
}
