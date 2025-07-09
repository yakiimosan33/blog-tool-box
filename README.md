# Blog ToolBox

ブログ運営を効率化する9つのミニアプリ

## Features

1. **タイトル生成** - SEOに強い魅力的なタイトルを自動生成
2. **キーワード抽出** - 記事から重要なキーワードを抽出
3. **サムネイル作成** - 簡単にアイキャッチ画像を作成
4. **文字数カウント** - 記事の文字数と読了時間を計算
5. **カテゴリ分類** - 記事を適切なカテゴリに分類
6. **リンクチェッカー** - リンク切れを確認・管理
7. **スケジュール管理** - 投稿スケジュールを管理
8. **アイデアメモ** - ブログのアイデアを記録・整理
9. **テンプレート集** - 記事テンプレートを管理

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: React 19
- **Storage**: localStorage (no backend required)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deploy to Vercel

Click the button below to deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/blog-toolbox)

Or manually deploy:

```bash
npm run build
vercel --prod
```

## Project Structure

```
blog-toolbox/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── title-generator/
│   ├── keyword-extractor/
│   ├── thumbnail-creator/
│   ├── word-counter/
│   ├── category-classifier/
│   ├── link-checker/
│   ├── schedule-manager/
│   ├── idea-memo/
│   └── templates/
├── components/
│   ├── Header.tsx
│   ├── Container.tsx
│   ├── Card.tsx
│   └── Button.tsx
└── styles/
    └── globals.css
```

## Features Detail

### 1. Title Generator
- SEO-friendly title generation
- Multiple title suggestions
- Copy to clipboard functionality
- Character count tracking

### 2. Keyword Extractor
- Advanced keyword extraction
- Frequency analysis
- Export functionality
- Copy to clipboard

### 3. Thumbnail Creator
- Canvas-based image creation
- Text overlays and styling
- Background customization
- Export as PNG

### 4. Word Counter
- Real-time statistics
- Reading time calculation
- Writing tips and analysis
- Comprehensive metrics

### 5. Category Classifier
- AI-powered category suggestions
- Confidence scoring
- Custom category support
- Export functionality

### 6. Link Checker
- URL extraction and validation
- Export as CSV/text
- Link analysis and statistics
- Copy to clipboard

### 7. Schedule Manager
- Calendar view (monthly/weekly)
- Drag-and-drop scheduling
- Post status tracking
- localStorage persistence

### 8. Idea Memo
- Rich note-taking
- Priority and status tracking
- Search and filter
- Export as Markdown

### 9. Templates
- Pre-built templates
- Custom template creation
- Variable placeholders
- Copy functionality

## License

MIT