// src/components/Menu.js
import React, { useState,useEffect } from 'react';
import style from './Menu.module.css';
import axios from 'axios';
import { API_BASE_URL } from '../../../Config/apiConfig';

function Menu() {
  const [foodItems, setFoodItems] = useState([]);

  const [selectedType, setSelectedType] = useState('All');

  const filteredItems = selectedType === 'All' ? foodItems : foodItems.filter(item => item.type === selectedType);

  const [menuTabs, setMenuTabs] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/menu/categories/`)
      .then((response) => {
        setMenuTabs(response.data.results);
       })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/menu/menuitems/`)
      .then((response) => {
        console.log(response.data)
        setFoodItems(response.data.results);
       })
      .catch(error => console.error('Error:', error));
  },[])

  return (
    <div className={style["menu-container"]}>
      <div className={style["container"]}>
        <div className={style["title-row"]}>
          <div className={style['row']}>
            <div className={style['col-12-lg']}>
              <div className={style["section-title"]}>
                <p>OUR MENU</p>
                <h2>Check our YUMMY Menu</h2>
              </div>
            </div>
          </div>
        </div>
        <div className={style["menu-tab-row"]}>
          <div className={style["row"]}>
            <div className={style['col-lg-12']}>
              <div className={style["menu-tab"]}>
                {menuTabs.map(tab => (
                  <button
                    key={tab.name}
                    onClick={() => setSelectedType(tab.name)}
                    className={style['menu-tab-btn'] + ' ' + style[selectedType === tab.name ? 'active' : '']}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={style["menu-list-row"]}>
          <div className={style["row"]}>
            {filteredItems.map(item => (
              <div className={style["col-lg-3"]}>
                <div key={item.id} className={style["menu-item"]}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Rs. {item.price}</p>
                  <button className="add-btn">Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
