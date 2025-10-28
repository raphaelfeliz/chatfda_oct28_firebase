import React from 'react';
import type { Facet } from '../types';

interface BreadcrumbsProps {
  facets: Facet[];
  selectedFacets: Record<string, string | null>;
  onBreadcrumbClick: (facetIndex: number) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ facets, selectedFacets, onBreadcrumbClick }) => {
  const getBreadcrumbLabel = (facet: Facet, value: string) => {
    if (facet.breadcrumb?.hideValues?.includes(value)) {
      return null;
    }
    const breadcrumbMap = facet.options.breadcrumbLabelMap;
    if (breadcrumbMap && breadcrumbMap[value]) {
      return breadcrumbMap[value];
    }
    const labelMap = facet.options.labelMap;
    if (labelMap && labelMap[value]) {
      return labelMap[value];
    }
     if (facet.options.labelFromValue) {
      return facet.options.labelFromValue.replace('{{$}}', value);
    }
    return value;
  };
  
  return (
    <nav className="flex items-center text-sm font-medium text-white p-4 bg-gray-700">
      <button onClick={() => onBreadcrumbClick(-1)} className="hover:text-white transition-colors">Início</button>
      {facets.map((facet, index) => {
        const value = selectedFacets[facet.attribute];
        if (value) {
          const label = getBreadcrumbLabel(facet, value);
          if(label === null) return null;
          return (
            <React.Fragment key={facet.id}>
              <span className="mx-2">/</span>
              <button onClick={() => onBreadcrumbClick(index)} className="hover:text-white transition-colors">
                {label}
              </button>
            </React.Fragment>
          );
        }
        return null;
      })}
    </nav>
  );
};

export default Breadcrumbs;