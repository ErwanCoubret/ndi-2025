export async function POST(req: Request) {
  const body = (await req.json())

  const response = await fetch("http://fastapi:8001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return Response.json(data);
}
