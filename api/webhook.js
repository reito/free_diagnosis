import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("✅ 受信データ (全体):", JSON.stringify(req.body, null, 2));

        // `result.html` からのリクエストのみを受け付ける
        const { userId } = req.body;

        if (!userId) {
            console.error("❌ userIdが取得できませんでした。");
            return res.status(400).json({ message: '❌ userIdがありません。' });
        }

        const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
        const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

        if (!CHANNEL_ACCESS_TOKEN) {
            console.error("❌ `CHANNEL_ACCESS_TOKEN` が設定されていません。");
            return res.status(500).json({ message: 'CHANNEL_ACCESS_TOKENが設定されていません。' });
        }

        try {
            const response = await axios.post(LINE_API_URL, {
                to: userId,
                messages: [
                    {
                        type: 'text',
                        text: "無料相談の受付ありがとうございます！😊\n\n以下の方法からお選びください。\n\n🔹 【簡単なご相談はこちら】このままLINEでOK！\n🔹 【じっくりご相談したい方はこちら】👉 https://blanca715.com/contact/\n\nどちらもお気軽にご利用くださいね♪"
                    }
                ]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
                }
            });

            console.log("✅ LINE API 応答:", response.data);
            return res.status(200).json({ message: '✅ メッセージが送信されました！' });

        } catch (error) {
            console.error("❌ LINEメッセージ送信エラー:", error.response?.data || error.message);
            return res.status(500).json({ message: 'メッセージ送信エラー', error: error.response?.data || error.message });
        }
    }

    res.status(405).json({ message: '❌ Method Not Allowed' });
}
