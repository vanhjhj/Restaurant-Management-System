// src/components/Menu.js
import React, { useState } from 'react';
import './Menu.css';


const foodItems = [
  { id: 1, name: 'Fresh Chicken Veggies', type: 'Breakfast', calories: 120, price: 499, image: '/assets/images/dish/1.png' },
  { id: 2, name: 'Grilled Chicken', type: 'Breakfast', calories: 80, price: 359, image: '/assets/images/dish/2.png' },
  { id: 3, name: 'Paneer Noodles', type: 'Lunch', calories: 100, price: 149, image: '/assets/images/dish/3.png' },
  { id: 4, name: 'Chicken Noodles', type: 'Lunch', calories: 120, price: 379, image: '/assets/images/dish/4.png' },
  { id: 5, name: 'Bread Boiled Egg', type: 'Dinner', calories: 120, price: 99, image: '/assets/images/dish/5.png' },
  { id: 6, name: 'Immunity Dish', type: 'Dinner', calories: 120, price: 159, image: '/assets/images/dish/6.png' },
];

function Menu() {
  const [selectedType, setSelectedType] = useState('All');

  const filteredItems = selectedType === 'All' ? foodItems : foodItems.filter(item => item.type === selectedType);

  const menuTabs = [
    { type: 'All', icon: 'fas fa-utensils' },
    { type: 'Breakfast', icon: 'fas fa-coffee' },
    { type: 'Lunch', icon: 'fas fa-hamburger' },
    { type: 'Dinner', icon: 'fas fa-pizza-slice' },
  ];

  return (
    <div className="menu-section">
      <div className="section-title">
        <p>OUR MENU</p>
        <h2>Check our YUMMY Menu</h2>
      </div>

      <div className="menu-tabs">
        {menuTabs.map(tab => (
          <button
            key={tab.type}
            onClick={() => setSelectedType(tab.type)}
            className={selectedType === tab.type ? 'active' : ''}
          >
            <i className={tab.icon} style={{ marginRight: '8px' }}></i>
            {tab.type}
          </button>
        ))}
      </div>

      <div className="menu-items">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item">
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>{item.calories} calories</p>
            <p>Rs. {item.price}</p>
            <button className="add-btn">Add</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
