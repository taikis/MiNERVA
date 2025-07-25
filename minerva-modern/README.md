# MiNERVA Modern

<div align="center">
<img src="https://user-images.githubusercontent.com/60678028/144098618-e6d5ad57-76b2-4993-8f4c-9ca6fdadea67.png" width="500px">
</div>

来場者の行動履歴を追跡することができる、現代的な入室管理システムです。  
モダンなウェブ技術を使用し、使いやすさとセキュリティを向上させました。  
学祭や新入生歓迎会など、会場の中で来場者がある程度動くイベントで使用します。

## 機能概要

- QRコードを使用した来場者管理
- リアルタイムでの滞在者数・動向確認
- 管理者向けダッシュボード
- 来場者情報の安全な管理
- モバイル対応インターフェース

## 技術スタック

### フロントエンド
- React + TypeScript
- Material-UI
- React Query
- モダンなQRコードリーダーライブラリ

### バックエンド
- Node.js + Express
- JWT認証
- RESTful API設計
- OpenAPI仕様

### データベース
- PostgreSQL/MySQL
- Prisma ORM

### インフラ
- Docker コンテナ化
- CI/CD対応

## 開発環境のセットアップ

### 前提条件
- Node.js 18+
- Docker と Docker Compose
- Git

### インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/minerva-modern.git
cd minerva-modern

# フロントエンド依存関係のインストール
cd frontend
npm install
npm run dev

# 別のターミナルでバックエンドの起動
cd ../backend
npm install
npm run dev
```

## 使用方法

1. 管理者アカウントでログイン
2. イベント・場所の設定
3. QRコードの生成とダウンロード
4. チェックインスタッフにアクセス権を付与
5. イベント当日、来場者のQRコードをスキャン

詳細な使用方法は[ドキュメント](./docs/USAGE.md)を参照してください。

## ライセンス

このプロジェクトはGPL-3.0 Licenseで提供されています。

## 元のプロジェクト

このプロジェクトは[オリジナルのMiNERVA](https://github.com/taikis/MiNERVA)をモダンな技術スタックで再構築したものです。