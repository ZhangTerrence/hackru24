import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../css/Gemini.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Gemini({ setReqLang }) {
  const [docUploaded, setDocUploaded] = useState(false);
  const [pdfFile, setPdfFile] = useState(new Uint8Array());
  const [responseText, setResponseText] = useState("");
  const [responseTextGen, setResponseTextGen] = useState(false);

  async function queryGemini(data: string) {
    setDocUploaded(false);
    const apiKey = import.meta.env.VITE_GEMINI_API;
    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });

    // console.log(data)
    // console.log(apiKey)

    const prompt =
      "Please review my resume for me: " +
      data +
      " Finally, based on this resume, please list a few programming languages that I use in the format Languages:{Language, Language, Language}. ";
    // const prompt = data
    const result = await model.generateContent(prompt);
    const response = await result.response;
    setResponseText(response.text());
    const position = response.text().split(":");
    const length = position[position.length - 1];
    console.log(length);

    const array = length.split(/[*,;-]/).map((e) => e.trim());
    array[0].substring(1, array[0].length - 1);

    console.log(array);
    setReqLang(array);

    console.log(responseText);

    setResponseTextGen(true);
    console.log("Completed");
  }

  async function parseData(event: React.FormEvent) {
    event.preventDefault();
    setDocUploaded(false);
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
      setDocUploaded(true); //await queryGemini(file, false)
    }
  }

  async function handleDrop(event: React.DragEvent) {
    console.log("file dropped");
    event.preventDefault();
    if (event.dataTransfer.items) {
      if (event.dataTransfer.items[0].kind === "file") {
        const file = event.dataTransfer.items[0].getAsFile();
        if (!file) {
          alert("Please select a file to upload");
          return;
        }
        console.log(`file[0].name = ${file?.name}`);
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
      }
    }
  }

  async function handleDragOver(event: React.DragEvent) {
    console.log("File in the drop zone");
    event.preventDefault();
  }

  return (
    <>
      {docUploaded ? (
        <>
          <Document file={{ data: pdfFile }}>
            <Page
              pageNumber={1}
              onLoadSuccess={async (page) => {
                console.log("SUCCESS LOAD");

                const textObj = await page.getTextContent();
                const text = textObj.items.map((s) => s.str).join("");
                await queryGemini(text);
              }}
            />
          </Document>
        </>
      ) : (
        <div>
          <div
            id="drop_zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              border: "2px dashed #aaa",
              padding: "20px",
              borderRadius: "1rem",
            }}
          >
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
        </div>
      )}

      {responseTextGen ? (
        <div className="gemini-resp">
          <pre>{responseText}</pre>
        </div>
      ) : null}
    </>
  );
}
