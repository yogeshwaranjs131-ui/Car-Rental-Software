import React, { createContext, useState, useContext } from 'react';

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Add item to cart
    const addToCart = (car) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === car._id);
            if (existingItem) {
                // If item already exists, you can increase quantity or keep it as is
                return prevItems.map((item) =>
                    item._id === car._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
                );
            }
            return [...prevItems, { ...car, quantity: 1 }];
        });
    };

    // Remove item from cart
    const removeFromCart = (carId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== carId));
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Calculate total price
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                getCartTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom Hook to use Cart Context
export const useCart = () => {
    return useContext(CartContext);
};