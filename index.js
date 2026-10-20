// =============================================================
// Telegram Bot — Cloudflare Worker + D1
// نسخه‌ی نهایی با ADMIN_ID و WEBHOOK_SECRET
// =============================================================

const LANGUAGES = {
  fa: { name: "🇮🇷 فارسی" },
  en: { name: "🇬🇧 English" },
  zh: { name: "🇨🇳 中文" },
  fr: { name: "🇫🇷 Français" },
};

const TEXTS = {
  fa: {
    select_language: "🌐 <b>لطفاً زبان مورد نظر خود را انتخاب کنید:</b>",
    lang_changed: "✅ زبان ربات با موفقیت تغییر یافت.",
    welcome: "🤖 <b>به پنل مدیریت ربات پیشرفته خوش آمدید.</b>",
    unauthorized: "❌ شما دسترسی به مدیریت این ربات را ندارید.",
    start_send: "⏳ عملیات ارسال آغاز شد...",
    end_send: "✅ عملیات ارسال با موفقیت پایان یافت.",
    empty_target: "❌ لیست گروه‌های هدف خالی است! ابتدا با /addtarget گروه‌ها را مشخص کنید.",
    invalid_idx: "❌ شناسه یا آیدی عددی وارد شده اشتباه یا نامعتبر است.",
    flow_step1: "🎯 <b>مرحله اول:</b> لطفاً آیدی‌های عددی کاربران را با فاصله از هم بفرستید:\nمثال: <code>12345 67890</code>\n\n🛑 برای توقف: /cancelflow",
    flow_step2: "🔢 <b>مرحله دوم:</b> تعداد پیام‌های ارسالی برای فلود را وارد کنید:\n\n🛑 برای توقف: /cancelflow",
    flow_step3: "📝 <b>مرحله سوم:</b> نوع متن را مشخص کنید:",
    flow_custom_prompt: "💬 متن سفارشی خود را برای فلود ارسال کنید:",
    flow_cancelled: "🛑 عملیات تگ‌فلو متوقف شد.",
    flow_cancel_no_active: "❌ هیچ عملیات تگ‌فلو فعالی برای توقف وجود ندارد.",
    flow_already_running: "⚠️ یک عملیات تگ‌فلو در حال اجراست. ابتدا با /cancelflow متوقف کنید.",
    flow_cancel_requested: "🛑 درخواست توقف ثبت شد؛ در حال متوقف کردن...",
    btn_custom: "✍️ متن سفارشی جدید",
    btn_periodic: "🔄 استفاده دوره‌ای از کلیپ‌بورد",
    btn_periodic_flow: "🎲 انتخاب دوره‌ای از کلیپ‌بورد",
    clipboard_empty: "❌ کلیپ‌بورد شما خالی است!",
    cancelled: "❌ لغو شد.",
    count_must_be_number: "❌ تعداد وارد شده باید عدد باشد. لغو شد.",
    invalid_ids: "❌ آیدی‌ها نامعتبر بودند. لغو شد.",
    help: "👑 <b>تنظیمات مدیریتی:</b>\n🔹 <code>/setadminchat</code> | <code>/addadmin</code>\n\n📋 <b>مخزن و کلیپ‌بورد:</b>\n🔹 <code>/addtoclipboard</code>\n🔹 <code>/listtext</code>\n\n🎯 <b>قفل ریپلای ۱:</b>\n🔹 <code>/lockreply [user_id] [group_id]</code>\n🔹 <code>/listlocks</code>\n\n🔗 <b>قفل ریپلای ۲:</b>\n🔹 <code>/linkreply</code>\n\n⚙️ <b>اهداف و ارسال انبوه:</b>\n🔹 <code>/listmsg</code> | <code>/setmsg</code>\n🔹 <code>/groups</code> | <code>/addtarget</code>\n🔹 <code>/listtarget</code>\n🔹 <code>/setspeed [ثانیه]</code>\n🔹 <code>/tagflow</code>\n🔹 <code>/cancelflow</code>",
  },
  en: {
    select_language: "🌐 <b>Please select your language:</b>",
    lang_changed: "✅ Language changed successfully.",
    welcome: "🤖 <b>Welcome to the advanced bot admin panel.</b>",
    unauthorized: "❌ You don't have access to manage this bot.",
    start_send: "⏳ Sending operation started...",
    end_send: "✅ Operation completed successfully.",
    empty_target: "❌ Target group list is empty! Use /addtarget first.",
    invalid_idx: "❌ The entered numeric ID is invalid.",
    flow_step1: "🎯 <b>Step 1:</b> Send numeric user IDs separated by spaces:\nExample: <code>12345 67890</code>\n\n🛑 To stop: /cancelflow",
    flow_step2: "🔢 <b>Step 2:</b> Enter the number of messages:\n\n🛑 To stop: /cancelflow",
    flow_step3: "📝 <b>Step 3:</b> Choose text source:",
    flow_custom_prompt: "💬 Send your custom text:",
    flow_cancelled: "🛑 Tagflow operation cancelled.",
    flow_cancel_no_active: "❌ No active tagflow operation.",
    flow_already_running: "⚠️ A tagflow is already running.",
    flow_cancel_requested: "🛑 Cancel requested; stopping...",
    btn_custom: "✍️ New custom text",
    btn_periodic: "🔄 Periodic clipboard use",
    btn_periodic_flow: "🎲 Periodic selection from clipboard",
    clipboard_empty: "❌ Your clipboard is empty!",
    cancelled: "❌ Cancelled.",
    count_must_be_number: "❌ Count must be a number. Cancelled.",
    invalid_ids: "❌ Invalid IDs. Cancelled.",
    help: "👑 <b>Admin:</b> /setadminchat /addadmin\n📋 <b>Clipboard:</b> /addtoclipboard /listtext\n🎯 <b>Lock1:</b> /lockreply /listlocks\n🔗 <b>Lock2:</b> /linkreply\n⚙️ <b>Targets:</b> /listmsg /setmsg /groups /addtarget /listtarget /setspeed /tagflow /cancelflow",
  },
  zh: {
    select_language: "🌐 <b>请选择您的语言：</b>",
    lang_changed: "✅ 语言修改成功。",
    welcome: "🤖 <b>欢迎使用高级机器人管理面板。</b>",
    unauthorized: "❌ 您无权管理此机器人。",
    start_send: "⏳ 发送操作已开始...",
    end_send: "✅ 操作成功完成。",
    empty_target: "❌ 目标群组列表为空！",
    invalid_idx: "❌ 输入的ID无效。",
    flow_step1: "🎯 第一步：发送用户ID（空格分隔）：\n🛑 停止：/cancelflow",
    flow_step2: "🔢 第二步：消息数量：\n🛑 停止：/cancelflow",
    flow_step3: "📝 第三步：选择文本来源：",
    flow_custom_prompt: "💬 请发送自定义文本：",
    flow_cancelled: "🛑 标签流已取消。",
    flow_cancel_no_active: "❌ 没有活跃的标签流。",
    flow_already_running: "⚠️ 标签流正在运行。",
    flow_cancel_requested: "🛑 已请求取消...",
    btn_custom: "✍️ 新建自定义文本",
    btn_periodic: "🔄 周期性剪贴板",
    btn_periodic_flow: "🎲 从剪贴板周期选择",
    clipboard_empty: "❌ 剪贴板为空！",
    cancelled: "❌ 已取消。",
    count_must_be_number: "❌ 数量必须是数字。",
    invalid_ids: "❌ ID 无效。",
    help: "👑 管理员 /setadminchat /addadmin\n📋 剪贴板 /addtoclipboard /listtext\n🎯 锁定 /lockreply /listlocks\n🔗 /linkreply\n⚙️ /listmsg /setmsg /groups /addtarget /listtarget /setspeed /tagflow /cancelflow",
  },
  fr: {
    select_language: "🌐 <b>Veuillez sélectionner votre langue :</b>",
    lang_changed: "✅ Langue changée.",
    welcome: "🤖 <b>Bienvenue dans le panneau d'administration.</b>",
    unauthorized: "❌ Accès refusé.",
    start_send: "⏳ Envoi démarré...",
    end_send: "✅ Terminé.",
    empty_target: "❌ Liste des cibles vide !",
    invalid_idx: "❌ ID invalide.",
    flow_step1: "🎯 Étape 1 : Envoyez les ID :\n🛑 /cancelflow",
    flow_step2: "🔢 Étape 2 : Nombre de messages :\n🛑 /cancelflow",
    flow_step3: "📝 Étape 3 : Source du texte :",
    flow_custom_prompt: "💬 Envoyez votre texte :",
    flow_cancelled: "🛑 Tagflow annulé.",
    flow_cancel_no_active: "❌ Aucune opération active.",
    flow_already_running: "⚠️ Tagflow déjà en cours.",
    flow_cancel_requested: "🛑 Annulation demandée...",
    btn_custom: "✍️ Nouveau texte",
    btn_periodic: "🔄 Presse-papiers périodique",
    btn_periodic_flow: "🎲 Sélection périodique",
    clipboard_empty: "❌ Presse-papiers vide !",
    cancelled: "❌ Annulé.",
    count_must_be_number: "❌ Le nombre doit être numérique.",
    invalid_ids: "❌ ID invalides.",
    help: "👑 /setadminchat /addadmin\n📋 /addtoclipboard /listtext\n🎯 /lockreply /listlocks\n🔗 /linkreply\n⚙️ /listmsg /setmsg /groups /addtarget /listtarget /setspeed /tagflow /cancelflow",
  },
};

