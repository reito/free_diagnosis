import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId } = req.body; // 診断サイトの`result.html`から送信されたuserIdを取得

        // LINE APIのメッセージ送信
        const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
        const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN; // 環境変数に設定

        await axios.post(LINE_API_URL, {
            to: userId,
            messages: [
                {
                    type: 'text',
                    text: "無料相談の受付ありがとうございます！😊\n\n以下の方法からお選びください。\n\n🔹 【簡単なご相談はこちら】このままLINEでOK！\n🔹 【じっくりご相談したい方はこちら】👉 [お問い合わせフォームのリンク]\n\nどちらもお気軽にご利用くださいね♪"
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
            }
        });

        return res.status(200).json({ message: 'メッセージが送信されました！' });
    }

    res.status(405).json({ message: 'Method Not Allowed' });
}
