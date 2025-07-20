import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useEcommerceStore = defineStore('ecommerce', () => {
    const customers = ref([
        { id: 1, name: "Ahmad", city: "Tehran" },
        { id: 2, name: "Mehran", city: "Shiraz" },
        { id: 3, name: "Ali", city: "Esfahan" },
    ])

    const products = ref([
        { id: 101, name: "Laptop", category: "Electronics" },
        { id: 102, name: "Mouse", category: "Electronics" },
        { id: 103, name: "Monitor", category: "Electronics" },
        { id: 104, name: "Coffee Maker", category: "Home Appliances" },
        { id: 105, name: "Blender", category: "Home Appliances" },
        { id: 106, name: "Headphones", category: "Electronics" },
    ])

    const purchases = ref([
        { customerId: 1, productId: 101, date: "2025-03-01" },
        { customerId: 1, productId: 102, date: "2025-02-02" },
        { customerId: 2, productId: 103, date: "2025-02-05" },
        { customerId: 2, productId: 104, date: "2025-02-06" },
        { customerId: 3, productId: 105, date: "2025-02-07" },
        { customerId: 3, productId: 106, date: "2025-02-08" },
        { customerId: 1, productId: 104, date: "2025-02-10" },
    ])

    const productsByCustomer = computed(() => {
        const map: Record<number, any[]> = {}
        customers.value.forEach(c => {
            const purchasedIds = purchases.value
                .filter(p => p.customerId === c.id)
                .map(p => p.productId)
            map[c.id] = products.value.filter(pr => purchasedIds.includes(pr.id))
        })
        return map
    })

    const mostPurchasedCategoryByCustomer = computed(() => {
        const map: Record<number, string> = {}
        customers.value.forEach(c => {
            const catCount: Record<string, number> = {}
            purchases.value
                .filter(p => p.customerId === c.id)
                .forEach(p => {
                    const product = products.value.find(pr => pr.id === p.productId)
                    if (product) {
                        catCount[product.category] = (catCount[product.category] || 0) + 1
                    }
                })
            const most = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]
            map[c.id] = most ? most[0] : ''
        })
        return map
    })

    function recommendProducts(customerId: number, filterByCity = false) {
        const customer = customers.value.find(c => c.id === customerId)
        if (!customer) return []

        const targetCategory = mostPurchasedCategoryByCustomer.value[customerId]
        const customerPurchases = purchases.value
            .filter(p => p.customerId === customerId)
            .map(p => p.productId)

        const similarCustomers = customers.value.filter(c =>
            c.id !== customerId &&
            mostPurchasedCategoryByCustomer.value[c.id] === targetCategory &&
            (!filterByCity || c.city === customer.city)
        )

        const similarPurchasedProductIds = new Set<number>()
        similarCustomers.forEach(c => {
            purchases.value
                .filter(p => p.customerId === c.id)
                .forEach(p => similarPurchasedProductIds.add(p.productId))
        })

        const recommendations = products.value.filter(p =>
            p.category === targetCategory &&
            similarPurchasedProductIds.has(p.id) &&
            !customerPurchases.includes(p.id)
        )

        return recommendations
    }

    return {
        customers,
        products,
        purchases,
        productsByCustomer,
        mostPurchasedCategoryByCustomer,
        recommendProducts
    }
})