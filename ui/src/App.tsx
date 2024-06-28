import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ChakraProvider,
    Box,
    Heading,
    VStack,
    Spinner
} from '@chakra-ui/react';

import StyleSelector from './components/StyleSelector';
import ImageComparison from './components/ImageComparison';
import CategorySelector from "./components/CategorySelector";
import { Category, Prompt, Style } from "./components/SimpleTypes";
import LargeImage from "./components/LargeImage";

const App: React.FC = () => {
    const [styles, setStyles] = useState<Style[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
    const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
    const [shownPrompt, setShownPrompt] = useState<number | null>(null);
    const [shownStyle, setShownStyle] = useState<number | null>(null);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [loadingStyles, setLoadingStyles] = useState<boolean>(true);
    const [loadingPrompts, setLoadingPrompts] = useState<boolean>(true);
    const [isLargeImageModalOpen, setLargeImageModalOpen] = useState<boolean>(false);

    const handleClick = (prompt_id: number, style_id: number) => {
        setShownPrompt(prompt_id);
        setShownStyle(style_id);
        setLargeImageModalOpen(true);
    };

    const dismissLargeImage = () => {
        setLargeImageModalOpen(false);
        setShownPrompt(null);
        setShownStyle(null);
    };

    useEffect(() => {
        // Fetch categories
        axios.get('/categories')
            .then(response => {
                setCategories(response.data);
                setLoadingCategories(false);
            })
            .catch(error => {
                console.error("There was an error fetching categories!", error);
                setLoadingCategories(false);
            });
    }, []);

    useEffect(() => {
        let url = '/styles';
        if (selectedCategory !== null) {
            url = `/styles?category_id=${selectedCategory}`;
        }

        console.log('loading styles from url:', url)

        // Fetch styles
        axios.get(url)
            .then(response => {
                setStyles(response.data);
                setLoadingStyles(false);
            })
            .catch(error => {
                console.error("There was an error fetching styles!", error);
                setLoadingStyles(false);
            });

    }, [selectedCategory]);

    useEffect(() => {
        // Fetch prompts
        axios.get('/prompts')
            .then(response => {
                setPrompts(response.data);
                setLoadingPrompts(false);
            })
            .catch(error => {
                console.error("There was an error fetching prompts!", error);
                setLoadingPrompts(false);
            });
    }, []);

    return (
        <ChakraProvider>
            <Box className="App" p={4}>
                <Heading as="h1" size="xl" mb={4}>
                    AI Checkpoint Image Comparator
                </Heading>

                {shownPrompt && shownStyle && (
                    <LargeImage
                        isOpen={isLargeImageModalOpen}
                        onClose={dismissLargeImage}
                        prompt_id={shownPrompt}
                        style_id={shownStyle}
                    />
                )}

                <VStack spacing={4} align="stretch">
                    {loadingCategories ? (
                        <Spinner />
                    ) : (
                        <CategorySelector
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                        />
                    )}

                    {loadingStyles ? (
                        <Spinner />
                    ) : (
                        <StyleSelector
                            styles={styles}
                            selectedStyle={selectedStyle}
                            setSelectedStyle={setSelectedStyle}
                        />
                    )}

                    {loadingPrompts ? (
                        <Spinner />
                    ) : (
                        <ImageComparison
                            prompts={prompts}
                            styles={styles}
                            selectedStyle={selectedStyle}
                            selectedPrompt={selectedPrompt}
                            setSelectedPrompt={setSelectedPrompt}
                            selectedCategory={selectedCategory}
                            handleClick={handleClick}
                        />
                    )}
                </VStack>
            </Box>
        </ChakraProvider>
    );
};

export default App;