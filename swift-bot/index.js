import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { Octokit } from '@octokit/rest';

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'KeenanHusselmann';
const GITHUB_REPO = process.env.GITHUB_REPO || 'swiftdesignzwebsite';
const ALLOWED_USER_ID = process.env.ALLOWED_TELEGRAM_USER_ID;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// --- Telegram helpers ---

async function sendMessage(chatId, text) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
}

async function sendTyping(chatId) {
  await fetch(`${TELEGRAM_API}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  }).catch(() => {});
}

// --- GitHub helpers ---

async function getFile(path) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path,
    });
    const content = Buffer.from(data.content, 'base64').toString('utf8');
    return { content, sha: data.sha };
  } catch {
    return null;
  }
}

async function writeFile(path, content, sha, message) {
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
  });
}

// --- Core logic ---

async function handleInstruction(instruction, chatId) {
  await sendTyping(chatId);

  // Step 0: Ask Claude if this is a code instruction or casual chat
  const intentResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    system: `You are Swift Bot, an assistant for Keenan at Swift Designz.
You can have casual conversations AND edit the Swift Designz website codebase.
Decide if the user's message is:
- A CODE instruction (wants to change/edit/update the website)
- CHAT (greeting, question, casual conversation)

If CHAT, respond naturally and helpfully as Swift Bot.
If CODE, respond with ONLY this JSON (no other text):
{
  "type": "code",
  "files": ["path/to/file1"],
  "summary": "one line describing what you will change"
}`,
    messages: [{ role: 'user', content: instruction }],
  });

  const responseText = intentResponse.content[0].text.trim();

  // Check if it's a code instruction
  let plan;
  try {
    const parsed = JSON.parse(responseText);
    if (parsed.type === 'code') {
      plan = parsed;
    }
  } catch {
    // Not JSON — it's a chat response, send it directly
  }

  if (!plan) {
    await sendMessage(chatId, responseText);
    return;
  }

  await sendMessage(chatId, `🔍 <b>${plan.summary}</b>\n\nReading files...`);

  await sendMessage(chatId, `Reading ${plan.files.length} file(s)...`);

  // Step 2: Read the files from GitHub
  const fileData = {};
  for (const filePath of plan.files) {
    const file = await getFile(filePath);
    if (file) {
      fileData[filePath] = file;
    } else {
      await sendMessage(chatId, `⚠️ Could not find file: <code>${filePath}</code>`);
    }
  }

  if (Object.keys(fileData).length === 0) {
    await sendMessage(chatId, '❌ No files could be read. Aborting.');
    return;
  }

  // Step 3: Ask Claude to make the changes
  await sendTyping(chatId);
  await sendMessage(chatId, '✏️ Generating changes...');

  const fileContext = Object.entries(fileData)
    .map(([path, { content }]) => `=== ${path} ===\n${content}`)
    .join('\n\n');

  const editResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    system: `You are a code editing assistant for the Swift Designz Next.js website.
Given the current file contents and an instruction, respond with ONLY a JSON array:
[
  {
    "path": "path/to/file",
    "content": "full updated file content here",
    "commitMessage": "short commit message"
  }
]
Return the COMPLETE file content, not just the diff. Only include files that actually changed.`,
    messages: [
      {
        role: 'user',
        content: `Instruction: ${instruction}\n\nCurrent files:\n${fileContext}`,
      },
    ],
  });

  let edits;
  try {
    edits = JSON.parse(editResponse.content[0].text);
  } catch {
    await sendMessage(chatId, '❌ Could not generate edits. Try a more specific instruction.');
    return;
  }

  // Step 4: Commit each changed file
  for (const edit of edits) {
    await sendTyping(chatId);
    const original = fileData[edit.path];
    if (!original) {
      await sendMessage(chatId, `⚠️ Skipping unknown file: <code>${edit.path}</code>`);
      continue;
    }
    await writeFile(edit.path, edit.content, original.sha, edit.commitMessage);
    await sendMessage(chatId, `✅ Committed: <code>${edit.path}</code>\n<i>${edit.commitMessage}</i>`);
  }

  await sendMessage(chatId, '🚀 Done! Netlify will auto-deploy the changes shortly.');
}

// --- Webhook handler ---

app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // Acknowledge immediately

  const message = req.body?.message;
  if (!message || !message.text) return;

  const chatId = message.chat.id;
  const userId = String(message.from.id);
  const text = message.text;

  // Security: only allow the owner
  if (ALLOWED_USER_ID && userId !== ALLOWED_USER_ID) {
    await sendMessage(chatId, '⛔ Unauthorised.');
    return;
  }

  if (text === '/start') {
    await sendMessage(
      chatId,
      '👋 <b>Swift Designz Code Bot</b>\n\nSend me an instruction and I\'ll edit your codebase and commit it to GitHub.\n\nExample:\n<i>"Change the hero heading on the home page to say Welcome to Swift Designz"</i>'
    );
    return;
  }

  try {
    await handleInstruction(text, chatId);
  } catch (err) {
    console.error(err);
    await sendMessage(chatId, `❌ Error: ${err.message}`);
  }
});

app.get('/', (req, res) => res.json({ status: 'Swift Bot is running' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Swift Bot running on port ${PORT}`));
