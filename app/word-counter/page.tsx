'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface WordCountStats {
  characterCount: number;
  characterCountNoSpaces: number;
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordLength: number;
  readingTime: number;
}

export default function WordCounterPage() {
  const [content, setContent] = useState('');
  const [stats, setStats] = useState<WordCountStats>({
    characterCount: 0,
    characterCountNoSpaces: 0,
    wordCount: 0,
    paragraphCount: 0,
    sentenceCount: 0,
    averageWordLength: 0,
    readingTime: 0,
  });

  const calculateStats = (text: string): WordCountStats => {
    // Character count
    const characterCount = text.length;
    const characterCountNoSpaces = text.replace(/\s/g, '').length;

    // Word count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = text.trim() === '' ? 0 : words.length;

    // Paragraph count
    const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
    const paragraphCount = text.trim() === '' ? 0 : paragraphs.length;

    // Sentence count
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const sentenceCount = sentences.length;

    // Average word length
    const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
    const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;

    // Reading time (based on 225 words per minute average)
    const readingTime = Math.ceil(wordCount / 225);

    return {
      characterCount,
      characterCountNoSpaces,
      wordCount,
      paragraphCount,
      sentenceCount,
      averageWordLength,
      readingTime,
    };
  };

  useEffect(() => {
    const newStats = calculateStats(content);
    setStats(newStats);
  }, [content]);

  const handleClear = () => {
    setContent('');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDecimal = (num: number) => {
    return num.toFixed(1);
  };

  return (
    <>
      <Header 
        title="文字数カウンター" 
        subtitle="ブログ投稿の内容をリアルタイム統計で分析します"
      />
      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <div>
            <Card title="コンテンツを入力">
              <div className="space-y-4">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    ブログ投稿の内容
                  </label>
                  <textarea
                    id="content"
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="ブログ投稿の内容を入力または貼り付けてください..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {formatNumber(stats.characterCount)} 文字
                  </p>
                </div>
                <Button
                  onClick={handleClear}
                  variant="secondary"
                  disabled={!content.trim()}
                  className="w-full"
                >
                  コンテンツをクリア
                </Button>
              </div>
            </Card>
            
            {/* Tips Card */}
            <Card title="文章作成のコツ" className="mt-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>包括的なブログ投稿の場合、1,500-2,500字を目指しましょう</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>読みやすさのため、段落は短く（3-5文）保ちましょう</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>平均読書時間はエンゲージメントの推定に役立ちます</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>文の長さを変化させてフローと読みやすさを向上させましょう</span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Statistics Section */}
          <div className="space-y-6">
            {/* Main Statistics */}
            <Card title="コンテンツ統計">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(stats.characterCount)}
                  </div>
                  <div className="text-sm text-gray-600">文字数</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(stats.wordCount)}
                  </div>
                  <div className="text-sm text-gray-600">単語数</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatNumber(stats.paragraphCount)}
                  </div>
                  <div className="text-sm text-gray-600">段落数</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatNumber(stats.sentenceCount)}
                  </div>
                  <div className="text-sm text-gray-600">文数</div>
                </div>
              </div>
            </Card>

            {/* Reading Time */}
            <Card title="読書時間">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {stats.readingTime} 分
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  予想読書時間
                </div>
                <div className="text-xs text-gray-500">
                  平均読書速度毎分60単語を基準
                </div>
              </div>
            </Card>

            {/* Detailed Statistics */}
            <Card title="詳細分析">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">文字数（スペース除く）</span>
                  <span className="text-sm text-gray-900">{formatNumber(stats.characterCountNoSpaces)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">平均単語長</span>
                  <span className="text-sm text-gray-900">{formatDecimal(stats.averageWordLength)} 文字</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">文あたりの単語数</span>
                  <span className="text-sm text-gray-900">
                    {stats.sentenceCount > 0 ? formatDecimal(stats.wordCount / stats.sentenceCount) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">段落あたりの文数</span>
                  <span className="text-sm text-gray-900">
                    {stats.paragraphCount > 0 ? formatDecimal(stats.sentenceCount / stats.paragraphCount) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-700">読書難易度</span>
                  <span className="text-sm text-gray-900">
                    {stats.averageWordLength < 4.5 ? '簡単' : 
                     stats.averageWordLength < 5.5 ? '中程度' : '難しい'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Content Health */}
            <Card title="コンテンツの品質">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">単語数</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      stats.wordCount < 300 ? 'bg-red-400' :
                      stats.wordCount < 1000 ? 'bg-yellow-400' :
                      stats.wordCount < 3000 ? 'bg-green-400' : 'bg-blue-400'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {stats.wordCount < 300 ? '短すぎる' :
                       stats.wordCount < 1000 ? '短い' :
                       stats.wordCount < 3000 ? '良い' : '長い'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">段落の長さ</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      stats.paragraphCount === 0 ? 'bg-gray-400' :
                      stats.wordCount / stats.paragraphCount > 100 ? 'bg-red-400' :
                      stats.wordCount / stats.paragraphCount > 50 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {stats.paragraphCount === 0 ? 'コンテンツなし' :
                       stats.wordCount / stats.paragraphCount > 100 ? '長すぎる' :
                       stats.wordCount / stats.paragraphCount > 50 ? '長い' : '良い'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">文の長さ</span>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      stats.sentenceCount === 0 ? 'bg-gray-400' :
                      stats.wordCount / stats.sentenceCount > 25 ? 'bg-red-400' :
                      stats.wordCount / stats.sentenceCount > 20 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {stats.sentenceCount === 0 ? 'コンテンツなし' :
                       stats.wordCount / stats.sentenceCount > 25 ? '長すぎる' :
                       stats.wordCount / stats.sentenceCount > 20 ? '長い' : '良い'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}