const VALID_MSG_KEYS = [
  "select_language", "welcome", "unauthorized", "start_send", "end_send",
  "empty_target", "invalid_idx", "flow_step1", "flow_step2", "flow_step3",
  "flow_custom_prompt", "flow_cancelled", "help",
];

// ---------- utils ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const escapeHtml = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function getCommand(text) {
  if (!text || !text.startsWith("/")) return null;
  const first = text.split(/\s+/)[0];
  return first.substring(1).split("@")[0].toLowerCase();
}

function encodeGroupId(id) { return String(id).replace(/-/g, "m"); }
function decodeGroupId(raw) {
  if (raw.startsWith("m")) return parseInt("-" + raw.substring(1), 10);
  return parseInt(raw, 10);
}

function parseTelegramLink(link) {
  try {
    let clean = link.trim().replace("https://", "").replace("http://", "").replace("t.me/", "");
    const parts = clean.split("/");
    if (parts.length < 2) return [null, null];
    const msgId = parseInt(parts[parts.length - 1], 10);
    if (isNaN(msgId)) return [null, null];
    if (parts[0] === "c") {
      const chatId = parseInt(`-100${parts[1]}`, 10);
      return [chatId, msgId];
    }
    return [`@${parts[0]}`, msgId];
  } catch {
    return [null, null];
  }
}

// ---------- Telegram API ----------
async function tg(env, method, params = {}) {
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return res.json();
}

// ---------- D1 helpers ----------
const DEFAULT_CONFIG = {
  admins: [],
  admin_group: null,
  clipboard: [],
  target_chats: [],
  speed: 0.4,
  known_groups: {},
  reply_locks: [],
  custom_msgs: {},
  default_reaction: "👍",
  language: "fa",
  pinned_lang_msgs: {},
};

async function getConfig(env) {
  const row = await env.DB.prepare("SELECT data FROM config WHERE id = 1").first();
  if (!row) {
    await saveConfig(env, DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG };
  }
  const parsed = JSON.parse(row.data);
  return { ...DEFAULT_CONFIG, ...parsed };
}

async function saveConfig(env, cfg) {
  await env.DB.prepare(
    "INSERT INTO config (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data"
  ).bind(JSON.stringify(cfg)).run();
}

