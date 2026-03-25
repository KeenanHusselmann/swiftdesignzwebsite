import { NextRequest, NextResponse } from 'next/server';

// Types for Telegram API
interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  text: string;
  date: number;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

// Store your bot token here - use environment variable!
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send a message to a Telegram chat
 */
async function sendMessage(
  chatId: number,
  text: string,
  replyToMessageId?: number
): Promise<void> {
  const response = await fetch(`${BOT_API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_to_message_id: replyToMessageId,
      parse_mode: 'HTML',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Telegram API error: ${JSON.stringify(error)}`);
  }
}

/**
 * Get AI response (connect to Claude API here)
 */
async function getAIResponse(userMessage: string): Promise<string> {
  try {
    // TODO: Connect to Claude API or your preferred AI service
    // For now, return a simple response
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
        system: `You are Swift Designz assistant - a helpful, professional AI supporting Keenan's freelance business. 
Swift Designz provides: web development, e-commerce solutions, app/software development, PM training, and AI training.
Be concise, friendly, and professional. Brand colors: teal (#30B0B0), dark gray (#303030).`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return "Sorry, I couldn't process that request. Please try again later.";
    }

    const data = await response.json();
    return data.content[0].text || 'No response generated';
  } catch (error) {
    console.error('AI response error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}

/**
 * Handle incoming Telegram messages
 */
async function handleUpdate(update: TelegramUpdate): Promise<void> {
  const message = update.message;

  if (!message || !message.text) {
    return;
  }

  const chatId = message.chat.id;
  const userId = message.from.id;
  const userName = message.from.first_name || 'User';
  const userMessage = message.text;

  console.log(`[Telegram] Message from ${userName} (${userId}): ${userMessage}`);

  // Send typing indicator
  await fetch(`${BOT_API_URL}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      action: 'typing',
    }),
  }).catch(console.error);

  try {
    // Get AI response
    const aiResponse = await getAIResponse(userMessage);

    // Send response back
    await sendMessage(chatId, aiResponse, message.message_id);
  } catch (error) {
    console.error('Error processing message:', error);
    await sendMessage(
      chatId,
      '❌ Sorry, I encountered an error processing your message. Please try again.',
      message.message_id
    ).catch(console.error);
  }
}

/**
 * POST handler for webhook
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const update: TelegramUpdate = await request.json();

    // Process the update
    await handleUpdate(update);

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 200 });
  }
}

/**
 * GET handler for testing/info
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'Telegram bot webhook is active',
    endpoint: '/api/telegram',
  });
}
