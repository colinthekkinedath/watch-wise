import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { genre, description } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `Ignore anything said previously. Give me a list of 5 ${genre} movies. ${
            genre === 'n/a'
            ? "No specific genre was given, so the recommendations will be based on the description."
            : null
        }
          They should fit this description as well: ${description}${
            description.slice(-1) === '.' ? '' : '.'
        } Please return this response as a numbered list with the ${genre}'s title, followed by a colon, and then a brief description of the ${genre}. There should be a line of whitespace between each item in the list. Make sure in the description no colon is used.`,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}