import { productData } from '../product_data';
// 1. 'Facet' has been removed from this import
import type { Product, CurrentQuestion } from '../types';

/**
 * A pure function that calculates the next state of the product filtering journey.
 * ...
 */
export const calculateNextStep = (
  currentSelectedFacets: Record<string, string | null>,
  currentTempFacets: Record<string, string>,
) => {
  // 2. Changed to 'const'
  const newSelections = { ...currentSelectedFacets };
  // 3. Changed to 'const'
  const tempFacetsCopy = { ...currentTempFacets };

  const applyFilters = (selections: Record<string, string | null>): Product[] => {
    return productData.productCatalog.filter((product: Product) => {
      return Object.entries(selections).every(([key, value]) => {
        if (value === null) return true;
        if (key === 'largura') {
          const [min, max] = value.split('-').map(Number);
          if (isNaN(min) || isNaN(max)) return true;
          return product.minLargura < max && min < product.maxLargura;
        }
        return String(product[key as keyof Product]) === value;
      });
    });
  };

  // --- Try to apply any temporarily stored facets ---
  if (Object.keys(tempFacetsCopy).length > 0) {
    let appliedSomethingInLoop;
    do {
      appliedSomethingInLoop = false;
      // 4. Changed to 'const'
      const currentProducts = applyFilters(newSelections);

      for (const facet of productData.facets) {
        const attribute = facet.attribute;
        const value = tempFacetsCopy[attribute];

        if (newSelections[attribute] === null && value) {
          // 5. Fixed 'opt' is possibly 'undefined' with a type guard
          const availableOptions = [...new Set(currentProducts.map((p: Product) => p[attribute as keyof Product]?.toString()).filter((v): v is string => v !== null && v !== undefined))];

          let matchFound = null;
          if (availableOptions.includes(value)) {
            matchFound = value;
          } else {
            // 'opt' is now correctly inferred as 'string'
            const potentialMatches = availableOptions.filter(opt => opt.toLowerCase().includes(value.toLowerCase()));
            if (potentialMatches.length === 1) {
              matchFound = potentialMatches[0];
            }
          }

          if (matchFound) {
            newSelections[attribute] = matchFound;
            delete tempFacetsCopy[attribute];
            appliedSomethingInLoop = true;
            break;
          }
        }
      }
    } while (appliedSomethingInLoop);
  }

  // --- Main loop to find the next question or auto-select ---
  let finalProducts = applyFilters(newSelections);
  for (const facet of productData.facets) {
    if (newSelections[facet.attribute] === null) {
      let availableOptions: string[] = [];
      if (facet.attribute === 'largura') {
        const breakpoints = [...new Set(finalProducts.flatMap((p: Product) => [p.minLargura, p.maxLargura]))].sort((a: number, b: number) => a - b);
        for (let i = 0; i < breakpoints.length - 1; i++) {
          const min = breakpoints[i];
          const max = breakpoints[i + 1];
          if (min < max) {
            const hasProductsInRange = finalProducts.some((p: Product) => p.minLargura < max && min < p.maxLargura);
            if (hasProductsInRange) {
              availableOptions.push(`${min}-${max}`);
            }
          }
        }
      } else {
        availableOptions = [...new Set(finalProducts.map((p: Product) => p[facet.attribute as keyof Product]?.toString()).filter((v): v is string => v !== null && v !== undefined))];
      }

      if (availableOptions.length === 1) {
        newSelections[facet.attribute] = availableOptions[0];
        finalProducts = applyFilters(newSelections);
      } else if (availableOptions.length > 1) {
        return {
          newSelections,
          newTempFacets: tempFacetsCopy,
          filteredProducts: finalProducts,
          nextQuestion: { facet, options: availableOptions } as CurrentQuestion,
          isFinished: false,
        };
      }
    }
  }

  return {
    newSelections,
    newTempFacets: tempFacetsCopy,
    filteredProducts: finalProducts,
    nextQuestion: null,
    isFinished: true,
  };
};