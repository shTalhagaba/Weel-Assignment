import { Colors } from "../utils/Colors";

 export const deliveryOptions = [
    {
      id: 'DELIVERY',
      title: 'Home Delivery',
      description: 'Get it delivered to your doorstep',
      icon: 'home',
      color: Colors.BLUE,
      lightColor: '#EFF6FF',
    },
    {
      id: 'IN_STORE',
      title: 'In-Store Pickup',
      description: 'Pick up from your nearest store',
      icon: 'location',
      color: Colors.PARIT,
      lightColor: '#F0FDF4',
    },
    {
      id: 'CURBSIDE',
      title: 'Curbside Pickup',
      description: "We'll bring it to your car",
      icon: 'car',
      color: '#8B5CF6',
      lightColor: '#FAF5FF',
    },
  ];


   export const deliveryConfig = {
      DELIVERY: {
        title: 'Home Delivery',
        icon: 'home',
        color: Colors.BLUE,
        lightColor: '#EFF6FF',
      },
      IN_STORE: {
        title: 'In-Store Pickup',
        icon: 'location',
        color: Colors.BLUE,
        lightColor: '#F0FDF4',
      },
      CURBSIDE: {
        title: 'Curbside Pickup',
        icon: 'car',
        color: '#8B5CF6',
        lightColor: '#FAF5FF',
      },
    };