import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "予約完了",
  robots: { index: false },
};

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
        <CheckCircle size={56} className="text-green-500 mx-auto mb-5" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">ご予約が完了しました</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          ご登録のメールアドレスに確認メールをお送りしました。
          チェックインの詳細情報は追ってご連絡いたします。
        </p>
        <div className="bg-amber-50 rounded-2xl p-4 text-sm text-amber-800 mb-8">
          チェックイン時間: 15:00〜<br />
          チェックアウト時間: 〜11:00
        </div>
        <Link
          href="/"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
