import React, {useEffect, useState} from 'react';
import axios from 'axios';

import StyleSelector from './components/StyleSelector';
import ImageComparison from './components/ImageComparison';
import CategorySelector from "./components/CategorySelector";
import {Category, Prompt, Style} from "./components/SimpleTypes";
import LargeImage from "./components/LargeImage";


const App: React.FC = () => {
    const [styles, setStyles] = useState<Style[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
    const [shownPrompt, setShownPrompt] = React.useState<number | null>(null);
    const [shownStyle, setShownStyle] = React.useState<number | null>(null);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (prompt_id: number, style_id: number) => {
        if (timer) {
            clearTimeout(timer);
        }
        setShownPrompt(prompt_id);
        setShownStyle(style_id);
    };

    const handleClick = () => {
        if (timer) {
            clearTimeout(timer);
        }
        setShownPrompt(null);
        setShownStyle(null);
    }

    const handleMouseLeave = (prompt_id: number, style_id: number) => {
        if (prompt_id === shownPrompt && style_id === shownStyle) {
            if (timer) {
                clearTimeout(timer);
            }
            const newTimer = setTimeout(() => {
                setShownPrompt(null);
                setShownStyle(null);
            }, 1000);
            setTimer(newTimer);
        }
    }

    useEffect(() => {
        // Fetch categories
        axios.get('/categories')
            .then(response => setCategories(response.data))
            .catch(error => console.error("There was an error fetching categories!", error));
    }, []);


    useEffect(() => {

        let url = '/styles';
        if (selectedCategory !== null) {
            url = `/styles?category_id=${selectedCategory}`;
        }

        // Fetch checkpoints
        axios.get(url)
            .then(response => setStyles(response.data))
            .catch(error => console.error("There was an error fetching checkpoints!", error));

    }, [selectedCategory]);

    useEffect(() => {
        // Fetch prompts for the selected category
        axios.get('/prompts')
            .then(response => setPrompts(response.data))
            .catch(error => console.error("There was an error fetching prompts!", error));
    }, []);

    return (
        <div className="App">
            <h1>AI Checkpoint Image Comparator</h1>
            {shownPrompt && shownStyle ? <LargeImage prompt_id={shownPrompt} style_id={shownStyle} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} handleClick={handleClick} /> : null}
            <div>
                <CategorySelector
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}/>


                <StyleSelector
                    styles={styles}
                    selectedStyle={selectedStyle}
                    setSelectedStyle={setSelectedStyle}/>

            </div>
            <ImageComparison
                prompts={prompts}
                styles={styles}
                categories={categories}
                selectedStyle={selectedStyle}
                selectedPrompt={selectedPrompt}
                setSelectedPrompt={setSelectedPrompt}
                selectedCategory={selectedCategory}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
            />
        </div>
    );
};

export default App;
