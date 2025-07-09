'use client';

import React, { useState, useMemo } from 'react';
import { Header, Container, Card, Button } from '@/components';

interface LinkInfo {
  url: string;
  anchorText: string;
  isValid: boolean;
  protocol: string;
  domain: string;
  index: number;
}

export default function LinkCheckerPage() {
  const [content, setContent] = useState('');
  const [links, setLinks] = useState<LinkInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // URL validation regex
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

  // More comprehensive regex to find links with anchor text
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  
  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const extractLinks = () => {
    setIsProcessing(true);
    const foundLinks: LinkInfo[] = [];
    let linkIndex = 0;

    // First, extract HTML links with anchor text
    let htmlMatch;
    const htmlRegexCopy = new RegExp(linkRegex);
    while ((htmlMatch = htmlRegexCopy.exec(content)) !== null) {
      const url = htmlMatch[1];
      const anchorText = htmlMatch[2].replace(/<[^>]*>/g, '').trim(); // Remove HTML tags from anchor text
      
      if (url && url.startsWith('http')) {
        try {
          const urlObj = new URL(url);
          foundLinks.push({
            url,
            anchorText: anchorText || 'アンカーテキストなし',
            isValid: validateUrl(url),
            protocol: urlObj.protocol,
            domain: urlObj.hostname,
            index: linkIndex++
          });
        } catch {
          foundLinks.push({
            url,
            anchorText: anchorText || 'アンカーテキストなし',
            isValid: false,
            protocol: '',
            domain: '',
            index: linkIndex++
          });
        }
      }
    }

    // Then, extract plain URLs (not already captured in HTML links)
    let plainUrlMatch;
    const urlRegexCopy = new RegExp(urlRegex);
    const htmlUrls = new Set(foundLinks.map(link => link.url));
    
    while ((plainUrlMatch = urlRegexCopy.exec(content)) !== null) {
      const url = plainUrlMatch[0];
      if (!htmlUrls.has(url)) {
        try {
          const urlObj = new URL(url);
          foundLinks.push({
            url,
            anchorText: 'プレーンURL（アンカーテキストなし）',
            isValid: validateUrl(url),
            protocol: urlObj.protocol,
            domain: urlObj.hostname,
            index: linkIndex++
          });
        } catch {
          foundLinks.push({
            url,
            anchorText: 'プレーンURL（アンカーテキストなし）',
            isValid: false,
            protocol: '',
            domain: '',
            index: linkIndex++
          });
        }
      }
    }

    setLinks(foundLinks);
    setIsProcessing(false);
  };

  const exportAsCSV = () => {
    const csvContent = [
      ['URL', 'Anchor Text', 'Status', 'Protocol', 'Domain'],
      ...links.map(link => [
        link.url,
        link.anchorText,
        link.isValid ? 'Valid' : 'Invalid',
        link.protocol,
        link.domain
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const textContent = links.map(link => 
      `${link.url} - "${link.anchorText}" - ${link.isValid ? 'Valid' : 'Invalid'}`
    ).join('\n');

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const linkList = links.map(link => link.url).join('\n');
    navigator.clipboard.writeText(linkList);
  };

  const statistics = useMemo(() => {
    const totalLinks = links.length;
    const validLinks = links.filter(link => link.isValid).length;
    const invalidLinks = totalLinks - validLinks;
    const uniqueDomains = new Set(links.map(link => link.domain)).size;
    
    return {
      totalLinks,
      validLinks,
      invalidLinks,
      uniqueDomains
    };
  }, [links]);

  return (
    <Container className="py-8">
      <Header 
        title="リンクチェッカー" 
        subtitle="ブログ投稿の内容からリンクを抽出・検証します"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div>
          <Card title="リンクを含むコンテンツ">
            <textarea
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="コンテンツをここに貼り付けてください... 
              
例：
- HTMLリンク: <a href='https://example.com'>リンクテキスト</a>
- プレーンURL: https://example.com
- 両方を含むコンテンツ"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-4 flex gap-4">
              <Button 
                onClick={extractLinks}
                disabled={!content.trim() || isProcessing}
              >
                {isProcessing ? '処理中...' : 'リンク抽出'}
              </Button>
              <Button 
                variant="secondary"
                onClick={() => {
                  setContent('');
                  setLinks([]);
                }}
              >
                クリア
              </Button>
            </div>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {links.length > 0 && (
            <>
              <Card title="リンク統計" className="mb-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {statistics.totalLinks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      総リンク数
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {statistics.validLinks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      有効リンク
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {statistics.invalidLinks}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      無効リンク
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {statistics.uniqueDomains}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ユニークドメイン
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button onClick={exportAsCSV} size="sm">
                    CSVエクスポート
                  </Button>
                  <Button onClick={exportAsText} size="sm" variant="secondary">
                    テキストエクスポート
                  </Button>
                  <Button onClick={copyToClipboard} variant="secondary" size="sm">
                    URLコピー
                  </Button>
                </div>
              </Card>

              <Card title="見つかったリンク">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {links.map((link) => (
                    <div 
                      key={link.index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              #{link.index + 1}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              link.isValid 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {link.isValid ? '有効' : '無効'}
                            </span>
                            {link.protocol && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {link.protocol.replace(':', '')}
                              </span>
                            )}
                          </div>
                          
                          <div className="mb-2">
                            <a 
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium break-all"
                            >
                              {link.url}
                            </a>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>アンカーテキスト:</strong> {link.anchorText}
                          </div>
                          
                          {link.domain && (
                            <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                              <strong>ドメイン:</strong> {link.domain}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {links.length === 0 && content.trim() && !isProcessing && (
            <Card>
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                「リンク抽出」をクリックしてコンテンツを分析してください
              </p>
            </Card>
          )}
          
          {links.length === 0 && !content.trim() && (
            <Card>
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                リンクを含むコンテンツをテキストエリアに貼り付けて開始してください
              </p>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}