async function getSession(env, userId) {
  const row = await env.DB.prepare("SELECT data FROM sessions WHERE user_id = ?").bind(userId).first();
  return row ? JSON.parse(row.data) : null;
}
async function setSession(env, userId, data) {
  await env.DB.prepare(
    "INSERT INTO sessions (user_id, data) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data"
  ).bind(userId, JSON.stringify(data)).run();
}
async function delSession(env, userId) {
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
}

async function getState(env, key) {
  const row = await env.DB.prepare("SELECT value FROM state WHERE key = ?").bind(key).first();
  return row ? row.value : null;
}
async function setState(env, key, value) {
  await env.DB.prepare(
    "INSERT INTO state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).bind(key, String(value)).run();
}

// ---------- msg helpers ----------
function getMsg(cfg, key) {
  const lang = cfg.language || "fa";
  if (cfg.custom_msgs && key in cfg.custom_msgs) return cfg.custom_msgs[key];
  return (TEXTS[lang] && TEXTS[lang][key]) || TEXTS.fa[key] || "";
}

function langKeyboard(cfg) {
  const current = cfg.language || "fa";
  const buttons = Object.entries(LANGUAGES).map(([code, info]) => ({
    text: code === current ? `✅ ${info.name}` : info.name,
    callback_data: `lang_${code}`,
  }));
  return { inline_keyboard: [buttons] };
}

// ---------- auth ----------
async function isAuthorized(msg, env) {
  const cfg = await getConfig(env);

  // 🌱 Seed admin list from ADMIN_ID env (once)
  if (!cfg.admins.length && env.ADMIN_ID) {
    const seeded = String(env.ADMIN_ID)
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));
    if (seeded.length) {
      cfg.admins.push(...seeded);
      await saveConfig(env, cfg);
    }
  }

  // Fallback: اولین نفر ادمین بشه اگه هیچ ادمینی تعریف نشده
  if (!cfg.admins.length) {
    cfg.admins.push(msg.from.id);
    await saveConfig(env, cfg);
    await tg(env, "sendMessage", {
      chat_id: msg.chat.id,
      text: "👑 شما به عنوان ادمین اصلی ربات تعیین شدید.",
      reply_to_message_id: msg.message_id,
    });
  }

  if (!cfg.admins.includes(msg.from.id)) {
    await tg(env, "sendMessage", {
      chat_id: msg.chat.id,
      text: getMsg(cfg, "unauthorized"),
      parse_mode: "HTML",
      reply_to_message_id: msg.message_id,
    });
    return false;
  }

  if (msg.chat.type === "private" || (cfg.admin_group && msg.chat.id === cfg.admin_group)) {
    return true;
  }
  return false;
}

// ---------- clipboard helpers ----------
async function getNextClipboardItem(env, key, cfg) {
  if (!cfg.clipboard || !cfg.clipboard.length) return null;
  const sorted = [...cfg.clipboard].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  const ptrKey = `ptr_${key}`;
  let ptr = parseInt((await getState(env, ptrKey)) || "0", 10);
  if (isNaN(ptr) || ptr >= sorted.length || ptr < 0) ptr = 0;
  const item = sorted[ptr];
  await setState(env, ptrKey, String(ptr + 1));
  return item;
}

async function sendClipboardItem(env, chatId, item, extraTagText = "", forcedReplyId = null) {
  if (!item) return;
  const itype = item.type || "text";
  const reply = forcedReplyId ? { reply_to_message_id: forcedReplyId } : {};

  if (itype === "text") {
    const fullText = escapeHtml(item.content || "") + extraTagText;
    await tg(env, "sendMessage", { chat_id: chatId, text: fullText, parse_mode: "HTML", ...reply });
  } else if (itype === "photo") {
    const cap = escapeHtml(item.caption || "") + extraTagText;
    await tg(env, "sendPhoto", { chat_id: chatId, photo: item.file_id, caption: cap || undefined, parse_mode: cap ? "HTML" : undefined, ...reply });
  } else if (itype === "video") {
    const cap = escapeHtml(item.caption || "") + extraTagText;
    await tg(env, "sendVideo", { chat_id: chatId, video: item.file_id, caption: cap || undefined, parse_mode: cap ? "HTML" : undefined, ...reply });
  } else if (itype === "animation") {
    const cap = escapeHtml(item.caption || "") + extraTagText;
    await tg(env, "sendAnimation", { chat_id: chatId, animation: item.file_id, caption: cap || undefined, parse_mode: cap ? "HTML" : undefined, ...reply });
  } else if (itype === "sticker") {
    await tg(env, "sendSticker", { chat_id: chatId, sticker: item.file_id, ...reply });
    if (extraTagText.trim()) {
      await tg(env, "sendMessage", { chat_id: chatId, text: extraTagText, parse_mode: "HTML", ...reply });
    }
  }
}

// ============================================================
// COMMAND HANDLERS
// ============================================================
async function sendHelp(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const cfg = await getConfig(env);
  const chatIdStr = String(msg.chat.id);

  const oldPin = cfg.pinned_lang_msgs[chatIdStr];
  if (oldPin) {
    try { await tg(env, "unpinChatMessage", { chat_id: msg.chat.id, message_id: oldPin }); } catch {}
  }

  try {
    const r = await tg(env, "sendMessage", {
      chat_id: msg.chat.id,
      text: getMsg(cfg, "select_language"),
      reply_markup: langKeyboard(cfg),
      parse_mode: "HTML",
    });
    if (r.ok && r.result) {
      await tg(env, "pinChatMessage", { chat_id: msg.chat.id, message_id: r.result.message_id, disable_notification: true });
      cfg.pinned_lang_msgs[chatIdStr] = r.result.message_id;
      await saveConfig(env, cfg);
    }
  } catch (e) { console.error("pin:", e); }

  await tg(env, "sendMessage", {
    chat_id: msg.chat.id,
    text: `${getMsg(cfg, "welcome")}\n\n${getMsg(cfg, "help")}`,
    parse_mode: "HTML",
    reply_to_message_id: msg.message_id,
  });
}

