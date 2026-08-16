// functions/index.js
// KitsuneChess のプッシュ通知(FCM)用 Cloud Functions。
//
// デプロイ方法(利用者が行う作業):
//   1. Firebase CLI をインストール: npm install -g firebase-tools
//   2. Blaze(従量課金)プランへのアップグレードが必要です(RTDBトリガーはSparkプラン非対応)
//   3. このディレクトリで: firebase login → firebase init functions (既存プロジェクトを選択、このindex.js/package.jsonを使う)
//   4. cd functions && npm install
//   5. firebase deploy --only functions
//
// INSTANCE / REGION の確認:
//   match.html の databaseURL は
//   https://kitsunechess-multiplayer-default-rtdb.asia-southeast1.firebasedatabase.app
//   なので instance = "kitsunechess-multiplayer-default-rtdb", region = "asia-southeast1" としています。
//   もしRTDBのURLを変更した場合はここも合わせて変更してください。

const { onValueCreated, onValueUpdated } = require("firebase-functions/v2/database");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();

const DB_INSTANCE = "kitsunechess-multiplayer-default-rtdb";
const DB_REGION = "asia-southeast1";

setGlobalOptions({ region: DB_REGION });

/**
 * 指定ユーザーの全登録端末(FCMトークン)に通知を送る。
 * 無効になったトークンは自動的にDBから削除する。
 */
async function sendToUser(uid, { title, body, link }) {
  if (!uid) return;
  const db = admin.database();
  const tokensSnap = await db.ref(`users/${uid}/fcmTokens`).get();
  if (!tokensSnap.exists()) return;

  const tokens = Object.keys(tokensSnap.val() || {});
  if (tokens.length === 0) return;

  const message = {
    notification: { title, body },
    data: { link: link || "/match.html" },
    tokens
  };

  const res = await admin.messaging().sendEachForMulticast(message);

  // 無効/期限切れトークンを掃除する
  const removals = [];
  res.responses.forEach((r, i) => {
    if (!r.success) {
      const code = r.error && r.error.code;
      if (
        code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-registration-token"
      ) {
        removals.push(db.ref(`users/${uid}/fcmTokens/${tokens[i]}`).remove());
      }
    }
  });
  if (removals.length) await Promise.all(removals);
}

// ── 1. 対局招待が届いたとき ──
// matchInvites/{toUid}/{fromUid} = { username, sentAt, timeControl, fixed }
exports.onMatchInviteCreated = onValueCreated(
  { ref: "/matchInvites/{toUid}/{fromUid}", instance: DB_INSTANCE },
  async (event) => {
    const toUid = event.params.toUid;
    const info = event.data.val() || {};
    const fromName = info.username || "?";
    await sendToUser(toUid, {
      title: "♟ KitsuneChess",
      body: `${fromName} さんから対局の招待が届きました`,
      link: "/match.html"
    });
  }
);

// ── 2. 対局の状態が更新されたとき(自分の番になった／再戦の申し込み) ──
// matches/{matchId} = { white, black, whiteName, blackName, turn, status, rematchRequestBy, ... }
exports.onMatchUpdated = onValueUpdated(
  { ref: "/matches/{matchId}", instance: DB_INSTANCE },
  async (event) => {
    const matchId = event.params.matchId;
    const before = event.data.before.val() || {};
    const after = event.data.after.val() || {};

    // 手番が変わった(=誰かが指した)場合、次に指す人に通知する
    if (
      after.status === "active" &&
      before.turn !== after.turn &&
      after.white &&
      after.black
    ) {
      const nextUid = after.turn === "w" ? after.white : after.black;
      await sendToUser(nextUid, {
        title: "♟ あなたの番です",
        body: "対局があなたの手番になりました",
        link: `/match.html?id=${matchId}`
      });
    }

    // 再戦の申し込みが新しく来た場合、申し込んでいない方に通知する
    if (
      after.rematchRequestBy &&
      before.rematchRequestBy !== after.rematchRequestBy &&
      after.white &&
      after.black
    ) {
      const requester = after.rematchRequestBy;
      const recipient = requester === after.white ? after.black : after.white;
      if (recipient && recipient !== requester) {
        await sendToUser(recipient, {
          title: "♟ KitsuneChess",
          body: "相手が再戦を申し込んでいます",
          link: `/match.html?id=${matchId}`
        });
      }
    }
  }
);

// ── 3. 対局チャットにメッセージが届いたとき ──
// matches/{matchId}/messages/{msgId} = { from, fromName, text, lang, sentAt }
exports.onMatchMessageCreated = onValueCreated(
  { ref: "/matches/{matchId}/messages/{msgId}", instance: DB_INSTANCE },
  async (event) => {
    const matchId = event.params.matchId;
    const msg = event.data.val() || {};
    if (!msg.from) return;

    const matchSnap = await admin.database().ref(`matches/${matchId}`).get();
    if (!matchSnap.exists()) return;
    const m = matchSnap.val();
    if (!m.white || !m.black) return;

    const recipient = msg.from === m.white ? m.black : m.white;
    if (!recipient || recipient === msg.from) return;

    await sendToUser(recipient, {
      title: `💬 ${msg.fromName || "?"}`,
      body: msg.text || "",
      link: `/match.html?id=${matchId}`
    });
  }
);

// ── 4. 友達へのダイレクトメッセージが届いたとき ──
// directMessages/{pairKey}/{msgId} = { from, fromName, text, lang, sentAt }
// pairKey は [uidA, uidB].sort().join('_') の形式
exports.onDirectMessageCreated = onValueCreated(
  { ref: "/directMessages/{pairKey}/{msgId}", instance: DB_INSTANCE },
  async (event) => {
    const pairKey = event.params.pairKey;
    const msg = event.data.val() || {};
    if (!msg.from) return;

    const uids = pairKey.split("_");
    if (uids.length !== 2) return;
    const recipient = uids[0] === msg.from ? uids[1] : uids[0];
    if (!recipient || recipient === msg.from) return;

    await sendToUser(recipient, {
      title: `✉️ ${msg.fromName || "?"}`,
      body: msg.text || "",
      link: "/match.html"
    });
  }
);
