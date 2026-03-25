# Telegram Bot Setup Guide for Swift Designz

A complete guide to connect your Telegram bot to your Next.js application and chat with Claude AI from your phone.

## 📋 Prerequisites

- ✅ Bot token from BotFather
- ✅ Next.js project deployed (Vercel, Netlify, etc.) or running locally with ngrok
- ✅ Claude API key (optional, but recommended for AI responses)

## 🚀 Quick Start

### Step 1: Add Environment Variables

Create or update `.env.local` in your project root:

```bash
# Required
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Optional - for Claude AI responses
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Step 2: Deploy Your Project

Make sure your Next.js project is deployed and accessible via HTTPS:
- **Vercel**: Automatically deployed when you push to GitHub
- **Netlify**: Connect your GitHub repo for auto-deployment
- **Custom Server**: Use ngrok for local testing: `ngrok http 3000`

Your webhook URL will be: `https://your-domain.com/api/telegram`

### Step 3: Configure Webhook

Run the setup script:

```bash
node scripts/setup-telegram-bot.mjs
```

Or manually configure with curl:

```bash
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/telegram"}'
```

### Step 4: Test Your Bot

1. Find your bot on Telegram (search by bot username)
2. Send a message
3. Your bot should reply with Claude's response!

## 🔧 Configuration Options

### Message Parsing

The bot supports HTML formatting in responses. Customize the system prompt in `route.ts`:

```typescript
system: `You are Swift Designz assistant...`
```

### Typing Indicator

The bot shows a "typing" indicator while processing. Disable in `route.ts` if not needed.

### Error Handling

- Messages that fail to process return an error message to the user
- Check server logs for debugging

## 📱 How It Works

```
User Message (Telegram)
    ↓
Webhook POST to /api/telegram
    ↓
Parse Telegram Update
    ↓
Send to Claude API
    ↓
Format Response
    ↓
Send Message Back via Telegram API
```

## 🐛 Troubleshooting

### Bot not responding

1. **Check webhook status:**
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
   ```

2. **Verify environment variables:**
   ```bash
   echo $TELEGRAM_BOT_TOKEN
   ```

3. **Check server logs for errors**

### "Webhook URL is invalid"

- Must use HTTPS (not HTTP)
- Must be publicly accessible
- Must have valid SSL certificate
- Try using ngrok for local testing

### Bot not using Claude API

- Verify `ANTHROPIC_API_KEY` is set
- Check Claude API integration in `route.ts`
- Review server logs for API errors

## 📊 Webhook Info Example

```json
{
  "ok": true,
  "result": {
    "url": "https://your-domain.com/api/telegram",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "ip_address": "123.45.67.89",
    "last_synchronization_error_date": 0
  }
}
```

## 🔐 Security Notes

- Never commit `TELEGRAM_BOT_TOKEN` or `ANTHROPIC_API_KEY` to git
- Use `.env.local` or platform-specific secret management
- Bot token is sensitive - regenerate if compromised (BotFather → Edit Bot → API Token)

## 📚 Useful Links

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Claude API Docs](https://docs.anthropic.com/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 💡 Advanced Features (Coming Soon)

- Message history/conversation context
- Inline keyboard buttons
- File/image handling
- User authentication
- Rate limiting
- Analytics tracking

## 📧 Support

For issues or questions, contact: keenan@swiftdesignz.co.za
