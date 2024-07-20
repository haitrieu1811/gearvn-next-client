export async function POST(request: Request) {
  const body = await request.json()
  return Response.json(
    {
      message: 'Logout successfully.'
    },
    {
      status: 200,
      headers: {
        'Set-Cookie': `accessToken=; Path=/; HttpOnly; Max-Age=0`
      }
    }
  )
}
