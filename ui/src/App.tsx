import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Box, ChakraProvider, Heading, Select, Spinner, VStack} from '@chakra-ui/react';
import ImageComparison from './components/ImageComparison';
import CategorySelector from "./components/CategorySelector";
import {Category, Prompt, Style} from "./components/SimpleTypes";
import LargeImage from "./components/LargeImage";
import StyleSelector from "./components/StyleSelector";

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
                    AI Horde Style Comparator
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
                    {loadingCategories || loadingStyles || loadingPrompts ? (
                        <Spinner/>
                    ) : (
                        <>
                            <Box display="inline-block">
                                <CategorySelector
                                    categories={categories}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                />

                                <StyleSelector
                                    styles={styles}
                                    selectedStyle={selectedStyle}
                                    setSelectedStyle={setSelectedStyle}
                                />

                                <Box display="inline-block" width="25%" ml="10px">
                                    <Select
                                        placeholder="Select Prompt"
                                        onChange={(e) => setSelectedPrompt(Number(e.target.value))}
                                        value={selectedPrompt || ''}
                                        mb={4}
                                    >
                                        {prompts.map(prompt => (
                                            <option key={prompt.id} value={prompt.id}>{prompt.text}</option>
                                        ))}
                                    </Select>
                                </Box>

                            </Box>
                            <ImageComparison
                                prompts={prompts}
                                styles={styles}
                                selectedStyle={selectedStyle}
                                selectedPrompt={selectedPrompt}
                                selectedCategory={selectedCategory}
                                handleClick={handleClick}
                            />
                        </>
                    )}

                </VStack>
            </Box>
        </ChakraProvider>
    )
        ;
};

export default App;