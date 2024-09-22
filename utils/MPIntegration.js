
export const handleIntegrationMP = async () => {
    
    const preferencia = {
        "items": [
            {
              "id": "Sound system",
              "title": "Test",
              "description": "Dummy description",
              "picture_url": "http://www.myapp.com/myimage.jpg",
              "category_id": "car_electronics",
              "quantity": 1,
              "currency_id": "BRL",
              "unit_price": 100000
            }
          ]
    }
    console.log(preferencia)

    try {
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: "POST",
            headers: {
                'Authorization': `Bearer `,
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