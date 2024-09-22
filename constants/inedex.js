export const categories = [
  {
    id: 1,
    name: "Pizza",
    image: require("../assets/images/pizzaIcon.png"),
  },
  {
    id: 2,
    name: "Carnes",
    image: require("../assets/images/meetIcon.png"),
  },
  {
    id: 3,
    name: "Panaderia",
    image: require("../assets/images/breadIcon.png"),
  },
  {
    id: 4,
    name: "Sopas",
    image: require("../assets/images/sopaIcon.png"),
  },
  {
    id: 5,
    name: "Verduras",
    image: require("../assets/images/fruitIcon.png"),
  },
];

export const featured = {
    id: 1,
    title: 'Lo más vendido',
    description: 'Los locales  más populares de la semana',
    restaurants: [
        {
            id: 1,
            name: 'La celeste',
            image: require('../assets/images/laceleste.jpg'),
            description: 'Hot and spicy pizzas',
            lng: 38.2145602,
            lat: -85.5324269,
            address: '434 second street',
            stars: 4,
            reviews: '4.4k',
            category: 'Panaderia',
            dishes: [
                {
                    id: 1,
                    name: 'Medialunas',
                    description: 'Exisitas medialunas de manteca',
                    price: 1200,
                    image: require('../assets/images/medialunas.jpg')
                },
                {
                  id: 2,
                  name: 'Combo panaderia',
                  description: 'Nuestra selección especial del día',
                  price: 3200,
                  image: require('../assets/images/comboPanaderia.jpg')
              }
            ]
        },
        {
          id: 2,
          name: 'Super Mami',
          image: require('../assets/images/superMami.jpg'),
          description: 'Hot and spicy pizzas',
          lng: 38.2145602,
          lat: -85.5324269,
          address: '434 second street',
          stars: 4,
          reviews: '4.4k',
          category: 'Supermercado',
          dishes: [
              {
                  id: 1,
                  name: 'pizza',
                  description: 'cheezy garlic pizza',
                  price: 10,
                  image: require('../assets/images/pizzaDish.png')
              },
              {
                id: 2,
                name: 'pizza',
                description: 'cheezy garlic pizza',
                price: 10,
                image: require('../assets/images/pizzaDish.png')
            }
          ]
        },
        {
          id: 3,
          name: 'Carrefour',
          image: require('../assets/images/carrefourIcon.png'),
          description: 'Hot and spicy pizzas',
          lng: 38.2145602,
          lat: -85.5324269,
          address: '434 second street',
          stars: 4,
          reviews: '4.4k',
          category: 'Supermecado',
          dishes: [
              {
                  id: 1,
                  name: 'pizza',
                  description: 'cheezy garlic pizza',
                  price: 10,
                  image: require('../assets/images/pizzaDish.png')
              }
          ]
        }
      ]
    }