async function setDefaultReaction(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const parts = (msg.text || "").split(/\s+/);
  if (parts.length < 2) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ مثال: <code>/setreaction 🔥</code>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return;
  }
  const cfg = await getConfig(env);
  cfg.default_reaction = parts[1];
  await saveConfig(env, cfg);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `✅ ریکشن پیش‌فرض: <code>${escapeHtml(parts[1])}</code>`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function startHiddenChat(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const parts = (msg.text || "").split(/\s+/);
  if (parts.length < 2) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ مثال: <code>/hiddenchat -10012345678</code>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return;
  }
  const groupId = parseInt(parts[1], 10);
  if (isNaN(groupId)) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ آیدی نامعتبر.", reply_to_message_id: msg.message_id });
    return;
  }
  await setSession(env, msg.from.id, { mode: "hidden_chat", target_group: groupId, hidden_reply_id: null });
  await tg(env, "sendMessage", {
    chat_id: msg.chat.id,
    text: `🕵️ <b>حالت چت ناشناس فعال شد!</b>\n👥 گروه: <code>${groupId}</code>\n\n🔻 <code>/Replyhidden [link]</code>\n🔻 <code>/stophidden</code> ➔ خروج`,
    parse_mode: "HTML",
    reply_to_message_id: msg.message_id,
  });
}

async function setLockReply(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const parts = (msg.text || "").split(/\s+/);
  try {
    const userId = parseInt(parts[1], 10);
    const groupId = parseInt(parts[2], 10);
    if (isNaN(userId) || isNaN(groupId)) throw 0;
    const cfg = await getConfig(env);
    if (!cfg.reply_locks.some((l) => l.user_id === userId && l.group_id === groupId)) {
      cfg.reply_locks.push({ user_id: userId, group_id: groupId });
      await saveConfig(env, cfg);
    }
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `🎯 قفل فعال!\n👤 <code>${userId}</code>\n👥 <code>${groupId}</code>`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
  } catch {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ ساختار: <code>/lockreply [user_id] [group_id]</code>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
  }
}

async function listLocks(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const cfg = await getConfig(env);
  if (!cfg.reply_locks.length) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "🔒 هیچ قفل فعالی نیست.", reply_to_message_id: msg.message_id });
    return;
  }
  let res = "🔒 <b>لیست افراد تحت تعقیب:</b>\n\n";
  for (const l of cfg.reply_locks) {
    const cmd = encodeGroupId(l.group_id);
    res += `👤 <code>${l.user_id}</code> ➔ 👥 <code>${l.group_id}</code>\n🗑️ /unlock_${l.user_id}_${cmd}\n───────────────────────\n`;
  }
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: res, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function handleDynamicUnlock(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const cmd = getCommand(msg.text);
  const parts = cmd.split("_");
  try {
    const userId = parseInt(parts[1], 10);
    const groupId = decodeGroupId(parts[2]);
    const cfg = await getConfig(env);
    cfg.reply_locks = cfg.reply_locks.filter((l) => !(l.user_id === userId && l.group_id === groupId));
    await saveConfig(env, cfg);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `🗑️ قفل کاربر <code>${userId}</code> لغو شد.`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
  } catch {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "invalid_idx"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
  }
}

async function startLinkReplyFlow(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  await setSession(env, msg.from.id, { mode: "linkreply_url" });
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "🔗 <b>لطفاً لینک پیام یا پست را بفرستید:</b>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function processLinkreplyUrl(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  const [chatId, msgId] = parseTelegramLink(msg.text || "");
  if (!chatId) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ لینک نامعتبر.", reply_to_message_id: msg.message_id });
    await delSession(env, msg.from.id);
    return;
  }
  await setSession(env, msg.from.id, { mode: "linkreply_count", link_chat_id: chatId, link_msg_id: msgId });
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "🔢 <b>تعداد پیام‌ها:</b>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function processLinkreplyCount(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session) return;
  const count = parseInt(msg.text || "", 10);
  if (isNaN(count)) {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "count_must_be_number"), reply_to_message_id: msg.message_id });
    await delSession(env, uid);
    return;
  }
  session.count = count;
  session.mode = "linkreply_choice";
  await setSession(env, uid, session);
  const cfg = await getConfig(env);
  await tg(env, "sendMessage", {
    chat_id: msg.chat.id,
    text: "📝 <b>منبع متن:</b>",
    reply_markup: { keyboard: [[{ text: getMsg(cfg, "btn_custom") }, { text: getMsg(cfg, "btn_periodic") }]], one_time_keyboard: true, resize_keyboard: true },
    parse_mode: "HTML",
  });
}

async function processLinkreplyChoice(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session) return;
  const cfg = await getConfig(env);
  const choice = msg.text || "";

  if (choice === getMsg(cfg, "btn_custom")) {
    session.mode = "linkreply_custom";
    await setSession(env, uid, session);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "💬 متن سفارشی را بفرستید:", reply_markup: { remove_keyboard: true }, reply_to_message_id: msg.message_id });
  } else if (choice === getMsg(cfg, "btn_periodic")) {
    if (!cfg.clipboard.length) {
      await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "clipboard_empty"), reply_markup: { remove_keyboard: true }, reply_to_message_id: msg.message_id });
      await delSession(env, uid);
      return;
    }
    session.mode = "linkreply_run";
    session.flow_mode = "periodic";
    await setSession(env, uid, session);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "start_send"), reply_markup: { remove_keyboard: true }, parse_mode: "HTML" });
    ctx.waitUntil(executeLinkReplySending(msg, uid, session, env));
  } else {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "cancelled"), reply_markup: { remove_keyboard: true }, reply_to_message_id: msg.message_id });
    await delSession(env, uid);
  }
}

async function processLinkreplyCustomText(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session) return;
  session.mode = "linkreply_run";
  session.flow_mode = "custom";
  session.custom_text = msg.text || "";
  await setSession(env, uid, session);
  const cfg = await getConfig(env);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "start_send"), parse_mode: "HTML" });
  ctx.waitUntil(executeLinkReplySending(msg, uid, session, env));
}

