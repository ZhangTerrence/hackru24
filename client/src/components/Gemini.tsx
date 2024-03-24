import { GoogleGenerativeAI } from "@google/generative-ai"
import React, {useState} from "react"
import { render } from "react-dom"
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

export default function Gemini() {
  async function queryGemini(data: string | File, text: boolean) {
    const apiKey = import.meta.env.VITE_GEMINI_API;
    const gemini = new GoogleGenerativeAI(apiKey);
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });

    
    const [docUploaded, setDocUploaded] = useState(false)
    const [pdfFile, setPdfFile] = useState(new Uint8Array())

    async function queryGemini(data: string) {
        const apiKey = import.meta.env.VITE_GEMINI_API
        const gemini = new GoogleGenerativeAI(apiKey)
        const model = gemini.getGenerativeModel({ model: "gemini-pro"})

    const prompt = "Please review my resume for me: " + data;
    // const prompt = data
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
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
    
    async function parseData(event: React.FormEvent) {
        event.preventDefault()
        const file = (document.getElementById('res-sub') as HTMLInputElement).files?.[0]
        console.log(file)
        if (!file) {
            alert('Please select a file to upload')
            return
        }
        if(file?.type == "text/plain") {
            const data = await file.text()
            console.log(data)
            await queryGemini(data)
        } else {
            
            const buf = await file.arrayBuffer()
            const data = new Uint8Array(buf)
            setPdfFile(data)
            setDocUploaded(true)            
            //await queryGemini(file, false)
        }     
        // await queryGemini(data)
    }
    // await queryGemini(data)
  }

    return <>
        <form onSubmit={parseData}>
            <label htmlFor="resume-submit">Upload your resume:</label>
            <input type="file" className="resume-submit" id="res-sub" name="resume-submit" accept=".txt, .pdf" />
            <button type="submit">Submit</button>
        </form>
        {docUploaded ?<>
        <Document file={{data: pdfFile}}>
                <Page pageNumber={1} onLoadSuccess={async (page) => {
            console.log('SUCCESS LOAD')
            // console.log(page.getTextContent())
            var textObj = await page.getTextContent()
            var text = textObj.items.map((s) => s.str).join("")
            // console.log(text)
            await queryGemini(text)
            }}/>
            </Document>
        
        </>
            : null}
            
        </>
}
