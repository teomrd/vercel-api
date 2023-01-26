export default function handler(request, response) {
  const { name = "World" } = request.query;

  response.status(200).json({
    hello: name
  });
}
