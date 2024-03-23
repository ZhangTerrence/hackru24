import { GoogleGenerativeAI } from "@google/generative-ai"
import * as pdfjsLib from "react-pdf"

export default function Gemini() {

    async function queryGemini(data: string | File, text: boolean) {
        const apiKey = import.meta.env.VITE_GEMINI_API
        const gemini = new GoogleGenerativeAI(apiKey)
        const model = gemini.getGenerativeModel({ model: "gemini-pro"})

        // console.log(data)
        // console.log(apiKey)

        const prompt = "Please review my resume for me: " + data
        // const prompt = data
        const result = await model.generateContent(prompt)
        const response = await result.response
        console.log(response.text())
        console.log("Completed")

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
            // await queryGemini(data, true)
        } else {
            pdfjsLib.pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'
            const buf = await file.arrayBuffer()
            const data = new Uint8Array(buf)

            var doc = await pdfjsLib.pdfjs.getDocument(data).promise

            const pageList = await Promise.all(Array.from({ length: doc.numPages }, (_, i) => doc.getPage(i + 1)))
            const textList = await Promise.all(pageList.map((p) => p.getTextContent()))
            console.log(textList.map(({ items }) => items.map((str) => str).join("")).join(""))
            
            
            //await queryGemini(file, false)
        }     
        // await queryGemini(data)
    }




    return <form onSubmit={parseData}>
        <label htmlFor="resume-submit">Upload your resume:</label>
        <input type="file" className="resume-submit" id="res-sub" name="resume-submit" accept=".txt, .pdf, .doc, .docx" />
        <button type="submit">Submit</button>
        </form>
}