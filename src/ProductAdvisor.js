import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/*
FILE PATH:
C:\dev\aiStudio\widget_prototype_V2.1\widget_poc_v3\src\ProductAdvisor.tsx

FILE PURPOSE:
This component acts as the main "Brain" of the product advisor application.
It manages all application state (selected facets, chat history, current question)
and orchestrates the interaction between the deterministic filtering logic
(now contained WITHIN this file as `calculateNextStep`, wrapped in useCallback)
and the AI service (geminiService). It renders the full two-panel UI
(Breadcrumbs/Chat and Questions/Results).

FILE SUMMARY:
This component holds the primary state using `useState`. It contains and calls
`calculateNextStep` (memoized with useCallback) to drive the filtering process
based on user selections (`handleSelectOption`). It also handles free-text input
by calling the live `getAIResponseAndFacets` service and feeding extracted facets
back into the state machine (`handleSendMessage`), filtering out nulls. The UI
dynamically renders either the next question (`FacetQuestion`) or the final
product list (`ProductResult`).

IMPORTS:
- React hooks (`useState`, `useEffect`, `useCallback`)
- Types from './types' (`Product`, `ChatMessage`, `CurrentQuestion`, `MessageSender`)
- Data from './product_data' (`productData`)
// - Logic from './logic/filterLogic' (REMOVED - now inline)
- Service from './services/geminiService' (`getAIResponseAndFacets`)
- UI Components from './components/' (`Breadcrumbs`, `ChatInterface`, etc.)

EXPORTS:
- Default React functional component `ProductAdvisor`

CHANGE HISTORY (ALWAYS UPDATE HERE):
- [2025-10-23] Initial creation based on target App.tsx (4.5.2). Renamed component.
- [2025-10-23] Extracted `calculateNextStep` to logic/filterLogic.ts.
- [2025-10-23] Corrected type-only imports for verbatimModuleSyntax.
- [2025-10-24] (FIX) Added filtering for null values from AI extractedFacets before calling processStateTransition to fix TS2345 build error.
- [2025-10-27] Moved `calculateNextStep` function from logic/filterLogic.ts back into this component (Phase 12).
- [2025-10-27] Applied ESLint fixes (prefer-const) and TypeScript fix (handle possibly undefined 'opt') within calculateNextStep. Removed unused Facet import.
- [2025-10-27] Wrapped inline `calculateNextStep` in useCallback to satisfy exhaustive-deps rule.
- [2025-10-29] REFINE_AI_CONTEXT - Added logic to handle `knowledgeBaseAnswer: null` from the AI.

NOTE: This file was originally named App.tsx in the target project.
It has been renamed to ProductAdvisor.tsx to avoid conflict with our existing App.tsx wrapper.
*/
/*
======================================
# IMPORTS & TYPES
======================================
*/
import React, { useState, useEffect, useCallback } from 'react';
import { MessageSender } from './types';
import { productData } from './product_data';
import { getAIResponseAndFacets } from './services/geminiService'; // Now calls the live service
// REMOVED: import { calculateNextStep } from './logic/filterLogic';
import Breadcrumbs from './components/Breadcrumbs';
import ChatInterface from './components/ChatInterface';
import FacetQuestion from './components/FacetQuestion';
import ProductResult from './components/ProductResult';
import { CloseIcon } from './components/Icons';
/*
======================================
# COMPONENT DEFINITION
======================================
*/
const ProductAdvisor = ({ onClose }) => {
    /*
    ======================================
    # STATE MANAGEMENT
    ======================================
    */
    // Initialize state based on all possible facets defined in productData
    const initialFacets = productData.facets.reduce((acc, facet) => {
        acc[facet.attribute] = null; // Start with all facets unselected
        return acc;
    }, {});
    // Holds the user's confirmed selections
    const [selectedFacets, setSelectedFacets] = useState(initialFacets);
    // Holds facets extracted by AI but not yet confirmed/applied by the state machine
    const [tempExtractedFacets, setTempExtractedFacets] = useState({});
    // Stores the conversation history for display
    const [chatHistory, setChatHistory] = useState([
        { sender: MessageSender.BOT, text: "Olá! Sou um assistente especialista em esquadrias de alumínio. Como posso ajudar você com portas e janelas?" }
    ]);
    // Holds the next question to be presented to the user, or null if finished/results shown
    const [currentQuestion, setCurrentQuestion] = useState(null);
    // Stores the list of products matching the current selections
    const [filteredProducts, setFilteredProducts] = useState(productData.productCatalog);
    // Flag indicating if the filtering process is complete
    const [isFinished, setIsFinished] = useState(false);
    // Flag to show a loading indicator while waiting for the AI service
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    // Flag to control visibility of the "Talk to Human" button
    const [showTalkToHuman, setShowTalkToHuman] = useState(false);
    /*
    ======================================
    # CORE LOGIC: DETERMINISTIC STATE MACHINE
    ======================================
    */
    /**
    * A pure function that calculates the next state of the product filtering journey.
    * Wrapped in useCallback to memoize it and satisfy exhaustive-deps rule.
    * (Moved inline from filterLogic.ts in Phase 12)
    * @returns An object with the new state: { newSelections, newTempFacets, filteredProducts, nextQuestion, isFinished }.
    */
    // --- FIX: Wrap in useCallback ---
    const calculateNextStep = useCallback((currentSelectedFacets, currentTempFacets) => {
        // Use const as these are not reassigned
        const newSelections = { ...currentSelectedFacets };
        const tempFacetsCopy = { ...currentTempFacets }; // Copy to modify locally
        // Helper function to filter products based on a set of selections
        const applyFilters = (selections) => {
            return productData.productCatalog.filter(product => {
                return Object.entries(selections).every(([key, value]) => {
                    if (value === null)
                        return true; // Skip unselected facets
                    // Special handling for width range
                    if (key === 'largura') {
                        const [min, max] = value.split('-').map(Number);
                        if (isNaN(min) || isNaN(max))
                            return true; // Ignore invalid range format
                        // Check if product's range overlaps with the selected range
                        return product.minLargura < max && min < product.maxLargura;
                    }
                    // Default: Compare product attribute value (converted to string) with selected value
                    return String(product[key]) === value;
                });
            });
        };
        // --- Try to apply any temporarily stored facets from AI ---
        // Loop until no more temp facets can be automatically applied in a pass
        if (Object.keys(tempFacetsCopy).length > 0) {
            let appliedSomethingInLoop;
            do {
                appliedSomethingInLoop = false;
                // Use const
                const currentProducts = applyFilters(newSelections); // Filter based on already confirmed selections
                // Iterate through all possible facets defined in productData
                for (const facet of productData.facets) {
                    const attribute = facet.attribute;
                    const value = tempFacetsCopy[attribute]; // Get the value AI suggested for this facet
                    // If this facet is currently unselected AND AI provided a value for it
                    if (newSelections[attribute] === null && value) {
                        // Get the *currently possible* options for this facet based on filtered products
                        // Ensure options are strings before filtering/checking includes
                        const availableOptions = [...new Set(currentProducts.map(p => p[attribute]?.toString()).filter(Boolean))];
                        let matchFound = null;
                        // Check if the AI value is an exact match for a currently available option
                        if (availableOptions.includes(value)) {
                            matchFound = value;
                        }
                        else {
                            // Fallback: If not exact, check if the AI value is a substring of *exactly one* available option
                            // Add check for opt being truthy (string) before calling .toLowerCase()
                            const potentialMatches = availableOptions.filter(opt => opt && opt.toLowerCase().includes(value.toLowerCase()));
                            if (potentialMatches.length === 1) {
                                matchFound = potentialMatches[0]; // Auto-select the unique partial match
                            }
                        }
                        // If a valid match (exact or unique partial) was found
                        if (matchFound) {
                            newSelections[attribute] = matchFound; // Apply the selection
                            delete tempFacetsCopy[attribute]; // Remove from temp storage
                            appliedSomethingInLoop = true; // Flag that we changed state
                            break; // Restart the loop with updated selections/products
                        }
                    }
                }
            } while (appliedSomethingInLoop); // Keep looping if we successfully applied a facet
        }
        // --- Main loop to find the next question or auto-select remaining options ---
        let finalProducts = applyFilters(newSelections); // Get the final product list after applying temp facets
        // Iterate through facets IN ORDER defined in productData
        for (const facet of productData.facets) {
            // If this facet is still unselected
            if (newSelections[facet.attribute] === null) {
                let availableOptions = [];
                // Special logic to calculate width ranges based on remaining products
                if (facet.attribute === 'largura') {
                    // Get all unique min/max widths from the filtered products and sort them
                    const breakpoints = [...new Set(finalProducts.flatMap(p => [p.minLargura, p.maxLargura]))].sort((a, b) => a - b);
                    // Create ranges between consecutive breakpoints (e.g., 0.7-1.0, 1.0-1.2, ...)
                    for (let i = 0; i < breakpoints.length - 1; i++) {
                        const min = breakpoints[i];
                        const max = breakpoints[i + 1];
                        if (min < max) { // Ensure valid range
                            // Check if any product actually fits within this specific range
                            const hasProductsInRange = finalProducts.some(p => p.minLargura < max && min < p.maxLargura);
                            if (hasProductsInRange) {
                                availableOptions.push(`${min}-${max}`); // Add valid range string
                            }
                        }
                    }
                }
                else {
                    // For other facets, get unique non-null values from the remaining products
                    availableOptions = [...new Set(finalProducts.map(p => p[facet.attribute]?.toString()).filter(v => v !== null && v !== undefined))];
                }
                // Auto-Selection Logic: If only one option remains for this facet, select it automatically
                if (availableOptions.length === 1) {
                    newSelections[facet.attribute] = availableOptions[0];
                    finalProducts = applyFilters(newSelections); // Re-filter products with the auto-selection
                }
                // If multiple options exist, this is the next question to ask the user
                else if (availableOptions.length > 1) {
                    return {
                        newSelections, // Current confirmed selections
                        newTempFacets: tempFacetsCopy, // Any remaining temp facets that couldn't be applied
                        filteredProducts: finalProducts, // Products matching current selections
                        nextQuestion: { facet, options: availableOptions }, // The question to ask
                        isFinished: false, // Not finished yet
                    };
                }
                // If zero options remain (should ideally not happen with good data), continue to the next facet
            }
        }
        // If the loop completes without finding a question, the process is finished
        return {
            newSelections, // Final selections
            newTempFacets: tempFacetsCopy, // Any leftover temp facets (should ideally be empty)
            filteredProducts: finalProducts, // Final product list
            nextQuestion: null, // No more questions
            isFinished: true, // Process complete
        };
        // --- FIX: Add empty dependency array for useCallback ---
    }, []); // End of calculateNextStep useCallback
    /*
    ======================================
    # STATE TRANSITION & EFFECTS
    ======================================
    */
    // Callback to handle updating state based on the output of calculateNextStep
    const processStateTransition = useCallback((currentSelections, currentTemp // Input temp facets are strings
    ) => {
        // Call the MEMOIZED calculateNextStep function
        const { newSelections, newTempFacets, // Output temp facets are also strings
        filteredProducts: nextFilteredProducts, nextQuestion, isFinished: nextIsFinished } = calculateNextStep(currentSelections, currentTemp);
        // Update React state variables
        setSelectedFacets(newSelections);
        setTempExtractedFacets(newTempFacets); // Store any remaining temp facets
        setFilteredProducts(nextFilteredProducts);
        setCurrentQuestion(nextQuestion);
        setIsFinished(nextIsFinished);
        return { nextQuestion }; // Return nextQuestion for potential immediate use
        // --- FIX: Add calculateNextStep to dependency array ---
    }, [calculateNextStep]); // Now depends on the memoized function
    // Initial Effect: Run once on mount to calculate the first question
    useEffect(() => {
        // Call state transition with initial empty selections and no temp facets
        const { nextQuestion } = processStateTransition(initialFacets, {});
        // If there's an initial question, post it to the chat
        if (nextQuestion) {
            const firstQuestionMessage = {
                sender: MessageSender.BOT,
                text: nextQuestion.facet.title // Use the title from the facet definition
            };
            setChatHistory(prev => [...prev, firstQuestionMessage]);
        }
        // Depend on processStateTransition (which now correctly depends on calculateNextStep)
        // initialFacets is constant (derived from productData) so it's safe to omit
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processStateTransition]);
    /*
      ======================================
      # EVENT HANDLERS
      ======================================
      */
    // Handles clicks on facet options in the FacetQuestion component
    const handleSelectOption = (attribute, value) => {
        console.group(`--- User Action: Deterministic Click ---`);
        console.log(`Attribute: '${attribute}', Value: '${value}'`);
        console.log("Current Selections (Before):", JSON.stringify(selectedFacets, null, 2));
        console.log("Current Temp Facets:", JSON.stringify(tempExtractedFacets, null, 2));
        const currentSelectionsWithNewOption = { ...selectedFacets, [attribute]: value };
        // Run the state machine with the new selection and any existing temp facets
        const { nextQuestion } = processStateTransition(currentSelectionsWithNewOption, tempExtractedFacets);
        // If the state machine determined a *new* question to ask, post it to chat
        if (nextQuestion) {
            let questionText = nextQuestion.facet.title;
            // Use friendlier text for the width question
            if (nextQuestion.facet.attribute === 'largura') {
                questionText = "Escolha uma largura nas opções em roxo.";
            }
            console.log(`Posting next question to chat: "${questionText}"`);
            const questionMessage = { sender: MessageSender.BOT, text: questionText };
            setChatHistory(prev => [...prev, questionMessage]);
        }
        else {
            console.log("No further question determined by state machine after click.");
        }
        console.groupEnd();
    };
    // Handles text submitted via the chat input
    const handleSendMessage = async (message) => {
        console.group(`--- User Action: Free Text ---`);
        console.log(`User Input: "${message}"`);
        console.log("Current Selections (Before):", JSON.stringify(selectedFacets, null, 2));
        // Add user's message to chat history immediately
        const userMessage = { sender: MessageSender.USER, text: message };
        setChatHistory(prev => [...prev, userMessage]);
        // --- Attempt deterministic match first ---
        if (currentQuestion) {
            const { facet, options } = currentQuestion;
            const normalizedMessage = message.trim().toLowerCase();
            const matchedOption = options.find(option => {
                const label = facet.options.labelMap?.[option];
                const optionLower = typeof option === 'string' ? option.toLowerCase() : '';
                return optionLower === normalizedMessage || (label && label.toLowerCase() === normalizedMessage);
            });
            // If an exact match is found, treat it as a click and skip AI
            if (matchedOption) {
                console.log(`Deterministic Match Found: option='${matchedOption}' for facet='${facet.attribute}'. Calling handleSelectOption.`);
                console.groupEnd(); // End group before calling another handler that starts its own group
                handleSelectOption(facet.attribute, matchedOption);
                return; // Don't proceed to AI
            }
            console.log(`No deterministic match found for "${message}". Proceeding to AI.`);
        }
        else {
            console.log("No current question, proceeding directly to AI.");
        }
        // --- If no deterministic match, proceed to AI ---
        setIsLoadingAI(true); // Show loading indicator
        const availableFacets = productData.facets.filter(f => selectedFacets[f.attribute] === null);
        console.log("Calling AI Service...");
        // Call the LIVE AI service
        const aiResponse = await getAIResponseAndFacets(message, availableFacets, filteredProducts);
        console.log("AI JSON Reply Received:", JSON.stringify(aiResponse, null, 2));
        const { knowledgeBaseAnswer, // Can be string OR NULL
        humanHandoffMessage, extractedFacets, // Record<string, string | null>
        talkToHuman } = aiResponse;
        // --- Filter out nulls before passing to state machine ---
        const combinedTempFacets = { ...tempExtractedFacets, ...extractedFacets };
        const validFutureTempFacets = {}; // State machine expects only strings
        for (const key in combinedTempFacets) {
            if (Object.prototype.hasOwnProperty.call(combinedTempFacets, key) && combinedTempFacets[key] !== null) {
                validFutureTempFacets[key] = combinedTempFacets[key];
            }
        }
        console.log("Filtered Temp Facets (to be passed to state machine):", JSON.stringify(validFutureTempFacets, null, 2));
        // Run the state machine AGAIN, passing current selections and the newly filtered temp facets from AI
        const { nextQuestion } = processStateTransition(selectedFacets, validFutureTempFacets);
        setIsLoadingAI(false); // Hide loading indicator
        // --- Post AI & State Machine Results Sequentially ---
        const messageQueue = [];
        // MODIFIED: Handle null knowledgeBaseAnswer
        if (knowledgeBaseAnswer) {
            messageQueue.push(knowledgeBaseAnswer);
        }
        else if (knowledgeBaseAnswer === null) {
            // If AI explicitly returns null, it means it couldn't answer from the context.
            messageQueue.push("Não encontrei uma resposta para sua pergunta em minha base de conhecimento. Você pode tentar reformular a pergunta ou selecionar uma das opções.");
        }
        if (nextQuestion) {
            let questionText = nextQuestion.facet.title;
            if (nextQuestion.facet.attribute === 'largura') {
                const larguraKeywords = ['largura', 'larg', 'medida', 'tamanho', ' cm', ' m', 'metro', 'centímetro'];
                const containsNumber = /\d/.test(message);
                const isLarguraQuery = larguraKeywords.some(keyword => message.toLowerCase().includes(keyword));
                if (containsNumber && isLarguraQuery)
                    questionText = "Escolha uma largura nas opções em roxo.";
            }
            if (messageQueue.length === 0 || messageQueue[messageQueue.length - 1] !== questionText) {
                messageQueue.push(questionText);
            }
        }
        if (talkToHuman && humanHandoffMessage) {
            if (messageQueue.length === 0 || messageQueue[messageQueue.length - 1] !== humanHandoffMessage) {
                messageQueue.push(humanHandoffMessage);
            }
        }
        if (messageQueue.length > 0) {
            console.log("Posting messages to chat:", messageQueue);
            const sendQueuedMessages = (index = 0) => {
                if (index >= messageQueue.length) {
                    console.groupEnd(); // End group after last message sent
                    return;
                }
                const messageText = messageQueue[index];
                if (talkToHuman && messageText === humanHandoffMessage)
                    setShowTalkToHuman(true);
                const botMessage = { sender: MessageSender.BOT, text: messageText };
                setChatHistory(prev => [...prev, botMessage]);
                setTimeout(() => sendQueuedMessages(index + 1), 750);
            };
            sendQueuedMessages();
        }
        else if (!nextQuestion && !isFinished) {
            console.log("AI returned no answer/facets and state machine didn't advance. Posting fallback.");
            const fallbackMessage = { sender: MessageSender.BOT, text: "Não entendi bem. Poderia tentar descrever de outra forma ou escolher uma das opções?" };
            setChatHistory(prev => [...prev, fallbackMessage]);
            console.groupEnd(); // End group after posting fallback
        }
        else {
            // Case where AI returned nothing, but state machine finished or found a question implicitly
            console.groupEnd(); // End group here too
        }
    };
    // Handles clicks on the breadcrumb navigation items
    const handleBreadcrumbClick = (facetIndex) => {
        console.group(`--- User Action: Breadcrumb Click ---`);
        console.log(`Index: ${facetIndex}`);
        console.log("Current Selections (Before):", JSON.stringify(selectedFacets, null, 2));
        if (facetIndex === -1) { // Resetting to beginning
            setShowTalkToHuman(false);
            setChatHistory([{ sender: MessageSender.BOT, text: "Busca reiniciada. Vamos começar de novo!" }]);
            const { nextQuestion } = processStateTransition(initialFacets, {});
            if (nextQuestion) {
                setChatHistory(prev => [...prev, { sender: MessageSender.BOT, text: nextQuestion.facet.title }]);
            }
            console.groupEnd();
            return;
        }
        // Resetting to a specific previous facet
        const newSelectedFacets = { ...selectedFacets };
        for (let i = facetIndex + 1; i < productData.facets.length; i++) {
            newSelectedFacets[productData.facets[i].attribute] = null; // Clear selections
        }
        console.log("Selections after rollback:", JSON.stringify(newSelectedFacets, null, 2));
        // Recalculate state from the clicked point, clearing temp AI facets
        processStateTransition(newSelectedFacets, {});
        // State machine determines the next question, which gets logged internally
        console.groupEnd();
    };
    /*
    ======================================
    # HELPER FUNCTIONS
    ======================================
    */
    // Generates the WhatsApp link with pre-filled message based on current selections
    const generateWhatsAppLink = useCallback(() => {
        // --- ADDED LOG ---
        console.log("DEBUG: generateWhatsAppLink called. Current selectedFacets:", JSON.stringify(selectedFacets));
        // ---------------
        let message = "Olá, gostaria de falar com um especialista sobre um produto com as seguintes características:";
        let hasFacets = false;
        // Map internal attribute names to user-friendly titles
        const friendlyFacetTitles = {
            'categoria': 'Tipo', 'sistema': 'Sistema', 'persiana': 'Persiana',
            'persianaMotorizada': 'Automação', 'material': 'Material', 'largura': 'Largura',
            'folhasNumber': 'Nº de Folhas', 'cor': 'Cor',
        };
        // Iterate through defined facets to build the message
        productData.facets.forEach(facet => {
            const value = selectedFacets[facet.attribute];
            if (value) { // Only include selected facets
                hasFacets = true;
                const labelMap = facet.options.labelMap || {};
                const breadcrumbMap = facet.options.breadcrumbLabelMap || {};
                // Get the display value (prefer breadcrumb label, then option label, then raw value)
                let displayValue = breadcrumbMap[value] || labelMap[value] || value;
                // Custom formatting for specific attributes
                if (facet.attribute === 'largura') {
                    displayValue = `${value.replace('-', ' a ')}m`;
                }
                else if (facet.attribute === 'folhasNumber') {
                    displayValue = `${value} Folha(s)`;
                }
                const title = friendlyFacetTitles[facet.attribute] || facet.title; // Get friendly title
                message += `\n- ${title}: ${displayValue}`; // Add line item to message
            }
        });
        // Use a generic message if no facets were selected
        if (!hasFacets) {
            message = "Olá, gostaria de falar com um especialista da Fábrica do Alumínio.";
        }
        const phone = "5511976810216"; // Company WhatsApp number
        const finalUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
        // --- ADDED LOG ---
        console.log("DEBUG: Generated WhatsApp URL:", finalUrl);
        // ---------------
        return finalUrl;
    }, [selectedFacets]); // Recalculate only when selections change
    // Opens the generated WhatsApp link in a new tab
    const handleTalkToHumanClick = () => {
        // --- ADDED LOG ---
        console.log("DEBUG: handleTalkToHumanClick called.");
        // ---------------
        const url = generateWhatsAppLink();
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    /*
    ======================================
    # RENDER LOGIC
    ======================================
    */
    // Determine if the product results should be shown in the right panel
    const showProductView = isFinished || (filteredProducts.length > 0 && currentQuestion === null);
    // --- ADDED LOG ---
    // Log the state *before* rendering the UI based on it
    console.log(`DEBUG: Rendering UI. isFinished=${isFinished}, currentQuestion=${currentQuestion?.facet.id ?? 'null'}, filteredProducts=${filteredProducts.length}, showProductView=${showProductView}`);
    // ---------------
    return (_jsxs("div", { className: "w-full h-full bg-gray-800 text-white shadow-2xl flex flex-col", children: [_jsxs("header", { className: "flex justify-between items-center p-4 bg-[#14293D] border-b border-gray-700 flex-shrink-0", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("img", { src: "https://fabricadoaluminio.com.br/layout/favicon.ico", alt: "Favicon da F\u00E1brica do Alum\u00EDnio", className: "w-6 h-6 mr-3" }), _jsx("h1", { className: "text-xl font-bold text-white", children: "Especialista da F\u00E1brica" })] }), _jsx("button", { onClick: onClose, className: "p-1 rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors", "aria-label": "Fechar assistente", children: _jsx(CloseIcon, {}) })] }), _jsxs("div", { className: "flex-grow flex flex-col md:flex-row min-h-0", children: [" ", _jsxs("div", { className: "md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-gray-700", children: [_jsx(Breadcrumbs, { facets: productData.facets, selectedFacets: selectedFacets, onBreadcrumbClick: handleBreadcrumbClick }), _jsxs("div", { className: "flex-grow min-h-0", children: [" ", _jsx(ChatInterface, { messages: chatHistory, onSendMessage: handleSendMessage, isLoading: isLoadingAI, showTalkToHumanButton: showTalkToHuman, onTalkToHumanClick: handleTalkToHumanClick })] })] }), _jsx("main", { className: "md:w-1/2 flex flex-col", children: showProductView ? (
                        // Show final product grid if finished or no more questions
                        _jsx(ProductResult, { products: filteredProducts })) : currentQuestion ? (
                        // Show the next question if available
                        _jsx(FacetQuestion, { question: currentQuestion, onSelectOption: handleSelectOption, products: filteredProducts })) : (
                        // Show loading state otherwise
                        _jsx("div", { className: "p-6 bg-gray-800 h-full flex items-center justify-center", children: _jsx("p", { className: "text-gray-400", children: "Carregando a pr\u00F3xima pergunta..." }) })) })] })] }));
}; // End of ProductAdvisor component
// Export the component
export default ProductAdvisor;