async function executeLinkReplySending(msg, uid, session, env) {
  try {
    const cfg = await getConfig(env);
    const chatId = session.link_chat_id;
    const msgId = session.link_msg_id;
    const count = session.count;
    const mode = session.flow_mode;
    const opKey = `link_run_${chatId}_${msgId}`;
    for (let i = 0; i < count; i++) {
      try {
        let item;
        if (mode === "custom") item = { type: "text", content: session.custom_text };
        else item = await getNextClipboardItem(env, opKey, cfg);
        await sendClipboardItem(env, chatId, item, "", msgId);
        await sleep((cfg.speed || 0.4) * 1000);
      } catch (e) { console.error("link reply:", e); }
    }
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "end_send"), parse_mode: "HTML" });
  } finally {
    await delSession(env, uid);
  }
}

// ---------- clipboard ----------
async function startContinuousClipboard(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  await setSession(env, msg.from.id, { mode: "add_clipboard" });
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "📥 <b>حالت دریافت فعال!</b>\n⏹️ برای اتمام: <code>/stopadding</code>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function processClipboardContinuous(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  if (msg.text && msg.text.trim() === "/stopadding") {
    await delSession(env, msg.from.id);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "⏹️ متوقف شد.", parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return;
  }
  const newId = String(Math.floor(Math.random() * 90000000) + 10000000);
  const item = { id: newId, timestamp: Date.now() / 1000 };
  if (msg.text) { item.type = "text"; item.content = msg.text; }
  else if (msg.photo) { item.type = "photo"; item.file_id = msg.photo[msg.photo.length - 1].file_id; item.caption = msg.caption || ""; }
  else if (msg.video) { item.type = "video"; item.file_id = msg.video.file_id; item.caption = msg.caption || ""; }
  else if (msg.animation) { item.type = "animation"; item.file_id = msg.animation.file_id; item.caption = msg.caption || ""; }
  else if (msg.sticker) { item.type = "sticker"; item.file_id = msg.sticker.file_id; }
  else {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ فرمت پشتیبانی نمی‌شود!", reply_to_message_id: msg.message_id });
    return;
  }
  const cfg = await getConfig(env);
  cfg.clipboard.push(item);
  await saveConfig(env, cfg);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `✅ ذخیره شد (<code>${newId}</code>).\nپیام بعدی یا <code>/stopadding</code>`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function listClipboard(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const cfg = await getConfig(env);
  if (!cfg.clipboard.length) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "📂 خالی است.", reply_to_message_id: msg.message_id });
    return;
  }
  const sorted = [...cfg.clipboard].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  let res = "📋 <b>لیست کلیپ‌بورد:</b>\n\n";
  for (const item of sorted) {
    const itype = item.type || "text";
    const snippet = itype === "text" ? escapeHtml((item.content || "").slice(0, 30)) : escapeHtml((item.caption || "بدون زیرنویس").slice(0, 30));
    res += `🎬 <b>${itype.toUpperCase()}:</b> ${snippet}...\n`;
    res += `👁️ /view_${item.id}  |  🗑️ /del_${item.id}\n───────────────────────\n`;
  }
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: res, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function handleViewItem(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  try {
    const id = getCommand(msg.text).split("_")[1];
    const cfg = await getConfig(env);
    const item = cfg.clipboard.find((i) => i.id === id);
    if (item) await sendClipboardItem(env, msg.chat.id, item, "", msg.message_id);
  } catch {}
}

async function handleDelItem(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  try {
    const id = getCommand(msg.text).split("_")[1];
    const cfg = await getConfig(env);
    const before = cfg.clipboard.length;
    cfg.clipboard = cfg.clipboard.filter((i) => i.id !== id);
    if (cfg.clipboard.length < before) {
      await saveConfig(env, cfg);
      await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `🗑️ <code>${id}</code> حذف شد.`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
    }
  } catch {}
}

// ---------- messages config ----------
async function listMessages(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const cfg = await getConfig(env);
  let res = "⚙️ <b>لیست متن‌های خروجی:</b>\n\n";
  for (const k of VALID_MSG_KEYS) {
    const cur = cfg.custom_msgs[k] ?? getMsg(cfg, k);
    res += `🔑 <code>${k}</code>\n💬 ${escapeHtml(cur)}\n\n`;
  }
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: res, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function setMessageText(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const parts = (msg.text || "").split(/\s+/);
  if (parts.length < 3) return;
  const key = parts[1];
  const newTxt = msg.text.substring(msg.text.indexOf(key) + key.length).trim();
  if (!VALID_MSG_KEYS.includes(key)) return;
  const cfg = await getConfig(env);
  cfg.custom_msgs[key] = newTxt;
  await saveConfig(env, cfg);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `✅ کلید <code>${key}</code> تغییر کرد.`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

// ---------- tagflow ----------
async function handleCancelInStep(msg, env) {
  const uid = msg.from.id;
  const text = (msg.text || "").trim();
  if (text === "/cancelflow") {
    await setState(env, `cancel_${uid}`, "1");
    await delSession(env, uid);
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_cancelled"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return true;
  }
  if ((await getState(env, `cancel_${uid}`)) === "1") {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_cancelled"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return true;
  }
  return false;
}

async function cancelTagFlow(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const uid = msg.from.id;
  const running = await getState(env, `running_flow_${uid}`);
  const session = await getSession(env, uid);
  const isActive = running === "1" || (session && session.mode);
  if (!isActive) {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_cancel_no_active"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return;
  }
  await setState(env, `cancel_${uid}`, "1");
  await delSession(env, uid);
  const cfg = await getConfig(env);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_cancel_requested"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function startTagFlow(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const uid = msg.from.id;
  if ((await getState(env, `running_flow_${uid}`)) === "1") {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_already_running"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return;
  }
  await setState(env, `cancel_${uid}`, "0");
  await setSession(env, uid, { mode: "flow_ids" });
  const cfg = await getConfig(env);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_step1"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function processFlowIds(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  if (await handleCancelInStep(msg, env)) return;
  try {
    const ids = (msg.text || "").split(/\s+/).filter(Boolean).map((x) => parseInt(x, 10));
    if (!ids.length || ids.some((x) => isNaN(x))) throw 0;
    const session = (await getSession(env, msg.from.id)) || {};
    session.mode = "flow_count";
    session.ids = ids;
    await setSession(env, msg.from.id, session);
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_step2"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
  } catch {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "invalid_ids"), reply_to_message_id: msg.message_id });
  }
}

