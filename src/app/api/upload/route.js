import { NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import { pdfToPng } from "pdf-to-png-converter";
import path from "path";

export const config = {
    api: {
        bodyParser: false
    }
};

export async function POST(request) {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.resolve("./uploads");
    form.keepExtensions = true;

    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    const data = await new Promise((resolve, reject) => {
        form.parse(request, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

    const { pdf } = data.files;
    const pdfPath = pdf.filepath;
    const outputDir = path.resolve("./uploads");

    try {
        const pngPages = await pdfToPng(pdfPath, {
            viewportScale: 2.0,
            outputFolder: outputDir,
            outputFileMask: 'page',
            verbosityLevel: 0
        });

        return NextResponse.json({
            status: 200,
            message: "PDF converted to PNG successfully",
            pages: pngPages.map(page => ({
                pageNumber: page.pageNumber,
                path: page.path
            }))
        });
    } catch (error) {
        console.error('Error during PDF conversion:', error);
        return NextResponse.json({
            status: 500,
            message: "Error during PDF conversion",
            error: error.message
        });
    }
}
