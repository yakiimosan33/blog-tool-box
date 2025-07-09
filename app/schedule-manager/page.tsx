'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate: Date;
  description?: string;
  author?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  posts: BlogPost[];
}

type ViewMode = 'week' | 'month';

export default function ScheduleManagerPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [draggedPost, setDraggedPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    author: '',
    status: 'draft' as BlogPost['status'],
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00'
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('blogSchedulePosts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts).map((post: any) => ({
        ...post,
        scheduledDate: new Date(post.scheduledDate)
      }));
      setPosts(parsedPosts);
    }
  }, []);

  // Save data to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('blogSchedulePosts', JSON.stringify(posts));
  }, [posts]);

  // Generate calendar days for the current view
  const generateCalendarDays = useCallback((): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    if (viewMode === 'month') {
      const startOfCalendar = new Date(startOfMonth);
      startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());
      
      const endOfCalendar = new Date(endOfMonth);
      endOfCalendar.setDate(endOfCalendar.getDate() + (6 - endOfCalendar.getDay()));
      
      const currentDay = new Date(startOfCalendar);
      while (currentDay <= endOfCalendar) {
        const dayPosts = posts.filter(post => 
          post.scheduledDate.toDateString() === currentDay.toDateString()
        );
        
        days.push({
          date: new Date(currentDay),
          isCurrentMonth: currentDay.getMonth() === currentDate.getMonth(),
          posts: dayPosts
        });
        
        currentDay.setDate(currentDay.getDate() + 1);
      }
    } else {
      // Week view
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        
        const dayPosts = posts.filter(post => 
          post.scheduledDate.toDateString() === currentDay.toDateString()
        );
        
        days.push({
          date: new Date(currentDay),
          isCurrentMonth: true,
          posts: dayPosts
        });
      }
    }
    
    return days;
  }, [currentDate, viewMode, posts]);

  const calendarDays = generateCalendarDays();

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      scheduledDate: date.toISOString().split('T')[0]
    }));
    setShowPostModal(true);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
    
    if (editingPost) {
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData, scheduledDate: scheduledDateTime }
          : post
      ));
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        author: formData.author,
        status: formData.status,
        scheduledDate: scheduledDateTime
      };
      setPosts(prev => [...prev, newPost]);
    }
    
    handleModalClose();
  };

  const handleModalClose = () => {
    setShowPostModal(false);
    setEditingPost(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      author: '',
      status: 'draft',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00'
    });
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      category: post.category,
      description: post.description || '',
      author: post.author || '',
      status: post.status,
      scheduledDate: post.scheduledDate.toISOString().split('T')[0],
      scheduledTime: post.scheduledDate.toTimeString().split(' ')[0].substring(0, 5)
    });
    setShowPostModal(true);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('この投稿を削除してよろしいですか？')) {
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const handleDragStart = (e: React.DragEvent, post: BlogPost) => {
    setDraggedPost(post);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    
    if (draggedPost) {
      const newDateTime = new Date(targetDate);
      newDateTime.setHours(draggedPost.scheduledDate.getHours());
      newDateTime.setMinutes(draggedPost.scheduledDate.getMinutes());
      
      setPosts(prev => prev.map(post => 
        post.id === draggedPost.id 
          ? { ...post, scheduledDate: newDateTime }
          : post
      ));
      
      setDraggedPost(null);
    }
  };

  const getStatusColor = (status: BlogPost['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const categories = [
    '技術', 'ビジネス', 'マーケティング', '健康', 'ライフスタイル', 
    '教育', 'エンターテインメント', '旅行', '食べ物', 'スポーツ'
  ];

  return (
    <>
      <Header 
        title="スケジュールマネージャー" 
        subtitle="ブログ投稿の公開スケジュールを計画・管理します"
      />
      
      <Container className="py-8">
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handlePrevious}
              >
                ← 前へ
              </Button>
              <h2 className="text-xl font-semibold mx-4">
                {viewMode === 'month' 
                  ? currentDate.toLocaleDateString('ja-JP', { month: 'long', year: 'numeric' })
                  : `${currentDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}の週`
                }
              </h2>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleNext}
              >
                次へ →
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'week' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  週表示
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'month' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  月表示
                </button>
              </div>
              
              <Button onClick={() => setShowPostModal(true)}>
                + 新しい投稿
              </Button>
            </div>
          </div>

          {/* Calendar */}
          <Card>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Day headers */}
              {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`bg-white p-2 min-h-[120px] border-r border-b border-gray-200 ${
                    !day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : ''
                  } hover:bg-gray-50 cursor-pointer transition-colors`}
                  onClick={() => handleDateClick(day.date)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day.date)}
                >
                  <div className="text-sm font-medium mb-1">
                    {day.date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {day.posts.map(post => (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, post)}
                        className="text-xs p-1 rounded cursor-move hover:shadow-sm transition-shadow"
                        style={{ backgroundColor: getStatusColor(post.status).split(' ')[0] }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post);
                        }}
                      >
                        <div className="font-medium text-gray-900 truncate">
                          {post.title}
                        </div>
                        <div className="text-gray-600 truncate">
                          {post.category}
                        </div>
                        <div className={`inline-block px-1 py-0.5 rounded text-xs ${getStatusColor(post.status)}`}>
                          {post.status === 'draft' ? '下書き' : post.status === 'scheduled' ? '予定済み' : '公開済み'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Posts */}
          <Card title="予定された投稿">
            <div className="space-y-3">
              {posts
                .filter(post => post.scheduledDate > new Date() && post.status !== 'published')
                .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
                .slice(0, 5)
                .map(post => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{post.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(post.status)}`}>
                          {post.status === 'draft' ? '下書き' : post.status === 'scheduled' ? '予定済み' : '公開済み'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {post.category} • {formatDate(post.scheduledDate)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleEditPost(post)}
                      >
                        編集
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                ))}
              
              {posts.filter(post => post.scheduledDate > new Date() && post.status !== 'published').length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  予定された投稿がありません
                </p>
              )}
            </div>
          </Card>
        </div>
      </Container>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingPost ? '投稿編集' : '新しい投稿'}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    タイトル *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="投稿タイトルを入力"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    カテゴリー *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">カテゴリーを選択</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="投稿の簡単な説明"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    著者
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="著者名"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ステータス *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BlogPost['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">下書き</option>
                    <option value="scheduled">予定済み</option>
                    <option value="published">公開済み</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      日付 *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      時刻 *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingPost ? '投稿更新' : '投稿作成'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleModalClose}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}