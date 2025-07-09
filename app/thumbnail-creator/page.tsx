'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Header, Container, Card, Button } from '@/components';

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
}

interface ThumbnailTemplate {
  name: string;
  width: number;
  height: number;
  background: string;
  textLayers: Omit<TextLayer, 'id'>[];
}

const FONT_OPTIONS = [
  'Arial',
  'Georgia',
  'Times New Roman',
  'Verdana',
  'Helvetica',
  'Courier New',
  'Impact',
  'Comic Sans MS',
];

const TEMPLATES: ThumbnailTemplate[] = [
  {
    name: 'YouTubeサムネイル',
    width: 1280,
    height: 720,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textLayers: [
      {
        text: 'ここにタイトルを入力',
        x: 640,
        y: 360,
        fontSize: 72,
        fontFamily: 'Arial',
        color: '#ffffff',
        bold: true,
        italic: false,
      },
    ],
  },
  {
    name: 'ブログヘッダー',
    width: 1200,
    height: 630,
    background: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    textLayers: [
      {
        text: 'ブログ投稿タイトル',
        x: 600,
        y: 280,
        fontSize: 64,
        fontFamily: 'Georgia',
        color: '#ffffff',
        bold: true,
        italic: false,
      },
      {
        text: 'サブタイトルまたはキャッチフレーズ',
        x: 600,
        y: 380,
        fontSize: 32,
        fontFamily: 'Georgia',
        color: '#ffffff',
        bold: false,
        italic: true,
      },
    ],
  },
  {
    name: 'SNS投稿',
    width: 1080,
    height: 1080,
    background: '#1a1a1a',
    textLayers: [
      {
        text: 'インパクトを与える',
        x: 540,
        y: 540,
        fontSize: 80,
        fontFamily: 'Impact',
        color: '#ffcc00',
        bold: false,
        italic: false,
      },
    ],
  },
  {
    name: 'ミニマルデザイン',
    width: 1200,
    height: 675,
    background: '#ffffff',
    textLayers: [
      {
        text: 'シンプル&クリーン',
        x: 600,
        y: 337,
        fontSize: 48,
        fontFamily: 'Helvetica',
        color: '#333333',
        bold: false,
        italic: false,
      },
    ],
  },
];

