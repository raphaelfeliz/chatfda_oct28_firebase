import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
const ProductResult = ({ products }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const PRODUCTS_PER_PAGE = 4;
    // Reset to the first page whenever the filter results change
    useEffect(() => {
        setCurrentPage(0);
    }, [products]);
    if (products.length === 0) {
        return (_jsx("div", { className: "p-6 bg-gray-800 flex items-center justify-center md:h-full", children: _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-xl font-semibold text-white mb-2", children: "Nenhum produto encontrado" }), _jsx("p", { className: "text-gray-400", children: "N\u00E3o encontramos produtos que correspondam a todos os crit\u00E9rios selecionados. Por favor, tente ajustar sua sele\u00E7\u00E3o." })] }) }));
    }
    const getProductName = (product) => {
        const parts = [];
        parts.push(product.categoria === 'janela' ? 'Janela' : 'Porta');
        if (product.sistema) {
            if (product.sistema.includes('correr'))
                parts.push('de Correr');
            else if (product.sistema.includes('giro'))
                parts.push('de Giro');
            else if (product.sistema.includes('maxim-ar'))
                parts.push('Maxim-Ar');
        }
        if (product.folhasNumber > 0) {
            parts.push(`${product.folhasNumber} Folha${product.folhasNumber > 1 ? 's' : ''}`);
        }
        if (product.material) {
            parts.push(`com ${product.material}`);
        }
        if (product.persiana === 'sim') {
            parts.push('com Persiana Integrada');
            if (product.persianaMotorizada === 'motorizada') {
                parts.push('Motorizada');
            }
            else if (product.persianaMotorizada === 'manual') {
                parts.push('Manual');
            }
        }
        return parts.join(' ');
    };
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const startIndex = currentPage * PRODUCTS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    const handleShowMore = () => {
        setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    };
    const renderContent = () => (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-2 gap-4 pb-4 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:gap-6", children: paginatedProducts.map((product) => {
                    const productName = getProductName(product);
                    const whatsappMessage = `gostaria de negociar o preço de ${productName}.`;
                    const whatsappUrl = `https://api.whatsapp.com/send?phone=5511976810216&text=${encodeURIComponent(whatsappMessage)}`;
                    return (_jsxs("div", { className: "group block rounded-lg overflow-hidden bg-gray-700 hover:ring-2 hover:ring-indigo-500 transition-all duration-200 text-left flex flex-col", children: [_jsx("a", { href: product.url, target: "_blank", rel: "noopener noreferrer", className: "block w-full aspect-square", children: _jsx("img", { src: product.image, alt: productName, className: "w-full h-full object-cover group-hover:opacity-90 transition-opacity" }) }), _jsxs("div", { className: "p-3 md:p-4 flex flex-col flex-grow min-w-0", children: [_jsx("p", { className: "text-sm md:text-base font-medium text-white flex-grow", children: productName }), _jsxs("div", { className: "mt-2 flex flex-col sm:flex-row gap-2", children: [_jsx("a", { href: product.url, target: "_blank", rel: "noopener noreferrer", className: "flex-1 text-center bg-indigo-600 text-white font-bold py-2 px-3 rounded-md hover:bg-indigo-500 transition-colors text-xs sm:text-sm", children: "Ver Pre\u00E7o" }), _jsx("a", { href: whatsappUrl, target: "_blank", rel: "noopener noreferrer", className: "flex-1 text-center bg-green-600 text-white font-bold py-2 px-3 rounded-md hover:bg-green-500 transition-colors text-xs sm:text-sm", children: "Negociar no WhatsApp" })] })] })] }, product.sku));
                }) }), products.length > PRODUCTS_PER_PAGE && (_jsx("div", { className: "flex-shrink-0 text-center pt-4", children: _jsx("button", { onClick: handleShowMore, className: "bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-500 transition-colors", children: "Veja mais op\u00E7\u00F5es" }) }))] }));
    return (_jsxs("div", { className: "p-4 md:p-6 bg-gray-800 flex flex-col md:h-full", children: [_jsx("h3", { className: "text-xl font-semibold text-white mb-4 flex-shrink-0", children: products.length === 1
                    ? 'Produto encontrado'
                    : `${products.length} produtos encontrados` }), _jsx("div", { className: "md:flex-grow md:overflow-y-auto custom-scrollbar", children: renderContent() })] }));
};
export default ProductResult;
