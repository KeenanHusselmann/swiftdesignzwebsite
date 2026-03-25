#!/usr/bin/env node

import fetch from 'node-fetch';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function setupTelegramBot() {
  console.log('\n🤖 Telegram Bot Setup for Swift Designz\n');

  const botToken = await question(
    '📱 Enter your Telegram Bot Token (from BotFather): '
  );
  const webhookUrl = await question(
    '🌐 Enter your webhook URL (e.g., https://yourdomain.com/api/telegram): '
  );

  if (!botToken || !webhookUrl) {
    console.error('❌ Bot token and webhook URL are required!');
    rl.close();
    return;
  }

  console.log('\n⏳ Configuring webhook...\n');

  try {
    // Set webhook
    const setWebhookResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message'],
          drop_pending_updates: true,
        }),
      }
    );

    const setWebhookData = await setWebhookResponse.json();

    if (setWebhookData.ok) {
      console.log('✅ Webhook configured successfully!\n');
      console.log(`   URL: ${webhookUrl}\n`);
    } else {
      console.error(
        '❌ Failed to set webhook:',
        setWebhookData.description
      );
      rl.close();
      return;
    }

    // Get webhook info
    const infoResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getWebhookInfo`
    );
    const infoData = await infoResponse.json();

    if (infoData.ok) {
      console.log('📊 Webhook Info:\n');
      console.log(`   Status: ${infoData.result.url ? '✅ Active' : '⚠️ Inactive'}`);
      console.log(`   URL: ${infoData.result.url}`);
      console.log(
        `   Pending Updates: ${infoData.result.pending_update_count}`
      );
      console.log(`   Last Error: ${infoData.result.last_error_message || 'None'}`);
      console.log(`   Last Error Date: ${infoData.result.last_error_date || 'N/A'}\n`);
    }

    console.log('📝 Setup instructions:\n');
    console.log('1. Add the bot token to your .env.local file:');
    console.log(`   TELEGRAM_BOT_TOKEN=${botToken}\n`);
    console.log('2. If using Claude API, add:');
    console.log(`   ANTHROPIC_API_KEY=your_api_key\n`);
    console.log('3. Deploy your Next.js project (Vercel, Netlify, etc.)\n');
    console.log('4. Search for your bot on Telegram and send a message!\n');
    console.log('🎉 Your bot is ready to use!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  rl.close();
}

setupTelegramBot();
