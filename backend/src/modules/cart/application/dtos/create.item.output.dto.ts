interface CreateItemOutputDTO {
    cart_total: number,
    items_count: number,
    items: {
        product_id: string,
        price: number,
        quantity: number,
        subtotal: number
    }[]
}

export default CreateItemOutputDTO;