# タスク期限設定機能

このドキュメントでは、TODOアプリに新しく追加されたタスク期限設定機能について説明します。

## 🚀 新機能概要

### 期限日時の設定・編集

- タスク作成時に期限日時を設定可能
- タスク編集時に期限日時を変更可能
- 期限設定は任意（必須ではない）
- 分単位まで考慮した正確な日時設定

### 期限日時の表示

- タスク一覧で期限日時を表示
- 残り時間の動的計算と表示
- 期限切れ状態の視覚的な表示
- 今日が期限のタスクのハイライト

## 📁 実装ファイル

### 新規作成ファイル

#### ユーティリティ

- `src/utils/dateUtils.js` - 日時フォーマット・計算関数

#### UIコンポーネント

- `src/components/DateTimePicker.jsx` - 日時選択コンポーネント
- `src/components/DateTimePicker.css` - DateTimePicker スタイル
- `src/components/TaskLimit.jsx` - 期限表示コンポーネント
- `src/components/TaskLimit.css` - TaskLimit スタイル

### 更新ファイル

#### Redux Store

- `src/store/task/index.js` - limitフィールドサポート追加

#### コンポーネント

- `src/components/TaskItem.jsx` - 期限表示を追加
- `src/components/TaskItem.css` - 期限表示スタイル追加
- `src/components/TaskCreateForm.jsx` - 期限設定フィールド追加
- `src/components/TaskCreateForm.css` - 期限設定フィールドスタイル追加
- `src/components/index.js` - 新コンポーネントをエクスポート

#### ページ

- `src/pages/lists/[listId]/tasks/[taskId]/index.page.jsx` - 期限編集機能追加

## 🔧 技術仕様

### APIフォーマット

```
期限フィールド: "YYYY-MM-DDTHH:MM:SSZ"
例: "2022-07-15T11:11:11Z"
```

### データ型

- フロントエンド: `Date` オブジェクト
- API送信時: ISO 8601 文字列（UTC）
- 表示用: ローカル時間でフォーマット

### 主要関数

#### `formatToISO(date)`

DateオブジェクトをISO 8601形式に変換

#### `formatToDatetimeLocal(date)`

DateオブジェクトをHTML5 datetime-local形式に変換

#### `formatDisplayDate(date)`

読みやすい日本語形式で日時を表示

#### `calculateTimeRemaining(limitDate)`

現在時刻から期限までの残り時間を計算し、表示用テキストを生成

## 🎨 UIデザイン

### 期限表示

- **通常**: グレー文字で日時と残り時間を表示
- **今日期限**: オレンジ色でハイライト
- **期限切れ**: 赤色で「○○前に期限切れ」を表示

### 期限設定

- HTML5 `datetime-local` inputを使用
- カスタムスタイルでアプリのデザインに統一
- ラベル付きで使いやすさを向上

## 📱 使用方法

### タスク作成時

1. タスクタイトルを入力
2. 詳細情報を入力（任意）
3. 期限日時を設定（任意）
4. 「Add」ボタンでタスクを作成

### タスク編集時

1. タスク詳細ページを開く
2. 期限フィールドで日時を変更
3. 「Update」ボタンで変更を保存

### 期限表示の確認

- タスク一覧で各タスクの期限と残り時間を確認
- 期限切れタスクは赤色で表示
- 今日期限のタスクはオレンジ色で表示

## 🔄 バックエンド連携

バックエンドAPIは既に期限フィールドをサポートしているため、フロントエンドの変更のみで機能が有効になります。

### APIリクエスト例

```javascript
// タスク作成
POST /lists/{listId}/tasks
{
  "title": "買い物",
  "detail": "牛乳を買う",
  "done": false,
  "limit": "2022-07-15T11:11:11Z"
}

// タスク更新
PUT /lists/{listId}/tasks/{taskId}
{
  "title": "買い物",
  "detail": "牛乳を買う",
  "done": false,
  "limit": "2022-07-15T15:30:00Z"
}
```

## 🧪 テスト方法

1. 開発サーバーを起動: `yarn dev`
2. TODOアプリにアクセス
3. 新しいタスクを作成し、期限を設定
4. タスク一覧で期限表示を確認
5. タスク編集ページで期限を変更
6. 期限切れ・今日期限の表示を確認

## 🚀 今後の拡張可能性

- 期限通知機能
- 期限によるタスクソート
- 期限フィルター機能
- リマインダー設定
- カレンダービュー

---

この機能により、ユーザーはタスクに期限を設定し、効率的にタスク管理を行うことができるようになります。
