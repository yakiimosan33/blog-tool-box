'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface GeneratedTitle {
  title: string;
  id: string;
}

export default function TitleGeneratorPage() {
  const [content, setContent] = useState('');
  const [generatedTitles, setGeneratedTitles] = useState<GeneratedTitle[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTitles = () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    
    // コンテンツからキーワードを抽出
    const words = content.toLowerCase().split(/\s+/);
    const commonWords = ['の', 'は', 'が', 'を', 'に', 'で', 'と', 'から', 'まで', 'だ', 'である', 'です', 'ます', 'した', 'する', 'されて', 'という', 'その', 'この', 'あの', 'どの', 'なる', 'なった', 'ある', 'あった', 'いる', 'いた', 'たち', 'など', 'また', 'もう', 'まだ', 'とても', 'すぐに', 'やはり', 'きっと', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can'];
    const keywords = words
      .filter(word => word.length > 1 && !commonWords.includes(word))
      .slice(0, 5);

    // タイトル生成パターン
    const patterns = [
      // How-to パターン
      () => `${new Date().getFullYear()}年版：${getActionPhrase(keywords)}方法`,
      () => `${getActionPhrase(keywords)}ための${Math.floor(Math.random() * 10) + 5}つの方法`,
      () => `${capitalizeFirst(keywords[0] || '成功')}の完全ガイド`,
      () => `私が${getPastActionPhrase(keywords)}方法（あなたにもできる）`,
      
      // リストパターン
      () => `あなたの${capitalizeFirst(keywords[1] || '人生')}を変える${Math.floor(Math.random() * 10) + 10}個の${capitalizeFirst(keywords[0] || 'コツ')}`,
      () => `${capitalizeFirst(keywords[1] || '成功')}のためのトップ${Math.floor(Math.random() * 5) + 5}つの${capitalizeFirst(keywords[0] || '戦略')}`,
      () => `知っておくべき${Math.floor(Math.random() * 10) + 5}つの最高の${capitalizeFirst(keywords[0] || '方法')}`,
      
      // 質問パターン
      () => `なぜ${capitalizeFirst(keywords[0] || 'これ')}が${capitalizeFirst(keywords[1] || '成功')}の鍵なのか`,
      () => `${capitalizeFirst(keywords[0] || 'このトピック')}について誰もが間違っていること`,
      () => `${capitalizeFirst(keywords[0] || 'これ')}は本当に価値があるのか？私が発見したこと`,
      
      // 断言パターン
      () => `誰も語らない${capitalizeFirst(keywords[0] || '成功')}の真実`,
      () => `${capitalizeFirst(keywords[0] || 'これ')}が私の人生を変えた - その方法`,
      () => `${capitalizeFirst(keywords[0] || 'これ')}について知っておくべきすべて`,
      () => `${capitalizeFirst(keywords[0] || '初心者')}から${capitalizeFirst(keywords[1] || 'エキスパート')}への完全ガイド`,
      
      // 注目を集める/挑発的なパターン
      () => `${getActionPhrase(keywords)}をやめて - 代わりにこれをしよう`,
      () => `${capitalizeFirst(keywords[1] || '専門家')}が教えたくない${capitalizeFirst(keywords[0] || '秘密')}`,
      () => `30日間${capitalizeFirst(keywords[0] || 'これ')}を試した結果 - 何が起こったか`,
    ];

    // タイトルを生成
    const titles: GeneratedTitle[] = [];
    const usedPatterns = new Set<number>();
    const numberOfTitles = Math.floor(Math.random() * 3) + 8; // 8-10個のタイトルを生成

    while (titles.length < numberOfTitles && usedPatterns.size < patterns.length) {
      const patternIndex = Math.floor(Math.random() * patterns.length);
      if (!usedPatterns.has(patternIndex)) {
        usedPatterns.add(patternIndex);
        const title = patterns[patternIndex]();
        titles.push({
          title,
          id: Math.random().toString(36).substr(2, 9)
        });
      }
    }

    setTimeout(() => {
      setGeneratedTitles(titles);
      setIsGenerating(false);
    }, 500);
  };

  const getActionPhrase = (keywords: string[]) => {
    const actions = ['マスターする', '改善する', '向上させる', '強化する', '最適化する', '変革する'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return `${capitalizeFirst(keywords[0] || 'あなたのスキル')}を${action}`;
  };

  const getPastActionPhrase = (keywords: string[]) => {
    const actions = ['マスターした', '改善した', '向上させた', '強化した', '最適化した', '変革した'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    return `${capitalizeFirst(keywords[0] || '私のスキル')}を${action}`;
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const copyToClipboard = async (title: string, id: string) => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('テキストのコピーに失敗しました: ', err);
    }
  };

  return (
    <>
      <Header 
        title="SEOタイトル生成器" 
        subtitle="魅力的でSEOに最適化されたブログ投稿のタイトルを生成します"
      />
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div>
            <Card title="コンテンツを入力">
              <div className="space-y-4">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    ブログ投稿の内容またはトピック
                  </label>
                  <textarea
                    id="content"
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="ブログ投稿の内容、メイントピック、またはキーワードを入力してください..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {content.length} 文字
                  </p>
                </div>
                <Button
                  onClick={generateTitles}
                  disabled={!content.trim() || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? '生成中...' : 'タイトルを生成'}
                </Button>
              </div>
            </Card>
            
            {/* Tips Card */}
            <Card title="より良いタイトルのためのコツ" className="mt-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>SEO最適化されたタイトルのため、メインキーワードを含めてください</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>最適な検索結果のため、タイトルは50-60文字に保ってください</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>クリック率を高めるため、数字やパワーワードを使用してください</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>タイトルを選ぶ際は、ターゲットオーディエンスを考慮してください</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            <Card title="生成されたタイトル">
              {generatedTitles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  生成されたタイトルがここに表示されます
                </p>
              ) : (
                <div className="space-y-3">
                  {generatedTitles.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.title.length} 文字
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(item.title, item.id)}
                          className="flex-shrink-0"
                        >
                          {copiedId === item.id ? 'コピー完了!' : 'コピー'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}