export default function ThumbnailCreator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1280, height: 720 });
  const [background, setBackground] = useState('#ffffff');
  const [isGradient, setIsGradient] = useState(false);
  const [gradientStart, setGradientStart] = useState('#667eea');
  const [gradientEnd, setGradientEnd] = useState('#764ba2');
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  useEffect(() => {
    drawCanvas();
  }, [canvasSize, background, isGradient, gradientStart, gradientEnd, textLayers]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (isGradient) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, gradientStart);
      gradient.addColorStop(1, gradientEnd);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = background;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text layers
    textLayers.forEach((layer) => {
      ctx.save();
      
      // Set font properties
      const fontStyle = [];
      if (layer.bold) fontStyle.push('bold');
      if (layer.italic) fontStyle.push('italic');
      fontStyle.push(`${layer.fontSize}px`);
      fontStyle.push(layer.fontFamily);
      
      ctx.font = fontStyle.join(' ');
      ctx.fillStyle = layer.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw text with shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(layer.text, layer.x, layer.y);
      ctx.restore();
    });
  };

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      text: '新しいテキスト',
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      fontSize: 48,
      fontFamily: 'Arial',
      color: '#ffffff',
      bold: false,
      italic: false,
    };
    setTextLayers([...textLayers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(textLayers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ));
  };

  const deleteTextLayer = (id: string) => {
    setTextLayers(textLayers.filter(layer => layer.id !== id));
    if (selectedLayerId === id) {
      setSelectedLayerId(null);
    }
  };

  const loadTemplate = (template: ThumbnailTemplate) => {
    setCanvasSize({ width: template.width, height: template.height });
    
    if (template.background.startsWith('linear-gradient')) {
      setIsGradient(true);
      // Extract colors from gradient string
      const colors = template.background.match(/#[0-9a-fA-F]{6}/g) || ['#667eea', '#764ba2'];
      setGradientStart(colors[0]);
      setGradientEnd(colors[1]);
    } else {
      setIsGradient(false);
      setBackground(template.background);
    }
    
    const newLayers = template.textLayers.map((layer, index) => ({
      ...layer,
      id: Date.now().toString() + index,
    }));
    setTextLayers(newLayers);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'サムネイル.png';
    link.click();
  };

  const selectedLayer = textLayers.find(layer => layer.id === selectedLayerId);

  return (
    <>
      <Header 
        title="サムネイル作成器" 
        subtitle="ブログ投稿や動画用の素晴らしいサムネイルを作成します"
      />
      
      <Container className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card title="キャンバス">
              <div className="mb-4">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="w-full border border-gray-300 rounded"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={addTextLayer}>テキストレイヤー追加</Button>
                <Button onClick={exportImage} variant="primary">PNGでエクスポート</Button>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Templates */}
            <Card title="テンプレート">
              <div className="space-y-2">
                {TEMPLATES.map((template, index) => (
                  <Button
                    key={index}
                    onClick={() => loadTemplate(template)}
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    {template.name} ({template.width}x{template.height})
                  </Button>
                ))}
              </div>
            </Card>

            {/* Canvas Settings */}
            <Card title="キャンバス設定">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    サイズ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={canvasSize.width}
                      onChange={(e) => setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) || 1280 })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="幅"
                    />
                    <span className="self-center">×</span>
                    <input
                      type="number"
                      value={canvasSize.height}
                      onChange={(e) => setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) || 720 })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="高さ"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    背景
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isGradient}
                        onChange={(e) => setIsGradient(e.target.checked)}
                        className="mr-2"
                      />
                      グラデーション使用
                    </label>
                    
                    {isGradient ? (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={gradientStart}
                          onChange={(e) => setGradientStart(e.target.value)}
                          className="flex-1 h-10"
                        />
                        <input
                          type="color"
                          value={gradientEnd}
                          onChange={(e) => setGradientEnd(e.target.value)}
                          className="flex-1 h-10"
                        />
                      </div>
                    ) : (
                      <input
                        type="color"
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        className="w-full h-10"
                      />
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Text Layer Settings */}
            {selectedLayer && (
              <Card title="テキストレイヤー設定">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      テキスト
                    </label>
                    <input
                      type="text"
                      value={selectedLayer.text}
                      onChange={(e) => updateTextLayer(selectedLayer.id, { text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        X位置
                      </label>
                      <input
                        type="number"
                        value={selectedLayer.x}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Y位置
                      </label>
                      <input
                        type="number"
                        value={selectedLayer.y}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      フォントファミリー
                    </label>
                    <select
                      value={selectedLayer.fontFamily}
                      onChange={(e) => updateTextLayer(selectedLayer.id, { fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {FONT_OPTIONS.map(font => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      フォントサイズ
                    </label>
                    <input
                      type="number"
                      value={selectedLayer.fontSize}
                      onChange={(e) => updateTextLayer(selectedLayer.id, { fontSize: parseInt(e.target.value) || 48 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      色
                    </label>
                    <input
                      type="color"
                      value={selectedLayer.color}
                      onChange={(e) => updateTextLayer(selectedLayer.id, { color: e.target.value })}
                      className="w-full h-10"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLayer.bold}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { bold: e.target.checked })}
                        className="mr-2"
                      />
                      太字
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLayer.italic}
                        onChange={(e) => updateTextLayer(selectedLayer.id, { italic: e.target.checked })}
                        className="mr-2"
                      />
                      イタリック
                    </label>
                  </div>

                  <Button
                    onClick={() => deleteTextLayer(selectedLayer.id)}
                    variant="danger"
                    className="w-full"
                  >
                    レイヤー削除
                  </Button>
                </div>
              </Card>
            )}

            {/* Text Layers List */}
            {textLayers.length > 0 && (
              <Card title="テキストレイヤー">
                <div className="space-y-2">
                  {textLayers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedLayerId === layer.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {layer.text}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}