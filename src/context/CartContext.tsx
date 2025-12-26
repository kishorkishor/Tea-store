'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, ProductVariant, CartItem } from '@/types';

// Cart State
interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

// Cart Actions
type CartAction =
    | { type: 'ADD_ITEM'; payload: { product: Product; variant: ProductVariant; quantity: number } }
    | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: string; variantId: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'TOGGLE_CART' }
    | { type: 'SET_CART_OPEN'; payload: boolean }
    | { type: 'LOAD_CART'; payload: CartItem[] };

// Initial State
const initialState: CartState = {
    items: [],
    isOpen: false,
};

// Cart Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { product, variant, quantity } = action.payload;
            const existingItemIndex = state.items.findIndex(
                item => item.product.id === product.id && item.variant.id === variant.id
            );

            if (existingItemIndex > -1) {
                // Update quantity of existing item
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity,
                };
                return { ...state, items: updatedItems };
            }

            // Add new item
            return {
                ...state,
                items: [...state.items, { product, variant, quantity }],
            };
        }

        case 'REMOVE_ITEM': {
            const { productId, variantId } = action.payload;
            return {
                ...state,
                items: state.items.filter(
                    item => !(item.product.id === productId && item.variant.id === variantId)
                ),
            };
        }

        case 'UPDATE_QUANTITY': {
            const { productId, variantId, quantity } = action.payload;
            if (quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(
                        item => !(item.product.id === productId && item.variant.id === variantId)
                    ),
                };
            }

            return {
                ...state,
                items: state.items.map(item =>
                    item.product.id === productId && item.variant.id === variantId
                        ? { ...item, quantity }
                        : item
                ),
            };
        }

        case 'CLEAR_CART':
            return { ...state, items: [] };

        case 'TOGGLE_CART':
            return { ...state, isOpen: !state.isOpen };

        case 'SET_CART_OPEN':
            return { ...state, isOpen: action.payload };

        case 'LOAD_CART':
            return { ...state, items: action.payload };

        default:
            return state;
    }
}

// Cart Context Type
interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
    removeItem: (productId: string, variantId: string) => void;
    updateQuantity: (productId: string, variantId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    setCartOpen: (isOpen: boolean) => void;
    itemCount: number;
    subtotal: number;
    shipping: number;
    total: number;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Local Storage Key
const CART_STORAGE_KEY = 'tea-store-cart';

// Cart Provider
export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', payload: parsedCart });
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }, [state.items]);

    // Calculate totals
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.items.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0
    );
    // Free shipping over 1000 BDT
    const shipping = subtotal >= 1000 ? 0 : 60;
    const total = subtotal + shipping;

    // Actions
    const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
        dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    };

    const removeItem = (productId: string, variantId: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } });
    };

    const updateQuantity = (productId: string, variantId: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, variantId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const toggleCart = () => {
        dispatch({ type: 'TOGGLE_CART' });
    };

    const setCartOpen = (isOpen: boolean) => {
        dispatch({ type: 'SET_CART_OPEN', payload: isOpen });
    };

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                isOpen: state.isOpen,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                toggleCart,
                setCartOpen,
                itemCount,
                subtotal,
                shipping,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Custom hook to use cart
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
