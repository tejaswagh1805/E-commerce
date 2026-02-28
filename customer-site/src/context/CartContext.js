import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const getUserCartKey = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? `cart_${user._id}` : "cart_guest";
    };

    const [cart, setCart] = useState(() => {
        const key = getUserCartKey();
        const storedCart = localStorage.getItem(key);
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // 🔥 Load cart when user changes (login/logout)
    useEffect(() => {

        const loadCart = () => {
            const key = getUserCartKey();
            const storedCart = localStorage.getItem(key);
            setCart(storedCart ? JSON.parse(storedCart) : []);
        };

        loadCart();

        window.addEventListener("storage", loadCart);

        return () => {
            window.removeEventListener("storage", loadCart);
        };

    }, []);

    // 🔥 Sync cart per user
    useEffect(() => {
        const key = getUserCartKey();
        localStorage.setItem(key, JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, selectedSize = null, selectedColor = null) => {
        setCart(prevCart => {
            const exist = prevCart.find(item => 
                item._id === product._id && 
                item.selectedSize === selectedSize && 
                item.selectedColor === selectedColor
            );

            if (exist) {
                return prevCart.map(item =>
                    item._id === product._id && 
                    item.selectedSize === selectedSize && 
                    item.selectedColor === selectedColor
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevCart, { ...product, quantity: 1, selectedSize, selectedColor }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item._id !== id));
    };

    const updateQuantity = (id, type) => {
        setCart(prevCart =>
            prevCart.map(item => {
                if (item._id === id) {
                    if (type === "inc") {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    if (type === "dec" && item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        const key = getUserCartKey();
        localStorage.removeItem(key);
        setCart([]);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};