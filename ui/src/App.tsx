import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Alert, AlertIcon, Box, ChakraProvider, Heading, Spinner, VStack} from '@chakra-ui/react';
import {PromptSelector} from "./components/PromptSelector";
import ImageComparison from './components/ImageComparison';
import CategorySelector from "./components/CategorySelector";
import LargeImage from "./components/LargeImage";
import StyleSelector from "./components/StyleSelector";

export const API_URL_CATEGORIES = "/categories";
export const API_URL_STYLES = "/styles";
export const API_URL_PROMPTS = "/prompts";

// Custom hook for data fetching
const useFetchData = (url: string) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get(url)
            .then(response => setData(response.data))
            .catch(error => {
                console.error(`Error when fetching data from ${url}`, error);
                setError("Unable to load data.");
            })
            .finally(() => setLoading(false));
    }, [url]);

    return {data, loading, error};
};

const App: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<number | null>(null);
    const [selectedPrompts, setSelectedPrompts] = useState<number[]>([]);
    const [shownPrompt, setShownPrompt] = useState<number | null>(null);
    const [shownStyle, setShownStyle] = useState<number | null>(null);
    const [isLargeImageModalOpen, setLargeImageModalOpen] = useState<boolean>(false);

    const {data: categories, loading: loadingCategories, error: errorCategories} = useFetchData(API_URL_CATEGORIES);
    const {data: prompts, loading: loadingPrompts, error: errorPrompts} = useFetchData(API_URL_PROMPTS);

    const stylesUrl = selectedCategory !== null ? `${API_URL_STYLES}?category_id=${selectedCategory}` : API_URL_STYLES;
    const {data: styles, loading: loadingStyles, error: errorStyles} = useFetchData(stylesUrl);

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

    const promptOptions = prompts.map(prompt => ({
        value: prompt.id.toString(),
        label: prompt.text
    }));

    const handleSelectChange = (selectedOptions: any) => {
        if (!selectedOptions) {
            setSelectedPrompts([]);
        } else {
            const selectedIds = selectedOptions.map((option: { value: string }) => parseInt(option.value));
            setSelectedPrompts(selectedIds);
        }
    };

    const shownPrompts = prompts.filter(prompt => selectedPrompts.includes(prompt.id));
    const selectedPromptValues = promptOptions.filter(option => selectedPrompts.includes(parseInt(option.value)));

    if (loadingCategories || loadingStyles || loadingPrompts) {
        return (
            <ChakraProvider>
                <Box className="App" p={4}>
                    <Spinner/>
                </Box>
            </ChakraProvider>
        );
    }

    return (
        <ChakraProvider>
            <Box className="App" p={4}>
                <Heading as="h1" size="xl" mb={4}>AI Horde Style Comparator</Heading>
                {errorCategories && (
                    <Alert status="error" mb={4}>
                        <AlertIcon/>
                        {errorCategories}
                    </Alert>
                )}
                {errorStyles && (
                    <Alert status="error" mb={4}>
                        <AlertIcon/>
                        {errorStyles}
                    </Alert>
                )}
                {errorPrompts && (
                    <Alert status="error" mb={4}>
                        <AlertIcon/>
                        {errorPrompts}
                    </Alert>
                )}

                {shownPrompt && shownStyle && (
                    <LargeImage
                        isOpen={isLargeImageModalOpen}
                        onClose={dismissLargeImage}
                        prompt_id={shownPrompt}
                        style_id={shownStyle}
                    />
                )}

                <VStack spacing={4} align="stretch">
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

                        <PromptSelector promptOptions={promptOptions} handleSelectChange={handleSelectChange}/>

                    </Box>
                    <ImageComparison
                        prompts={shownPrompts}
                        styles={styles}
                        selectedStyle={selectedStyle}
                        selectedPrompt={null}
                        selectedCategory={selectedCategory}
                        handleClick={handleClick}
                    />
                </VStack>
            </Box>
        </ChakraProvider>
    );
};

export default App;