async function processFlowCount(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  if (await handleCancelInStep(msg, env)) return;
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session) return;
  const count = parseInt(msg.text || "", 10);
  if (isNaN(count)) {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "count_must_be_number"), reply_to_message_id: msg.message_id });
    await delSession(env, uid);
    return;
  }
  session.count = count;
  session.mode = "flow_choice";
  await setSession(env, uid, session);
  const cfg = await getConfig(env);
  await tg(env, "sendMessage", {
    chat_id: msg.chat.id,
    text: getMsg(cfg, "flow_step3"),
    reply_markup: { keyboard: [[{ text: getMsg(cfg, "btn_custom") }, { text: getMsg(cfg, "btn_periodic_flow") }]], one_time_keyboard: true, resize_keyboard: true },
    parse_mode: "HTML",
  });
}

async function processFlowTextChoice(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  if (await handleCancelInStep(msg, env)) return;
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session) return;
  const cfg = await getConfig(env);
  const choice = msg.text || "";

  if (choice === getMsg(cfg, "btn_custom")) {
    session.mode = "flow_custom";
    await setSession(env, uid, session);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_custom_prompt"), reply_markup: { remove_keyboard: true }, parse_mode: "HTML", reply_to_message_id: msg.message_id });
  } else if (choice === getMsg(cfg, "btn_periodic_flow")) {
    if (!cfg.clipboard.length) {
      await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "clipboard_empty"), reply_markup: { remove_keyboard: true }, reply_to_message_id: msg.message_id });
      await delSession(env, uid);
      return;
    }
    session.flow_mode = "periodic";
    await setSession(env, uid, session);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "start_send"), reply_markup: { remove_keyboard: true }, parse_mode: "HTML" });
    await executeAdvancedTagFlow(msg, uid, session, env, ctx);
  } else {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "cancelled"), reply_markup: { remove_keyboard: true }, reply_to_message_id: msg.message_id });
    await delSession(env, uid);
  }
}

async function processFlowCustomText(msg, env, ctx) {
  if (!(await isAuthorized(msg, env))) return;
  if (await handleCancelInStep(msg, env)) return;
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session) return;
  session.flow_mode = "custom";
  session.custom_text = msg.text || "";
  await setSession(env, uid, session);
  const cfg = await getConfig(env);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "start_send"), parse_mode: "HTML" });
  await executeAdvancedTagFlow(msg, uid, session, env, ctx);
}

async function executeAdvancedTagFlow(msg, uid, session, env, ctx) {
  if ((await getState(env, `running_flow_${uid}`)) === "1") {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "flow_already_running"), parse_mode: "HTML" });
    return;
  }
  await setState(env, `running_flow_${uid}`, "1");
  ctx.waitUntil(_runTagFlow(msg, uid, session, env));
}

async function _runTagFlow(msg, uid, session, env) {
  let cancelled = false;
  try {
    const cfg = await getConfig(env);
    if (!cfg.target_chats.length) {
      await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "empty_target"), parse_mode: "HTML" });
      return;
    }
    const count = session.count;
    const ids = session.ids;
    const tagLine = "\n\n" + ids.map((i) => `<a href="tg://user?id=${i}">📌</a>`).join(" ");
    const opKey = `flow_run_${uid}`;

    outer: for (let i = 0; i < count; i++) {
      if ((await getState(env, `cancel_${uid}`)) === "1") { cancelled = true; break; }
      for (const chat of cfg.target_chats) {
        if ((await getState(env, `cancel_${uid}`)) === "1") { cancelled = true; break outer; }
        try {
          let item;
          if (session.flow_mode === "custom") item = { type: "text", content: session.custom_text };
          else item = await getNextClipboardItem(env, opKey, cfg);
          await sendClipboardItem(env, chat, item, tagLine);
          await sleep((cfg.speed || 0.4) * 1000);
        } catch (e) { console.error("flow send:", e); }
      }
    }
  } catch (e) {
    console.error("flow:", e);
  } finally {
    await setState(env, `running_flow_${uid}`, "0");
    await setState(env, `cancel_${uid}`, "0");
    try { await delSession(env, uid); } catch {}
    try {
      const cfg = await getConfig(env);
      const txt = cancelled ? getMsg(cfg, "flow_cancelled") : getMsg(cfg, "end_send");
      await tg(env, "sendMessage", { chat_id: msg.chat.id, text: txt, parse_mode: "HTML" });
    } catch {}
  }
}

// ---------- admin/targets ----------
async function setAdminChat(msg, env) {
  if (msg.chat.type === "private") return;
  const cfg = await getConfig(env);
  if (!cfg.admins.includes(msg.from.id)) return;
  cfg.admin_group = msg.chat.id;
  await saveConfig(env, cfg);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "✅ این گروه به عنوان گروه ادمین‌ها ست شد.", reply_to_message_id: msg.message_id });
}

async function addAdmin(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const parts = (msg.text || "").split(/\s+/);
  if (parts.length < 2) return;
  const id = parseInt(parts[1], 10);
  if (isNaN(id)) return;
  const cfg = await getConfig(env);
  if (!cfg.admins.includes(id)) {
    cfg.admins.push(id);
    await saveConfig(env, cfg);
  }
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `✅ کاربر ${id} ادمین شد.`, reply_to_message_id: msg.message_id });
}

async function setSpeed(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const parts = (msg.text || "").split(/\s+/);
  if (parts.length < 2) return;
  const sp = parseFloat(parts[1]);
  if (isNaN(sp)) return;
  const cfg = await getConfig(env);
  cfg.speed = sp;
  await saveConfig(env, cfg);
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `⚡ سرعت: ${sp} ثانیه`, reply_to_message_id: msg.message_id });
}

