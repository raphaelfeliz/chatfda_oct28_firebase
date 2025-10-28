import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
const FacetQuestion = ({ question, onSelectOption, products }) => {
    const { facet, options } = question;
    const getLabel = (optionValue) => {
        if (facet.options.labelMap && facet.options.labelMap[optionValue]) {
            return facet.options.labelMap[optionValue];
        }
        if (facet.options.labelFromValue) {
            return facet.options.labelFromValue.replace('{{$}}', optionValue);
        }
        return optionValue;
    };
    const getImage = (optionValue) => {
        // 1. Check the specific image map first.
        const mappedImage = facet.options.imageMap?.[optionValue];
        if (mappedImage) {
            return mappedImage;
        }
        // 2. Find the first product that would result from selecting this option.
        const matchingProduct = products.find(p => String(p[facet.attribute]) === optionValue);
        if (matchingProduct) {
            return matchingProduct.image;
        }
        // 3. Fallback if no image is found anywhere.
        return `https://picsum.photos/seed/${optionValue}/400/300`;
    };
    const sortedOptions = [...options];
    if (facet.options.sort) {
        const sortOrder = facet.options.sort;
        sortedOptions.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
    }
    else if (facet.options.sortNumeric) {
        sortedOptions.sort((a, b) => Number(a) - Number(b));
    }
    const renderContent = () => {
        if (facet.displayType === 'chip_text') {
            return (_jsxs(_Fragment, { children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-6 text-left flex-shrink-0", children: [_jsx("span", { className: "text-sky-400", children: "Filtro R\u00E1pido: " }), " ", facet.title] }), _jsx("div", { className: "flex flex-wrap justify-center gap-3 pb-3", children: sortedOptions.map((option) => (_jsxs("button", { onClick: () => onSelectOption(facet.attribute, option), className: "rounded-full bg-indigo-700 text-white px-5 py-2 hover:bg-indigo-600 transition-colors duration-200 text-base font-medium whitespace-nowrap", children: [option.replace('-', ' - '), "m"] }, option))) })] }));
        }
        return (_jsxs(_Fragment, { children: [_jsxs("h3", { className: "text-lg font-semibold text-white mb-4 flex-shrink-0 text-left", children: [_jsx("span", { className: "text-sky-400", children: "Encontre F\u00E1cil:" }), " ", facet.title] }), _jsx("div", { className: "grid grid-cols-2 gap-3 pb-3 md:grid-cols-[repeat(auto-fit,minmax(144px,1fr))] md:gap-4", children: sortedOptions.map((option) => (_jsxs("button", { onClick: () => onSelectOption(facet.attribute, option), className: "group block rounded-lg overflow-hidden bg-gray-700 hover:ring-2 hover:ring-indigo-500 transition-all duration-200 text-left", children: [_jsx("div", { className: "aspect-square w-full", children: _jsx("img", { src: getImage(option), alt: getLabel(option), className: "w-full h-full object-cover group-hover:opacity-90 transition-opacity" }) }), _jsx("div", { className: "p-3", children: _jsx("p", { className: "text-sm font-medium text-white", children: getLabel(option) }) })] }, option))) })] }));
    };
    return (_jsx("div", { className: "p-4 md:p-6 bg-gray-800 flex flex-col md:h-full", children: _jsx("div", { className: "md:flex-grow md:overflow-y-auto custom-scrollbar", children: renderContent() }) }));
};
export default FacetQuestion;
