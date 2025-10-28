import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const Breadcrumbs = ({ facets, selectedFacets, onBreadcrumbClick }) => {
    const getBreadcrumbLabel = (facet, value) => {
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
    return (_jsxs("nav", { className: "flex items-center text-sm font-medium text-white p-4 bg-gray-700", children: [_jsx("button", { onClick: () => onBreadcrumbClick(-1), className: "hover:text-white transition-colors", children: "In\u00EDcio" }), facets.map((facet, index) => {
                const value = selectedFacets[facet.attribute];
                if (value) {
                    const label = getBreadcrumbLabel(facet, value);
                    if (label === null)
                        return null;
                    return (_jsxs(React.Fragment, { children: [_jsx("span", { className: "mx-2", children: "/" }), _jsx("button", { onClick: () => onBreadcrumbClick(index), className: "hover:text-white transition-colors", children: label })] }, facet.id));
                }
                return null;
            })] }));
};
export default Breadcrumbs;