async function listGroups(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const cfg = await getConfig(env);
  if (!Object.keys(cfg.known_groups).length) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ گروهی ثبت نشده.", reply_to_message_id: msg.message_id });
    return;
  }
  let res = "🔍 <b>گروه‌ها:</b>\n\n";
  for (const [gid, title] of Object.entries(cfg.known_groups)) {
    res += `👥 ${escapeHtml(title)}\n🆔 <code>${gid}</code>\n\n`;
  }
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: res, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function addTarget(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const parts = (msg.text || "").split(/\s+/);
  if (parts.length < 2) return;
  const id = parseInt(parts[1], 10);
  if (isNaN(id)) return;
  const cfg = await getConfig(env);
  if (!cfg.target_chats.includes(id)) {
    cfg.target_chats.push(id);
    await saveConfig(env, cfg);
  }
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `🎯 گروه <code>${id}</code> اضافه شد.`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function listTarget(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  const cfg = await getConfig(env);
  if (!cfg.target_chats.length) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "🎯 خالی است.", reply_to_message_id: msg.message_id });
    return;
  }
  let res = "🎯 <b>گروه‌های هدف:</b>\n\n";
  for (const id of cfg.target_chats) {
    const title = cfg.known_groups[String(id)] || "نامعلوم";
    const cmdId = encodeGroupId(id);
    res += `🔹 ${escapeHtml(title)} (<code>${id}</code>)\n🗑️ /deltarget_${cmdId}\n───────────────────────\n`;
  }
  await tg(env, "sendMessage", { chat_id: msg.chat.id, text: res, parse_mode: "HTML", reply_to_message_id: msg.message_id });
}

async function handleDynamicDeltarget(msg, env) {
  if (!(await isAuthorized(msg, env))) return;
  try {
    const raw = getCommand(msg.text).split("_")[1];
    const id = decodeGroupId(raw);
    const cfg = await getConfig(env);
    if (cfg.target_chats.includes(id)) {
      cfg.target_chats = cfg.target_chats.filter((x) => x !== id);
      await saveConfig(env, cfg);
      await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `🗑️ <code>${id}</code> حذف شد.`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
    }
  } catch {
    const cfg = await getConfig(env);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: getMsg(cfg, "invalid_idx"), parse_mode: "HTML", reply_to_message_id: msg.message_id });
  }
}

// ============================================================
// SESSION MODE HANDLERS
// ============================================================
async function handleHiddenChatInterceptor(msg, env) {
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session || session.mode !== "hidden_chat") return;
  const text = msg.text || "";

  if (text === "/stophidden") {
    await delSession(env, uid);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "🚪 <b>از حالت چت ناشناس خارج شدید.</b>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return;
  }
  if (text.startsWith("/Replyhidden")) {
    const parts = text.split(/\s+/);
    if (parts.length > 1) {
      const [_, mId] = parseTelegramLink(parts.slice(1).join(" "));
      if (mId) {
        session.hidden_reply_id = mId;
        await setSession(env, uid, session);
        const cfg = await getConfig(env);
        try {
          await tg(env, "setMessageReaction", { chat_id: session.target_group, message_id: mId, reaction: [{ type: "emoji", emoji: cfg.default_reaction || "👍" }] });
        } catch {}
        await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `🎯 پیام هدف ست شد. حالا پیام خود را بفرستید:`, reply_to_message_id: msg.message_id });
      } else {
        await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ لینک نامعتبر.", reply_to_message_id: msg.message_id });
      }
    } else {
      session.mode = "hidden_reply_step";
      await setSession(env, uid, session);
      await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "🔗 <b>لطفاً لینک پیام گروه را بفرستید:</b>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
    }
    return;
  }
  if (text.startsWith("/")) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "⚠️ <b>شما در حالت چت ناشناس هستید!</b>", parse_mode: "HTML", reply_to_message_id: msg.message_id });
    return;
  }

  const replyId = session.hidden_reply_id;
  try {
    await tg(env, "copyMessage", { chat_id: session.target_group, from_chat_id: msg.chat.id, message_id: msg.message_id, reply_to_message_id: replyId || undefined });
    if (replyId) { session.hidden_reply_id = null; await setSession(env, uid, session); }
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "🚀 فرستاده شد.", reply_to_message_id: msg.message_id });
  } catch (e) {
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `❌ خطا: ${e.message}`, reply_to_message_id: msg.message_id });
  }
}

async function processHiddenReplyStepByStep(msg, env) {
  const uid = msg.from.id;
  const session = await getSession(env, uid);
  if (!session || session.mode !== "hidden_reply_step") return;

  if (msg.text && msg.text.startsWith("/")) {
    session.mode = "hidden_chat";
    await setSession(env, uid, session);
    return handleHiddenChatInterceptor(msg, env);
  }

  const [_, mId] = parseTelegramLink(msg.text || "");
  if (mId) {
    session.hidden_reply_id = mId;
    session.mode = "hidden_chat";
    await setSession(env, uid, session);
    const cfg = await getConfig(env);
    try {
      await tg(env, "setMessageReaction", { chat_id: session.target_group, message_id: mId, reaction: [{ type: "emoji", emoji: cfg.default_reaction || "👍" }] });
    } catch {}
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: `✅ لینک تایید شد و ریکشن زده شد.\n✍️ حالا پیام خود را بفرستید:`, parse_mode: "HTML", reply_to_message_id: msg.message_id });
  } else {
    session.mode = "hidden_chat";
    await setSession(env, uid, session);
    await tg(env, "sendMessage", { chat_id: msg.chat.id, text: "❌ لینک نامعتبر.", reply_to_message_id: msg.message_id });
  }
}

// ============================================================
// GROUP TRACKING / HUNT
// ============================================================
async function trackGroup(msg, env) {
  const cfg = await getConfig(env);
  const chatId = String(msg.chat.id);
  if (cfg.known_groups[chatId] !== msg.chat.title) {
    cfg.known_groups[chatId] = msg.chat.title || "?";
    await saveConfig(env, cfg);
  }
}

