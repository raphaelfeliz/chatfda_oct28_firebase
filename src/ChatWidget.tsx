import React, { useState, useEffect } from 'react';
import ProductAdvisor from './ProductAdvisor';
import { ChatIcon } from './components/Icons';
import { productData } from './product_data';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Preload images for a smoother experience
  useEffect(() => {
    const preloadImage = (url: string) => {
      const img = new Image();
      img.src = url;
    };

    // Prioritize the first two choices (janela and porta)
    const initialImages = [
      productData.facets[0].options.imageMap?.['janela'],
      productData.facets[0].options.imageMap?.['porta']
    ].filter(Boolean) as string[];

    initialImages.forEach(preloadImage);

    // Use a Set to collect all other unique image URLs
    const allOtherImageUrls = new Set<string>();

    productData.facets.forEach(facet => {
      if (facet.options.imageMap) {
        Object.values(facet.options.imageMap).forEach(url => {
          // Add to set only if not in the initial prioritized list
          if (!initialImages.includes(url)) {
            allOtherImageUrls.add(url);
          }
        });
      }
    });

    productData.productCatalog.forEach(product => {
       if (!initialImages.includes(product.image)) {
         allOtherImageUrls.add(product.image);
       }
    });

    // Preload the rest of the images with a small delay to not block the main thread
    const timer = setTimeout(() => {
      allOtherImageUrls.forEach(preloadImage);
    }, 500); // A small delay to ensure the UI is responsive first

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []); // Empty dependency array ensures this runs only once on mount


  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {isOpen ? (
        <div className="chat-window">
          <ProductAdvisor onClose={handleClose} />
        </div>
      ) : (
        <button 
          onClick={handleOpen} 
          className="chat-launcher-button"
          aria-label="Abrir assistente de produtos"
        >
          <ChatIcon />
        </button>
      )}
    </>
  );
};

export default ChatWidget;
