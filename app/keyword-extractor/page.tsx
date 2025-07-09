'use client';

import React, { useState, useMemo } from 'react';
import { Header, Container, Card, Button } from '@/components';

interface Keyword {
  word: string;
  count: number;
  relevance: number;
}

export default function KeywordExtractorPage() {
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
    'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'to', 'of', 'in', 'for',
    'with', 'by', 'from', 'up', 'out', 'if', 'then', 'than', 'but', 'or',
    'and', 'so', 'because', 'when', 'where', 'what', 'who', 'why', 'how',
    'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we',
    'they', 'them', 'their', 'there', 'here', 'all', 'some', 'no', 'not',
    'its', 'my', 'your', 'our', 'his', 'her', 'me', 'him', 'us', 'am'
  ]);

  const extractKeywords = () => {
    setIsProcessing(true);
    
    // Clean and tokenize the content
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2) // Filter short words
      .filter(word => !stopWords.has(word)) // Remove stop words
      .filter(word => !/^\d+$/.test(word)); // Remove pure numbers

    // Count word frequency
    const wordFrequency = new Map<string, number>();
    words.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });

    // Calculate total words for relevance scoring
    const totalWords = words.length;
    const uniqueWords = wordFrequency.size;

    // Convert to array and calculate relevance
    const keywordArray: Keyword[] = Array.from(wordFrequency.entries())
      .map(([word, count]) => ({
        word,
        count,
        // Relevance score based on frequency and inverse document frequency
        relevance: (count / totalWords) * Math.log(totalWords / count)
      }))
      .filter(keyword => keyword.count > 1) // Only words that appear more than once
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 30); // Top 30 keywords

    setKeywords(keywordArray);
    setIsProcessing(false);
  };

  const exportKeywords = () => {
    const keywordList = keywords.map(k => k.word).join(', ');
    const blob = new Blob([keywordList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keywords.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const keywordList = keywords.map(k => k.word).join(', ');
    navigator.clipboard.writeText(keywordList);
  };

  const totalKeywords = keywords.length;
  const averageFrequency = keywords.length > 0 
    ? (keywords.reduce((sum, k) => sum + k.count, 0) / keywords.length).toFixed(1)
    : 0;

  return (
    <Container className="py-8">
      <Header 
        title="キーワード抽出器" 
        subtitle="ブログ投稿の内容からキーワードを抽出・分析します"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card title="ブログ投稿の内容">
            <textarea
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="ブログ投稿の内容をここに貼り付けてください..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-4 flex gap-4">
              <Button 
                onClick={extractKeywords}
                disabled={!content.trim() || isProcessing}
              >
                {isProcessing ? '処理中...' : 'キーワード抽出'}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => {
                  setContent('');
                  setKeywords([]);
                }}
              >
                クリア
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {keywords.length > 0 && (
            <>
              <Card title="キーワード分析" className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {totalKeywords}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      見つかったキーワード
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {averageFrequency}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      平均出現回数
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={exportKeywords} size="sm">
                    ファイルにエクスポート
                  </Button>
                  <Button onClick={copyToClipboard} variant="secondary" size="sm">
                    クリップボードにコピー
                  </Button>
                </div>
              </Card>

              <Card title="キーワードと出現回数">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={keyword.word}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {keyword.word}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {keyword.count}x
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            出現回数
                          </div>
                        </div>
                        <div className="w-24">
                          <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(keyword.relevance / keywords[0].relevance) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {keywords.length === 0 && content.trim() && !isProcessing && (
            <Card>
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                「キーワード抽出」をクリックして内容を分析してください
              </p>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}