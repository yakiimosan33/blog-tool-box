'use client';

import React, { useState, useEffect } from 'react';
import { Header, Container, Card, Button } from '@/components';

// Template interface
interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  content: string;
  variables: string[];
  isCustom: boolean;
}

// Pre-built templates
const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'how-to-1',
    name: 'Step-by-Step How-To Guide',
    category: 'How-To',
    description: 'Perfect for tutorials and instructional content',
    content: `# How to {TITLE}

## Introduction
In this guide, you'll learn how to {OBJECTIVE}. Whether you're a beginner or looking to improve your skills, this step-by-step tutorial will help you {BENEFIT}.

## What You'll Need
- {REQUIREMENT_1}
- {REQUIREMENT_2}
- {REQUIREMENT_3}

## Step-by-Step Instructions

### Step 1: {STEP_1_TITLE}
{STEP_1_DESCRIPTION}

### Step 2: {STEP_2_TITLE}
{STEP_2_DESCRIPTION}

### Step 3: {STEP_3_TITLE}
{STEP_3_DESCRIPTION}

## Tips and Best Practices
- {TIP_1}
- {TIP_2}
- {TIP_3}

## Common Mistakes to Avoid
- {MISTAKE_1}
- {MISTAKE_2}

## Conclusion
You've successfully learned how to {OBJECTIVE}. This skill will help you {FINAL_BENEFIT}. If you have any questions, feel free to leave a comment below!`,
    variables: ['TITLE', 'OBJECTIVE', 'BENEFIT', 'REQUIREMENT_1', 'REQUIREMENT_2', 'REQUIREMENT_3', 'STEP_1_TITLE', 'STEP_1_DESCRIPTION', 'STEP_2_TITLE', 'STEP_2_DESCRIPTION', 'STEP_3_TITLE', 'STEP_3_DESCRIPTION', 'TIP_1', 'TIP_2', 'TIP_3', 'MISTAKE_1', 'MISTAKE_2', 'FINAL_BENEFIT'],
    isCustom: false
  },
  {
    id: 'review-1',
    name: 'Product Review Template',
    category: 'Review',
    description: 'Comprehensive product review structure',
    content: `# {PRODUCT_NAME} Review: {MAIN_VERDICT}

## Quick Overview
- **Product**: {PRODUCT_NAME}
- **Price**: {PRICE}
- **Rating**: {RATING}/5 stars
- **Best For**: {TARGET_AUDIENCE}

## What is {PRODUCT_NAME}?
{PRODUCT_DESCRIPTION}

## Key Features
- {FEATURE_1}
- {FEATURE_2}
- {FEATURE_3}
- {FEATURE_4}

## Pros and Cons

### Pros
- {PRO_1}
- {PRO_2}
- {PRO_3}

### Cons
- {CON_1}
- {CON_2}
- {CON_3}

## Performance and User Experience
{PERFORMANCE_REVIEW}

## Pricing and Value
{PRICING_ANALYSIS}

## Who Should Buy {PRODUCT_NAME}?
{TARGET_RECOMMENDATION}

## Alternatives to Consider
- {ALTERNATIVE_1}
- {ALTERNATIVE_2}
- {ALTERNATIVE_3}

## Final Verdict
{FINAL_THOUGHTS}

**Rating**: {RATING}/5 stars`,
    variables: ['PRODUCT_NAME', 'MAIN_VERDICT', 'PRICE', 'RATING', 'TARGET_AUDIENCE', 'PRODUCT_DESCRIPTION', 'FEATURE_1', 'FEATURE_2', 'FEATURE_3', 'FEATURE_4', 'PRO_1', 'PRO_2', 'PRO_3', 'CON_1', 'CON_2', 'CON_3', 'PERFORMANCE_REVIEW', 'PRICING_ANALYSIS', 'TARGET_RECOMMENDATION', 'ALTERNATIVE_1', 'ALTERNATIVE_2', 'ALTERNATIVE_3', 'FINAL_THOUGHTS'],
    isCustom: false
  },
  {
    id: 'listicle-1',
    name: 'Top 10 List Article',
    category: 'List',
    description: 'Engaging listicle format for rankings and collections',
    content: `# {NUMBER} {TOPIC_ADJECTIVE} {TOPIC} for {YEAR}

## Introduction
Looking for the best {TOPIC}? You've come to the right place! We've compiled a list of the top {NUMBER} {TOPIC} that will {BENEFIT}. Whether you're {AUDIENCE_DESCRIPTION}, this list has something for everyone.

## {NUMBER}. {ITEM_1_NAME}
{ITEM_1_DESCRIPTION}

**Why it's great**: {ITEM_1_REASON}

## {NUMBER_MINUS_1}. {ITEM_2_NAME}
{ITEM_2_DESCRIPTION}

**Why it's great**: {ITEM_2_REASON}

## {NUMBER_MINUS_2}. {ITEM_3_NAME}
{ITEM_3_DESCRIPTION}

**Why it's great**: {ITEM_3_REASON}

## {NUMBER_MINUS_3}. {ITEM_4_NAME}
{ITEM_4_DESCRIPTION}

**Why it's great**: {ITEM_4_REASON}

## {NUMBER_MINUS_4}. {ITEM_5_NAME}
{ITEM_5_DESCRIPTION}

**Why it's great**: {ITEM_5_REASON}

## Honorable Mentions
- {HONORABLE_1}
- {HONORABLE_2}
- {HONORABLE_3}

## Conclusion
These {NUMBER} {TOPIC} represent the best options available in {YEAR}. Each one offers unique benefits, so choose the one that best fits your {SELECTION_CRITERIA}.

What's your favorite {TOPIC}? Let us know in the comments below!`,
    variables: ['NUMBER', 'TOPIC_ADJECTIVE', 'TOPIC', 'YEAR', 'BENEFIT', 'AUDIENCE_DESCRIPTION', 'ITEM_1_NAME', 'ITEM_1_DESCRIPTION', 'ITEM_1_REASON', 'NUMBER_MINUS_1', 'ITEM_2_NAME', 'ITEM_2_DESCRIPTION', 'ITEM_2_REASON', 'NUMBER_MINUS_2', 'ITEM_3_NAME', 'ITEM_3_DESCRIPTION', 'ITEM_3_REASON', 'NUMBER_MINUS_3', 'ITEM_4_NAME', 'ITEM_4_DESCRIPTION', 'ITEM_4_REASON', 'NUMBER_MINUS_4', 'ITEM_5_NAME', 'ITEM_5_DESCRIPTION', 'ITEM_5_REASON', 'HONORABLE_1', 'HONORABLE_2', 'HONORABLE_3', 'SELECTION_CRITERIA'],
    isCustom: false
  },
  {
    id: 'comparison-1',
    name: 'Product Comparison',
    category: 'Comparison',
    description: 'Compare two products or services side by side',
    content: `# {PRODUCT_A} vs {PRODUCT_B}: Which is Better in {YEAR}?

## Introduction
Trying to decide between {PRODUCT_A} and {PRODUCT_B}? Both are popular choices for {USE_CASE}, but they have different strengths and weaknesses. In this detailed comparison, we'll help you determine which one is right for your needs.

## Quick Comparison Table

| Feature | {PRODUCT_A} | {PRODUCT_B} |
|---------|-------------|-------------|
| Price | {PRICE_A} | {PRICE_B} |
| {FEATURE_1} | {A_FEATURE_1} | {B_FEATURE_1} |
| {FEATURE_2} | {A_FEATURE_2} | {B_FEATURE_2} |
| {FEATURE_3} | {A_FEATURE_3} | {B_FEATURE_3} |
| Rating | {RATING_A}/5 | {RATING_B}/5 |

## {PRODUCT_A} Overview
{PRODUCT_A_DESCRIPTION}

### {PRODUCT_A} Pros
- {A_PRO_1}
- {A_PRO_2}
- {A_PRO_3}

### {PRODUCT_A} Cons
- {A_CON_1}
- {A_CON_2}

## {PRODUCT_B} Overview
{PRODUCT_B_DESCRIPTION}

### {PRODUCT_B} Pros
- {B_PRO_1}
- {B_PRO_2}
- {B_PRO_3}

### {PRODUCT_B} Cons
- {B_CON_1}
- {B_CON_2}

## Head-to-Head Comparison

### Performance
{PERFORMANCE_COMPARISON}

### Ease of Use
{USABILITY_COMPARISON}

### Value for Money
{VALUE_COMPARISON}

## Which Should You Choose?

### Choose {PRODUCT_A} if:
- {A_CHOOSE_1}
- {A_CHOOSE_2}
- {A_CHOOSE_3}

### Choose {PRODUCT_B} if:
- {B_CHOOSE_1}
- {B_CHOOSE_2}
- {B_CHOOSE_3}

## Final Verdict
{FINAL_RECOMMENDATION}`,
    variables: ['PRODUCT_A', 'PRODUCT_B', 'YEAR', 'USE_CASE', 'PRICE_A', 'PRICE_B', 'FEATURE_1', 'FEATURE_2', 'FEATURE_3', 'A_FEATURE_1', 'A_FEATURE_2', 'A_FEATURE_3', 'B_FEATURE_1', 'B_FEATURE_2', 'B_FEATURE_3', 'RATING_A', 'RATING_B', 'PRODUCT_A_DESCRIPTION', 'A_PRO_1', 'A_PRO_2', 'A_PRO_3', 'A_CON_1', 'A_CON_2', 'PRODUCT_B_DESCRIPTION', 'B_PRO_1', 'B_PRO_2', 'B_PRO_3', 'B_CON_1', 'B_CON_2', 'PERFORMANCE_COMPARISON', 'USABILITY_COMPARISON', 'VALUE_COMPARISON', 'A_CHOOSE_1', 'A_CHOOSE_2', 'A_CHOOSE_3', 'B_CHOOSE_1', 'B_CHOOSE_2', 'B_CHOOSE_3', 'FINAL_RECOMMENDATION'],
    isCustom: false
  },
  {
    id: 'news-1',
    name: 'News Article Template',
    category: 'News',
    description: 'Professional news article structure',
    content: `# {HEADLINE}

**{LOCATION}** - {DATE} - {LEAD_PARAGRAPH}

## Key Details
- **What**: {WHAT_HAPPENED}
- **When**: {WHEN_HAPPENED}
- **Where**: {WHERE_HAPPENED}
- **Who**: {WHO_INVOLVED}
- **Why**: {WHY_SIGNIFICANT}

## Background
{BACKGROUND_INFO}

## Current Situation
{CURRENT_STATUS}

## Impact and Implications
{IMPACT_DESCRIPTION}

## What's Next
{FUTURE_DEVELOPMENTS}

## Quotes
"{QUOTE_1}" - {QUOTE_1_ATTRIBUTION}

"{QUOTE_2}" - {QUOTE_2_ATTRIBUTION}

## Related Stories
- {RELATED_1}
- {RELATED_2}
- {RELATED_3}

---
*This story is developing and will be updated as more information becomes available.*`,
    variables: ['HEADLINE', 'LOCATION', 'DATE', 'LEAD_PARAGRAPH', 'WHAT_HAPPENED', 'WHEN_HAPPENED', 'WHERE_HAPPENED', 'WHO_INVOLVED', 'WHY_SIGNIFICANT', 'BACKGROUND_INFO', 'CURRENT_STATUS', 'IMPACT_DESCRIPTION', 'FUTURE_DEVELOPMENTS', 'QUOTE_1', 'QUOTE_1_ATTRIBUTION', 'QUOTE_2', 'QUOTE_2_ATTRIBUTION', 'RELATED_1', 'RELATED_2', 'RELATED_3'],
    isCustom: false
  },
  {
    id: 'case-study-1',
    name: 'Case Study Template',
    category: 'Case Study',
    description: 'Detailed case study format for success stories',
    content: `# Case Study: How {COMPANY} {ACHIEVEMENT} Using {SOLUTION}

## Executive Summary
{COMPANY} faced {CHALLENGE} and achieved {RESULT} by implementing {SOLUTION}. This case study explores the strategy, implementation, and results of their successful transformation.

## The Challenge
{DETAILED_CHALLENGE}

### Key Problems:
- {PROBLEM_1}
- {PROBLEM_2}
- {PROBLEM_3}

## The Solution
{SOLUTION_DESCRIPTION}

### Implementation Strategy:
1. {STRATEGY_1}
2. {STRATEGY_2}
3. {STRATEGY_3}

## Implementation Process

### Phase 1: {PHASE_1_NAME}
{PHASE_1_DESCRIPTION}

### Phase 2: {PHASE_2_NAME}
{PHASE_2_DESCRIPTION}

### Phase 3: {PHASE_3_NAME}
{PHASE_3_DESCRIPTION}

## Results and Metrics

### Quantitative Results:
- {METRIC_1}: {RESULT_1}
- {METRIC_2}: {RESULT_2}
- {METRIC_3}: {RESULT_3}

### Qualitative Improvements:
- {IMPROVEMENT_1}
- {IMPROVEMENT_2}
- {IMPROVEMENT_3}

## Lessons Learned
{LESSONS_LEARNED}

## Key Takeaways
1. {TAKEAWAY_1}
2. {TAKEAWAY_2}
3. {TAKEAWAY_3}

## Conclusion
{CONCLUSION}

---
*Want to achieve similar results? {CALL_TO_ACTION}*`,
    variables: ['COMPANY', 'ACHIEVEMENT', 'SOLUTION', 'CHALLENGE', 'RESULT', 'DETAILED_CHALLENGE', 'PROBLEM_1', 'PROBLEM_2', 'PROBLEM_3', 'SOLUTION_DESCRIPTION', 'STRATEGY_1', 'STRATEGY_2', 'STRATEGY_3', 'PHASE_1_NAME', 'PHASE_1_DESCRIPTION', 'PHASE_2_NAME', 'PHASE_2_DESCRIPTION', 'PHASE_3_NAME', 'PHASE_3_DESCRIPTION', 'METRIC_1', 'RESULT_1', 'METRIC_2', 'RESULT_2', 'METRIC_3', 'RESULT_3', 'IMPROVEMENT_1', 'IMPROVEMENT_2', 'IMPROVEMENT_3', 'LESSONS_LEARNED', 'TAKEAWAY_1', 'TAKEAWAY_2', 'TAKEAWAY_3', 'CONCLUSION', 'CALL_TO_ACTION'],
    isCustom: false
  }
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [processedContent, setProcessedContent] = useState('');

  // Custom template form state
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    category: '',
    description: '',
    content: ''
  });

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const savedCustomTemplates = localStorage.getItem('blog-templates');
    const customTemplates = savedCustomTemplates ? JSON.parse(savedCustomTemplates) : [];
    setTemplates([...PREDEFINED_TEMPLATES, ...customTemplates]);
  };

  const saveCustomTemplate = () => {
    if (!customTemplate.name || !customTemplate.content) {
      alert('名前と内容フィールドは必須です。');
      return;
    }

    const newTemplate: Template = {
      id: `custom-${Date.now()}`,
      name: customTemplate.name,
      category: customTemplate.category || 'Custom',
      description: customTemplate.description || '',
      content: customTemplate.content,
      variables: extractVariables(customTemplate.content),
      isCustom: true
    };

    const savedCustomTemplates = localStorage.getItem('blog-templates');
    const customTemplates = savedCustomTemplates ? JSON.parse(savedCustomTemplates) : [];
    customTemplates.push(newTemplate);
    localStorage.setItem('blog-templates', JSON.stringify(customTemplates));

    setTemplates([...PREDEFINED_TEMPLATES, ...customTemplates]);
    setCustomTemplate({ name: '', category: '', description: '', content: '' });
    setShowCreateModal(false);
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{[^}]+\}/g);
    return matches ? Array.from(new Set(matches.map(match => match.slice(1, -1)))) : [];
  };

  const deleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template?.isCustom) {
      alert('事前定義テンプレートは削除できません。');
      return;
    }

    if (confirm('このテンプレートを削除してもよろしいですか？')) {
      const savedCustomTemplates = localStorage.getItem('blog-templates');
      const customTemplates = savedCustomTemplates ? JSON.parse(savedCustomTemplates) : [];
      const updatedCustomTemplates = customTemplates.filter((t: Template) => t.id !== templateId);
      localStorage.setItem('blog-templates', JSON.stringify(updatedCustomTemplates));
      loadTemplates();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('テンプレートがクリップボードにコピーされました！');
    });
  };

  const openVariableModal = (template: Template) => {
    setSelectedTemplate(template);
    setVariableValues({});
    setShowVariableModal(true);
  };

  const processTemplate = () => {
    if (!selectedTemplate) return;

    let processed = selectedTemplate.content;
    selectedTemplate.variables.forEach(variable => {
      const value = variableValues[variable] || `{${variable}}`;
      processed = processed.replace(new RegExp(`\\{${variable}\\}`, 'g'), value);
    });

    setProcessedContent(processed);
  };

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header 
        title="ブログテンプレート" 
        subtitle="さまざまなブログ投稿種類のための事前作成テンプレートとカスタムテンプレート作成ツール"
      />
      
      <Container className="py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="テンプレートを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              テンプレート作成
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="h-full">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{template.name}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  <div className="text-xs text-gray-500 mb-4">
                    変数: {template.variables.length}個
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(template.content)}
                      className="flex-1"
                    >
                      コピー
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openVariableModal(template)}
                      className="flex-1"
                    >
                      変数入力
                    </Button>
                  </div>
                  {template.isCustom && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      削除
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">検索条件に一致するテンプレートが見つかりません。</p>
          </div>
        )}

        {/* Create Template Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">カスタムテンプレート作成</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      テンプレート名 *
                    </label>
                    <input
                      type="text"
                      value={customTemplate.name}
                      onChange={(e) => setCustomTemplate({...customTemplate, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="テンプレート名を入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カテゴリー
                    </label>
                    <input
                      type="text"
                      value={customTemplate.category}
                      onChange={(e) => setCustomTemplate({...customTemplate, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="カテゴリーを入力 (例: チュートリアル、レビュー)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      説明
                    </label>
                    <input
                      type="text"
                      value={customTemplate.description}
                      onChange={(e) => setCustomTemplate({...customTemplate, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="テンプレートの簡単な説明"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      テンプレート内容 *
                    </label>
                    <textarea
                      value={customTemplate.content}
                      onChange={(e) => setCustomTemplate({...customTemplate, content: e.target.value})}
                      rows={15}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="テンプレート内容を入力してください。プレースホルダーには {VARIABLE_NAME} を使用してください。"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      変数には波括弧を使用してください: {'{TITLE}'}, {'{AUTHOR}'} など
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    キャンセル
                  </Button>
                  <Button onClick={saveCustomTemplate}>
                    テンプレート保存
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Variable Fill Modal */}
        {showVariableModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">テンプレート変数入力</h2>
                <p className="text-gray-600 mb-6">テンプレート: {selectedTemplate.name}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Variables Form */}
                  <div>
                    <h3 className="font-semibold mb-4">変数 ({selectedTemplate.variables.length}個)</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedTemplate.variables.map(variable => (
                        <div key={variable}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {variable}
                          </label>
                          <input
                            type="text"
                            value={variableValues[variable] || ''}
                            onChange={(e) => setVariableValues({
                              ...variableValues,
                              [variable]: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`${variable.toLowerCase().replace(/_/g, ' ')}を入力`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button onClick={processTemplate} className="w-full">
                        テンプレート処理
                      </Button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <h3 className="font-semibold mb-4">プレビュー</h3>
                    <div className="border rounded-md p-4 bg-gray-50 max-h-96 overflow-y-auto">
                      {processedContent ? (
                        <pre className="whitespace-pre-wrap text-sm">
                          {processedContent}
                        </pre>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          "テンプレート処理"をクリックしてプレビューを表示
                        </p>
                      )}
                    </div>
                    {processedContent && (
                      <Button
                        onClick={() => copyToClipboard(processedContent)}
                        className="w-full mt-4"
                      >
                        処理済ミテンプレートをコピー
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="secondary"
                    onClick={() => setShowVariableModal(false)}
                  >
                    閉じる
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}