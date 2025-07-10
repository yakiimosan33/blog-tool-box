import Link from 'next/link';
import { Header, Container, Card } from '@/components';

export default function Home() {
  return (
    <>
      <Header title="ブログツールボックス" subtitle="コンテンツ作成者のための必須ツール集" />
      
      <Container className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/thumbnail-creator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-3">
                <span className="material-icons text-blue-500 text-3xl group-hover:text-blue-600">image</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">サムネイル作成</h3>
                  <p className="text-gray-600">
                    カスタマイズ可能なテンプレート、テキストオーバーレイ、グラデーション背景で、ブログ記事や動画の印象的なサムネイルを作成できます。
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/title-generator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-3">
                <span className="material-icons text-green-500 text-3xl group-hover:text-green-600">title</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">タイトル生成</h3>
                  <p className="text-gray-600">
                    コンテンツやキーワードに基づいたAI搭載の提案機能で、SEOに適したブログ記事のタイトルを生成できます。
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/keyword-extractor">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-3">
                <span className="material-icons text-purple-500 text-3xl group-hover:text-purple-600">manage_search</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">キーワード抽出</h3>
                  <p className="text-gray-600">
                    SEO最適化とコンテンツ分析のために、あなたのコンテンツから関連するキーワードを抽出できます。
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/category-classifier">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-3">
                <span className="material-icons text-orange-500 text-3xl group-hover:text-orange-600">category</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">カテゴリー分類</h3>
                  <p className="text-gray-600">
                    ブログコンテンツを分析し、信頼度スコアと共にAI搭載のカテゴリー提案を受けて、より良いコンテンツ整理を実現できます。
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/link-checker">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-3">
                <span className="material-icons text-red-500 text-3xl group-hover:text-red-600">link</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">リンクチェック</h3>
                  <p className="text-gray-600">
                    コンテンツからリンクを抽出して検証します。URLの有効性を確認し、リンク一覧をCSVやテキストとして出力できます。
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/templates">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start space-x-3">
                <span className="material-icons text-indigo-500 text-3xl group-hover:text-indigo-600">description</span>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">ブログテンプレート</h3>
                  <p className="text-gray-600">
                    様々なコンテンツタイプに対応したブログ記事テンプレートにアクセスし、カスタムテンプレートを作成して、変数を簡単に埋め込めます。
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </Container>
    </>
  );
}