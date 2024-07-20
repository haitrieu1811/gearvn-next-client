export async function POST(request: Request) {
  const body = await request.json()
  const accessToken = body.accessToken as string
  return Response.json(body, {
    status: 200,
    headers: {
      'Set-Cookie': `accessToken=${accessToken}; Path=/; HttpOnly;`
    }
  })
}
