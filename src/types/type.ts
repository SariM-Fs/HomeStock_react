export const Category = ['מוצרי חלב', 'ירקות ופירות', 'מזון יבש', 'שתייה', 'ניקיון', 'אחר'] as const;
export const Unit = ['יחידות', 'ליטר', 'ק״ג', 'גרם', 'חבילות'] as const;

export type CategoryType = typeof Category[number];
export type UnitType = typeof Unit[number];

export type Product = {
    id: number,
    name: string,
    category: CategoryType,
    quantity: number,
    minimumQuantity: number,
    unit: UnitType,
    status: string
};

export type NewProduct = Omit<Product, "id" | "status">;
export type ItemFromList = {

    id: number;
    productId: number;
    quantity: number;
    purchased: boolean;
    addedAutomatically: boolean;
    product: {
        id: number;
        name: string;
        category: string;
        quantity: number;
        minimumQuantity: number;
        unit: string;

    };

}
