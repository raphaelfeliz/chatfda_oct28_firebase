import React from 'react';
import type { CurrentQuestion, Product } from '../types';

interface FacetQuestionProps {
  question: CurrentQuestion;
  onSelectOption: (attribute: string, value: string) => void;
  products: Product[];
}

const FacetQuestion: React.FC<FacetQuestionProps> = ({ question, onSelectOption, products }) => {
  const { facet, options } = question;

  const getLabel = (optionValue: string) => {
    if (facet.options.labelMap && facet.options.labelMap[optionValue]) {
      return facet.options.labelMap[optionValue];
    }
    if (facet.options.labelFromValue) {
      return facet.options.labelFromValue.replace('{{$}}', optionValue);
    }
    return optionValue;
  };
  
  const getImage = (optionValue: string) => {
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
  } else if (facet.options.sortNumeric) {
      sortedOptions.sort((a,b) => Number(a) - Number(b));
  }

  const renderContent = () => {
    if (facet.displayType === 'chip_text') {
      return (
        <>
          <h3 className="text-lg font-semibold text-white mb-6 text-left flex-shrink-0">
            <span className="text-sky-400">Filtro Rápido: </span> {facet.title}
          </h3>
          <div className="flex flex-wrap justify-center gap-3 pb-3">
            {sortedOptions.map((option) => (
              <button
                key={option}
                onClick={() => onSelectOption(facet.attribute, option)}
                className="rounded-full bg-indigo-700 text-white px-5 py-2 hover:bg-indigo-600 transition-colors duration-200 text-base font-medium whitespace-nowrap"
              >
                {option.replace('-', ' - ')}m
              </button>
            ))}
          </div>
        </>
      );
    }

    return (
      <>
        <h3 className="text-lg font-semibold text-white mb-4 flex-shrink-0 text-left">
          <span className="text-sky-400">Encontre Fácil:</span> {facet.title}
        </h3>
        <div className="grid grid-cols-2 gap-3 pb-3 md:grid-cols-[repeat(auto-fit,minmax(144px,1fr))] md:gap-4">
          {sortedOptions.map((option) => (
            <button
              key={option}
              onClick={() => onSelectOption(facet.attribute, option)}
              className="group block rounded-lg overflow-hidden bg-gray-700 hover:ring-2 hover:ring-indigo-500 transition-all duration-200 text-left"
            >
              <div className="aspect-square w-full">
                <img 
                  src={getImage(option)} 
                  alt={getLabel(option)} 
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-white">{getLabel(option)}</p>
              </div>
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gray-800 flex flex-col md:h-full">
      <div className="md:flex-grow md:overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

export default FacetQuestion;