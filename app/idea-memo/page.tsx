'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

// Types
interface IdeaMemo {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'idea' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface IdeaFormData {
  title: string;
  content: string;
  category: string;
  tags: string;
  priority: 'high' | 'medium' | 'low';
  status: 'idea' | 'in-progress' | 'completed';
}

// Constants
const STORAGE_KEY = 'blog-toolbox-idea-memos';
const CATEGORIES = ['一般', '技術', 'チュートリアル', 'レビュー', '意見', 'ニュース', '個人'];
const PRIORITIES = ['high', 'medium', 'low'] as const;
const STATUSES = ['idea', 'in-progress', 'completed'] as const;

export default function IdeaMemoPage() {
  const [ideas, setIdeas] = useState<IdeaMemo[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<IdeaMemo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title' | 'priority'>('updatedAt');
  const [formData, setFormData] = useState<IdeaFormData>({
    title: '',
    content: '',
    category: '',
    tags: '',
    priority: 'medium',
    status: 'idea'
  });

  // Load ideas from localStorage on component mount
  useEffect(() => {
    const savedIdeas = localStorage.getItem(STORAGE_KEY);
    if (savedIdeas) {
      try {
        const parsed = JSON.parse(savedIdeas);
        setIdeas(parsed);
      } catch (error) {
        console.error('Error parsing saved ideas:', error);
      }
    }
  }, []);

  // Save ideas to localStorage whenever ideas change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  }, [ideas]);

  // Filter and sort ideas
  useEffect(() => {
    let filtered = ideas.filter(idea => {
      const matchesSearch = !searchTerm || 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !filterCategory || idea.category === filterCategory;
      const matchesStatus = !filterStatus || idea.status === filterStatus;
      const matchesPriority = !filterPriority || idea.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });

    // Sort ideas
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    setFilteredIdeas(filtered);
  }, [ideas, searchTerm, filterCategory, filterStatus, filterPriority, sortBy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('アイデアのタイトルを入力してください');
      return;
    }

    const now = new Date().toISOString();
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (editingId) {
      // Update existing idea
      setIdeas(prev => prev.map(idea => 
        idea.id === editingId 
          ? { ...idea, ...formData, tags, updatedAt: now }
          : idea
      ));
      setEditingId(null);
    } else {
      // Create new idea
      const newIdea: IdeaMemo = {
        id: Date.now().toString(),
        ...formData,
        tags,
        createdAt: now,
        updatedAt: now
      };
      setIdeas(prev => [...prev, newIdea]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: '',
      priority: 'medium',
      status: 'idea'
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (idea: IdeaMemo) => {
    setFormData({
      title: idea.title,
      content: idea.content,
      category: idea.category,
      tags: idea.tags.join(', '),
      priority: idea.priority,
      status: idea.status
    });
    setEditingId(idea.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('このアイデアを削除してもよろしいですか？')) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const handleExport = (format: 'markdown' | 'text') => {
    const exportData = filteredIdeas.map(idea => {
      if (format === 'markdown') {
        return `# ${idea.title}

**Category:** ${idea.category}
**Priority:** ${idea.priority}
**Status:** ${idea.status}
**Tags:** ${idea.tags.join(', ')}
**Created:** ${new Date(idea.createdAt).toLocaleDateString()}
**Updated:** ${new Date(idea.updatedAt).toLocaleDateString()}

${idea.content}

---

`;
      } else {
        return `Title: ${idea.title}
Category: ${idea.category}
Priority: ${idea.priority}
Status: ${idea.status}
Tags: ${idea.tags.join(', ')}
Created: ${new Date(idea.createdAt).toLocaleDateString()}
Updated: ${new Date(idea.updatedAt).toLocaleDateString()}

${idea.content}

${'='.repeat(50)}

`;
      }
    }).join('');

    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idea-memos.${format === 'markdown' ? 'md' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = useMemo(() => {
    return {
      total: ideas.length,
      byStatus: {
        idea: ideas.filter(i => i.status === 'idea').length,
        'in-progress': ideas.filter(i => i.status === 'in-progress').length,
        completed: ideas.filter(i => i.status === 'completed').length
      },
      byPriority: {
        high: ideas.filter(i => i.priority === 'high').length,
        medium: ideas.filter(i => i.priority === 'medium').length,
        low: ideas.filter(i => i.priority === 'low').length
      }
    };
  }, [ideas]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="アイデアメモ" subtitle="ブログ投稿のアイデアを整理・管理します" />
      
      <Container className="py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">総アイデア数</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.byStatus.completed}</div>
              <div className="text-sm text-gray-600">完了</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.byStatus['in-progress']}</div>
              <div className="text-sm text-gray-600">進行中</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{stats.byPriority.high}</div>
              <div className="text-sm text-gray-600">高優先度</div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={() => setShowForm(true)}>
            新しいアイデア
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={() => handleExport('markdown')}
              disabled={filteredIdeas.length === 0}
            >
              Markdownでエクスポート
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => handleExport('text')}
              disabled={filteredIdeas.length === 0}
            >
              テキストでエクスポート
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アイデアを検索
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="タイトル、内容、またはタグで検索..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  並び替え
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="updatedAt">更新日時順</option>
                  <option value="createdAt">作成日時順</option>
                  <option value="title">タイトル順</option>
                  <option value="priority">優先度順</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリー
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全てのカテゴリー</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全てのステータス</option>
                  {STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status === 'idea' ? 'アイデア' : status === 'in-progress' ? '進行中' : '完了'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  優先度
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全ての優先度</option>
                  {PRIORITIES.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingId ? 'アイデア編集' : '新しいアイデア'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      タイトル *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      内容
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ブログ投稿のアイデアを説明してください..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        カテゴリー
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">カテゴリーを選択</option>
                        {CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        タグ
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="JavaScript, React, チュートリアル (カンマ区切り)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        優先度
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {PRIORITIES.map(priority => (
                          <option key={priority} value={priority}>
                            {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ステータス
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {STATUSES.map(status => (
                          <option key={status} value={status}>
                            {status === 'idea' ? 'アイデア' : status === 'in-progress' ? '進行中' : '完了'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="secondary" onClick={resetForm}>
                      キャンセル
                    </Button>
                    <Button type="submit">
                      {editingId ? 'アイデア更新' : 'アイデア作成'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Ideas List */}
        <div className="space-y-4">
          {filteredIdeas.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {ideas.length === 0 
                    ? 'まだアイデアがありません。最初のアイデアを作成しましょう！' 
                    : '現在のフィルターに一致するアイデアがありません。'}
                </p>
              </div>
            </Card>
          ) : (
            filteredIdeas.map(idea => (
              <Card key={idea.id}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(idea)}>
                      編集
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(idea.id)}>
                      削除
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(idea.priority)}`}>
                    {idea.priority === 'high' ? '高' : idea.priority === 'medium' ? '中' : '低'} 優先度
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(idea.status)}`}>
                    {idea.status === 'idea' ? 'アイデア' : idea.status === 'in-progress' ? '進行中' : '完了'}
                  </span>
                  {idea.category && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {idea.category}
                    </span>
                  )}
                </div>
                
                {idea.content && (
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{idea.content}</p>
                )}
                
                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {idea.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-gray-500 flex justify-between">
                  <span>作成: {new Date(idea.createdAt).toLocaleDateString('ja-JP')}</span>
                  <span>更新: {new Date(idea.updatedAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </Container>
    </div>
  );
}