async function huntReply(msg, env) {
  const cfg = await getConfig(env);
  if (!cfg.reply_locks.length) return;
  for (const lock of cfg.reply_locks) {
    if (msg.from.id === lock.user_id && msg.chat.id === lock.group_id) {
      if (cfg.clipboard.length) {
        const item = await getNextClipboardItem(env, `hunt_${msg.chat.id}`, cfg);
        try {
          await sleep((cfg.speed || 0.4) * 1000);
          await sendClipboardItem(env, msg.chat.id, item, "", msg.message_id);
        } catch (e) { console.error("hunt:", e); }
      }
      break;
    }
  }
}

// ============================================================
// DISPATCHERS
// ============================================================
async function handleCommand(msg, env, ctx) {
  const cmd = getCommand(msg.text);
  if (!cmd) return;

  switch (cmd) {
    case "start": case "help": return sendHelp(msg, env);
    case "setreaction": return setDefaultReaction(msg, env);
    case "hiddenchat": return startHiddenChat(msg, env);
    case "lockreply": return setLockReply(msg, env);
    case "listlocks": return listLocks(msg, env);
    case "linkreply": return startLinkReplyFlow(msg, env);
    case "addtoclipboard": return startContinuousClipboard(msg, env);
    case "listtext": return listClipboard(msg, env);
    case "listmsg": return listMessages(msg, env);
    case "setmsg": return setMessageText(msg, env);
    case "cancelflow": return cancelTagFlow(msg, env);
    case "tagflow": return startTagFlow(msg, env);
    case "setadminchat": return setAdminChat(msg, env);
    case "addadmin": return addAdmin(msg, env);
    case "setspeed": return setSpeed(msg, env);
    case "groups": return listGroups(msg, env);
    case "addtarget": return addTarget(msg, env);
    case "listtarget": return listTarget(msg, env);
  }

  if (cmd.startsWith("unlock_")) return handleDynamicUnlock(msg, env);
  if (cmd.startsWith("deltarget_")) return handleDynamicDeltarget(msg, env);
  if (cmd.startsWith("view_")) return handleViewItem(msg, env);
  if (cmd.startsWith("del_")) return handleDelItem(msg, env);
}

async function handleMessage(msg, env, ctx) {
  if (!msg.from) return;

  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    ctx.waitUntil(trackGroup(msg, env));
    ctx.waitUntil(huntReply(msg, env));
  }

  const uid = msg.from.id;
  const session = await getSession(env, uid);

  if (session && session.mode) {
    switch (session.mode) {
      case "hidden_chat": return handleHiddenChatInterceptor(msg, env);
      case "hidden_reply_step": return processHiddenReplyStepByStep(msg, env);
      case "add_clipboard": return processClipboardContinuous(msg, env);
      case "flow_ids": return processFlowIds(msg, env, ctx);
      case "flow_count": return processFlowCount(msg, env, ctx);
      case "flow_choice": return processFlowTextChoice(msg, env, ctx);
      case "flow_custom": return processFlowCustomText(msg, env, ctx);
      case "linkreply_url": return processLinkreplyUrl(msg, env, ctx);
      case "linkreply_count": return processLinkreplyCount(msg, env, ctx);
      case "linkreply_choice": return processLinkreplyChoice(msg, env, ctx);
      case "linkreply_custom": return processLinkreplyCustomText(msg, env, ctx);
    }
  }

  if (msg.text && msg.text.startsWith("/")) {
    return handleCommand(msg, env, ctx);
  }
}

async function handleCallback(cb, env) {
  if (!cb.data) return;
  if (cb.data.startsWith("lang_")) {
    const lang = cb.data.replace("lang_", "");
    if (!LANGUAGES[lang]) {
      await tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: "❌" });
      return;
    }
    const cfg = await getConfig(env);
    cfg.language = lang;
    await saveConfig(env, cfg);
    try { await tg(env, "answerCallbackQuery", { callback_query_id: cb.id, text: getMsg(cfg, "lang_changed") }); } catch {}
    try {
      await tg(env, "editMessageText", {
        chat_id: cb.message.chat.id,
        message_id: cb.message.message_id,
        text: getMsg(cfg, "select_language"),
        reply_markup: langKeyboard(cfg),
        parse_mode: "HTML",
      });
    } catch {}
  }
}

async function handleUpdate(update, env, ctx) {
  try {
    if (update.message) await handleMessage(update.message, env, ctx);
    else if (update.callback_query) await handleCallback(update.callback_query, env);
  } catch (e) {
    console.error("update:", e);
  }
}

// ============================================================
// ENTRY POINT
// ============================================================
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ── /setwebhook (محمی با WEBHOOK_SECRET) ──
    if (url.pathname === "/setwebhook") {
      if (env.WEBHOOK_SECRET) {
        const key = url.searchParams.get("key");
        if (key !== env.WEBHOOK_SECRET) {
          return new Response("Forbidden", { status: 403 });
        }
      }
      const webhookUrl = `${url.protocol}//${url.host}/webhook`;
      const params = { url: webhookUrl, drop_pending_updates: true };
      if (env.WEBHOOK_SECRET) params.secret_token = env.WEBHOOK_SECRET;
      const res = await tg(env, "setWebhook", params);
      return new Response(JSON.stringify(res, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── /webhook (تایید هدر X-Telegram-Bot-Api-Secret-Token) ──
    if (request.method === "POST" && url.pathname === "/webhook") {
      if (env.WEBHOOK_SECRET) {
        const headerSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
        if (headerSecret !== env.WEBHOOK_SECRET) {
          return new Response("Unauthorized", { status: 401 });
        }
      }
      try {
        const update = await request.json();
        ctx.waitUntil(handleUpdate(update, env, ctx));
      } catch (e) {
        console.error("webhook parse:", e);
      }
      return new Response("ok");
    }

    if (url.pathname === "/") {
      return new Response("🤖 Bot is running. POST /webhook  |  GET /setwebhook?key=...", {
        status: 200,
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
