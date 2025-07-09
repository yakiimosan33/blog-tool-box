'use client';

import React, { useState, useMemo } from 'react';
import { Header, Container, Card, Button } from '@/components';

interface Category {
  name: string;
  confidence: number;
  keywords: string[];
}

interface PredefinedCategory {
  name: string;
  keywords: string[];
  weight: number;
}

export default function CategoryClassifierPage() {
  const [content, setContent] = useState('');
  const [suggestedCategories, setSuggestedCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCategory, setCustomCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Predefined categories with associated keywords
  const predefinedCategories: PredefinedCategory[] = [
    {
      name: 'テクノロジー',
      keywords: ['code', 'programming', 'software', 'development', 'tech', 'computer', 'digital', 'web', 'app', 'javascript', 'python', 'react', 'api', 'database', 'framework', 'algorithm', 'data', 'cloud', 'ai', 'machine learning', 'artificial intelligence', 'コード', 'プログラミング', 'ソフトウェア', '開発', 'テクノロジー', 'コンピュータ', 'デジタル', 'ウェブ', 'アプリ', 'データベース', 'フレームワーク', 'アルゴリズム', 'データ', 'クラウド', 'AI', '機械学習', '人工知能'],
      weight: 1.0
    },
    {
      name: 'ビジネス',
      keywords: ['business', 'marketing', 'sales', 'revenue', 'profit', 'strategy', 'management', 'entrepreneur', 'startup', 'company', 'corporate', 'finance', 'investment', 'customer', 'market', 'brand', 'growth', 'productivity', 'leadership', 'innovation', 'ビジネス', 'マーケティング', '営業', '売上', '利益', '戦略', '管理', '起業家', 'スタートアップ', '会社', '企業', '顧客', '市場', 'ブランド', '成長', '生産性', 'リーダーシップ', 'イノベーション'],
      weight: 1.0
    },
    {
      name: '健康・ウェルネス',
      keywords: ['health', 'wellness', 'fitness', 'nutrition', 'diet', 'exercise', 'medical', 'mental health', 'therapy', 'doctor', 'hospital', 'medicine', 'healthy', 'lifestyle', 'yoga', 'meditation', 'stress', 'anxiety', 'depression', 'wellbeing', '健康', 'ウェルネス', 'フィットネス', '栄養', 'ダイエット', '運動', '医療', 'メンタルヘルス', 'セラピー', '医師', '病院', '薬', 'ヘルシー', 'ライフスタイル', 'ヨガ', '瞑想', 'ストレス', '不安', 'うつ'],
      weight: 1.0
    },
    {
      name: '旅行',
      keywords: ['travel', 'trip', 'vacation', 'destination', 'hotel', 'flight', 'tourism', 'adventure', 'explore', 'journey', 'backpack', 'city', 'country', 'culture', 'food', 'restaurant', 'guide', 'itinerary', 'experience', 'sightseeing', '旅行', '旅', '休暇', '目的地', 'ホテル', 'フライト', '観光', '冒険', '探索', '旅程', 'バックパック', '都市', '国', '文化', '食事', 'レストラン', 'ガイド', '行程', '体験', '観光'],
      weight: 1.0
    },
    {
      name: '食べ物・料理',
      keywords: ['food', 'cooking', 'recipe', 'kitchen', 'meal', 'ingredient', 'chef', 'restaurant', 'cuisine', 'dish', 'baking', 'flavor', 'taste', 'nutrition', 'healthy eating', 'vegetarian', 'vegan', 'organic', 'spice', 'wine', '食べ物', '料理', 'レシピ', 'キッチン', '食事', '食材', 'シェフ', 'レストラン', '料理', '料理', 'ベーキング', '味', '味覚', '栄養', 'ヘルシー', 'ベジタリアン', 'ビーガン', 'オーガニック', 'スパイス', 'ワイン'],
      weight: 1.0
    },
    {
      name: '教育',
      keywords: ['education', 'learning', 'school', 'university', 'student', 'teacher', 'course', 'study', 'knowledge', 'skill', 'training', 'academic', 'research', 'degree', 'certification', 'tutorial', 'lesson', 'classroom', 'online learning', 'e-learning', '教育', '学習', '学校', '大学', '学生', '先生', 'コース', '勉強', '知識', 'スキル', '訓練', '学術', '研究', '学位', '認定', 'チュートリアル', 'レッスン', '教室', 'オンライン学習', 'eラーニング'],
      weight: 1.0
    },
    {
      name: 'ライフスタイル',
      keywords: ['lifestyle', 'personal', 'life', 'daily', 'routine', 'habits', 'home', 'family', 'relationships', 'fashion', 'style', 'beauty', 'self-improvement', 'motivation', 'inspiration', 'happiness', 'mindfulness', 'goals', 'success', 'balance', 'ライフスタイル', '個人', '生活', '日常', 'ルーチン', '習慣', '家', '家族', '関係', 'ファッション', 'スタイル', '美容', '自己改善', 'モチベーション', 'インスピレーション', '幸福', 'マインドフルネス', '目標', '成功', 'バランス'],
      weight: 1.0
    },
    {
      name: 'エンターテイメント',
      keywords: ['entertainment', 'movie', 'film', 'music', 'game', 'gaming', 'tv', 'show', 'celebrity', 'art', 'culture', 'book', 'reading', 'review', 'streaming', 'podcast', 'comedy', 'drama', 'sports', 'event', 'エンターテイメント', '映画', 'フィルム', '音楽', 'ゲーム', 'ゲーミング', 'テレビ', 'ショー', 'セレブリティ', 'アート', '文化', '本', '読書', 'レビュー', 'ストリーミング', 'ポッドキャスト', 'コメディ', 'ドラマ', 'スポーツ', 'イベント'],
      weight: 1.0
    },
    {
      name: '金融',
      keywords: ['finance', 'money', 'investment', 'stock', 'trading', 'cryptocurrency', 'bitcoin', 'savings', 'budget', 'debt', 'loan', 'credit', 'banking', 'retirement', 'tax', 'wealth', 'financial planning', 'economy', 'market', 'portfolio', '金融', 'お金', '投資', '株式', 'トレーディング', '仮想通貨', 'ビットコイン', '貯蓄', '予算', '借金', 'ローン', 'クレジット', '銀行', '退職', '税金', '富', '財政計画', '経済', '市場', 'ポートフォリオ'],
      weight: 1.0
    },
    {
      name: '科学',
      keywords: ['science', 'research', 'study', 'experiment', 'discovery', 'technology', 'innovation', 'biology', 'chemistry', 'physics', 'mathematics', 'environment', 'climate', 'space', 'astronomy', 'genetics', 'evolution', 'scientific', 'theory', 'analysis', '科学', '研究', '勉強', '実験', '発見', '技術', '革新', '生物学', '化学', '物理学', '数学', '環境', '気候', '宇宙', '天文学', '遺伝学', '進化', '科学的', '理論', '分析'],
      weight: 1.0
    }
  ];

  const classifyContent = () => {
    setIsProcessing(true);
    
    // Clean and tokenize the content
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    const wordSet = new Set(words);
    const categories: Category[] = [];

    // Calculate confidence for each predefined category
    predefinedCategories.forEach(category => {
      const matchedKeywords: string[] = [];
      let totalScore = 0;

      category.keywords.forEach(keyword => {
        const keywordWords = keyword.split(' ');
        
        // Check for exact phrase match
        if (content.toLowerCase().includes(keyword)) {
          matchedKeywords.push(keyword);
          totalScore += keywordWords.length * 2; // Bonus for phrase match
        } else {
          // Check for individual word matches
          const wordMatches = keywordWords.filter(word => wordSet.has(word));
          if (wordMatches.length > 0) {
            matchedKeywords.push(keyword);
            totalScore += wordMatches.length;
          }
        }
      });

      if (matchedKeywords.length > 0) {
        // Calculate confidence as a percentage
        const maxPossibleScore = category.keywords.length * 2;
        const confidence = Math.min((totalScore / maxPossibleScore) * 100, 100);
        
        categories.push({
          name: category.name,
          confidence: Math.round(confidence),
          keywords: matchedKeywords.slice(0, 5) // Show top 5 matched keywords
        });
      }
    });

    // Sort by confidence and take top categories
    const sortedCategories = categories
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8);

    setSuggestedCategories(sortedCategories);
    setIsProcessing(false);
  };

  const toggleCategorySelection = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !customCategories.includes(customCategory.trim())) {
      setCustomCategories(prev => [...prev, customCategory.trim()]);
      setSelectedCategories(prev => [...prev, customCategory.trim()]);
      setCustomCategory('');
    }
  };

  const removeCustomCategory = (categoryName: string) => {
    setCustomCategories(prev => prev.filter(cat => cat !== categoryName));
    setSelectedCategories(prev => prev.filter(cat => cat !== categoryName));
  };

  const exportCategories = () => {
    const categoryList = selectedCategories.join(', ');
    const blob = new Blob([categoryList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-categories.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const categoryList = selectedCategories.join(', ');
    navigator.clipboard.writeText(categoryList);
  };

  const clearAll = () => {
    setContent('');
    setSuggestedCategories([]);
    setSelectedCategories([]);
    setCustomCategories([]);
    setCustomCategory('');
  };

  return (
    <Container className="py-8">
      <Header 
        title="カテゴリー分類器" 
        subtitle="ブログ投稿の内容を分析し、信頼度スコア付きのカテゴリー推奨を取得します"
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
                onClick={classifyContent}
                disabled={!content.trim() || isProcessing}
              >
                {isProcessing ? '分析中...' : 'カテゴリー分析'}
              </Button>
              <Button 
                variant="secondary"
                onClick={clearAll}
              >
                すべてクリア
              </Button>
            </div>
          </Card>

          {/* Custom Category Input */}
          <Card title="カスタムカテゴリー追加" className="mt-6">
            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="カスタムカテゴリー名を入力..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
              />
              <Button onClick={addCustomCategory} disabled={!customCategory.trim()}>
                追加
              </Button>
            </div>
            {customCategories.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  カスタムカテゴリー：
                </h4>
                <div className="flex flex-wrap gap-2">
                  {customCategories.map(category => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {category}
                      <button
                        onClick={() => removeCustomCategory(category)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {suggestedCategories.length > 0 && (
            <>
              <Card title="推奨カテゴリー" className="mb-6">
                <div className="space-y-3">
                  {suggestedCategories.map((category) => (
                    <div 
                      key={category.name}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCategories.includes(category.name)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleCategorySelection(category.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.name)}
                            onChange={() => toggleCategorySelection(category.name)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {category.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {category.confidence}%
                          </div>
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${category.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        マッチしたキーワード: {category.keywords.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Selected Categories */}
              {selectedCategories.length > 0 && (
                <Card title="選択されたカテゴリー" className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCategories.map(category => (
                      <span
                        key={category}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          customCategories.includes(category)
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {category}
                        <button
                          onClick={() => toggleCategorySelection(category)}
                          className="ml-1 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={exportCategories} size="sm">
                      カテゴリーエクスポート
                    </Button>
                    <Button onClick={copyToClipboard} variant="secondary" size="sm">
                      クリップボードにコピー
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}

          {suggestedCategories.length === 0 && content.trim() && !isProcessing && (
            <Card>
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                「カテゴリー分析」をクリックして、コンテンツのカテゴリー推奨を取得してください
              </p>
            </Card>
          )}

          {suggestedCategories.length === 0 && !content.trim() && (
            <Card>
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                ブログ投稿の内容を入力してカテゴリー分析を開始してください
              </p>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}