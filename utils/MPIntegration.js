
export const handleIntegrationMP = async (preferencia) => {

    try {
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.EXPO_PUBLIC_API_MP}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferencia)
        })

        const data = await response.json()

        console.log(data)

        return data.init_point
        
    } catch (error) {
        console.log(error)
    }
}