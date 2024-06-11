import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    const { pdfUrl, choirId, songId } = data;

    const response = await fetch('https://convertpdftopng-547hon54wa-uc.a.run.app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pdfUrl: pdfUrl,
        choirId: choirId,
        songId: songId
      })
    });

    const result = await response.json();

    return NextResponse.json({ status: response.status, data: result });
  } catch (error) {
    return NextResponse.json({ status: 500, message: error.message });
  }
}
