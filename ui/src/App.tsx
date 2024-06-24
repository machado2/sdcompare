import React, { useState, useEffect } from 'react';
import axios from 'axios';

import CheckpointSelector from './components/CheckpointSelector';
import PromptCategorySelector from './components/PromptCategorySelector';
import ImageComparison from './components/ImageComparison';

// Types
interface Checkpoint {
  id: number;
  name: string;
  worker_count: number;
}

interface Category {
  id: number;
  name: string;
}

interface Prompt {
  id: number;
  prompt: string;
  category_id: number;
}

const App: React.FC = () => {
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<number | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);

  useEffect(() => {
    // Fetch checkpoints
    axios.get('/checkpoints')
        .then(response => setCheckpoints(response.data))
        .catch(error => console.error("There was an error fetching checkpoints!", error));

    // Fetch categories
    axios.get('/prompts/categories')
        .then(response => setCategories(response.data))
        .catch(error => console.error("There was an error fetching categories!", error));
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      // Fetch prompts for the selected category
      axios.get(`/prompts?category_id=${selectedCategory}`)
          .then(response => setPrompts(response.data))
          .catch(error => console.error("There was an error fetching prompts!", error));
    }
  }, [selectedCategory]);

  return (
      <div className="App">
        <h1>AI Checkpoint Image Comparator</h1>
        <div>
          <CheckpointSelector
              checkpoints={checkpoints}
              selectedCheckpoint={selectedCheckpoint}
              setSelectedCheckpoint={setSelectedCheckpoint} />

          <PromptCategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory} />
        </div>
        {
            (selectedCategory !== null && selectedCheckpoint !== null ) &&
            <ImageComparison
                prompts={prompts}
                selectedCheckpoint={selectedCheckpoint}
                selectedPrompt={selectedPrompt}
                setSelectedPrompt={setSelectedPrompt} />
        }
      </div>
  );
};

export default App;
