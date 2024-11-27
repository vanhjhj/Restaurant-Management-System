// src/components/Menu.js
import React, { useState,useEffect } from 'react';
import style from './Menu.module.css';
import { getFoodItems, getMenuTabs } from '../../../API/MenuAPI';

function Menu() {
  const [foodItems, setFoodItems] = useState([]);

  const [selectedType, setSelectedType] = useState(1);

  const [menuTabs, setMenuTabs] = useState([]);
  
  const [error, setError] = useState([]);

  const [searchItem, setSearchItem] = useState('');

  const [searchPriceMin, setSearchPriceMin] = useState('');

  const [searchPriceMax, setSearchPriceMax] = useState('');

  const handlePriceMin = (value) => {
    // Allow only positive numbers or empty string (to handle backspacing)
    if (value === '' || /^[+]?\d+(\.\d+)?$/.test(value)) {
      setSearchPriceMin(value);
    }
  } 

  const handlePriceMax = (value) => {
    // Allow only positive numbers or empty string (to handle backspacing)
    if (value === '' || /^[+]?\d+(\.\d+)?$/.test(value)) {
      setSearchPriceMax(value);
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMenuTabs();
        setMenuTabs(data);
      } 
      catch (error) {
        setError(error);
        console.log(error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getFoodItems();
        setFoodItems(data);
      } 
      catch (error) {
        setError(error);
        console.log(error);
      }
    };
    loadData();
  }, [])

  const filter = (item, name, category, priceMin, priceMax) => {
    let addCondition = item.name.toLowerCase().includes(name.toLowerCase())
      && item.price > priceMin;
    if (priceMax > 0) {
      addCondition = addCondition && item.price < priceMax;
    }
    if (category !== 1) {
      addCondition = addCondition && item.category === category;
    }
    return addCondition;
  }

  const filteredItems = foodItems.filter(item => filter(item, searchItem, selectedType, searchPriceMin, searchPriceMax));

  return (
    <div className={style["menu-container"]}>
      <div className={style["container"]}>
        <div className={style["title-row"]}>
          <div className={style['row']}>
            <div className={style['col-lg-12']}>
              <div className={style["section-title"]}>
                <p>OUR MENU</p>
                <h2>Check our YUMMY Menu</h2>
              </div>
            </div>
          </div>
        </div>
        <div className={style["search-row"]}>
          <div className={style['col-lg-9']}>
            <div className={style['search-menuitem']}>
              <input type='text'  
                placeholder="Search..."
                value={searchItem}
                onChange={e => setSearchItem(e.target.value) }
                className={style['input-search-menuitem']} />
              <button type="button" class={style["input-search-btn"]}>
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          {/* <div className={style['col-lg-3']}>
            <div className={style['search-catagory']}>
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(parseInt(e.target.value, 10));}}
                >
                  {menuTabs.map(tab => (
                    <option key={tab.id} value={tab.id}>
                      {tab.name}
                    </option>
                  ))}
              </select>
            </div>
          </div> */}
          <div className={style['col-lg-3']}>
            <div className={style['search-price']}>
              <div className={style["input-priceMin"]}>
                <input type="number" 
                  min = {0}
                  placeholder="Giá từ..."
                  value={searchPriceMin}
                  onChange={(e) => handlePriceMin(e.target.value) }
                >
                </input>
              </div> 
              <div>

              </div> 
              <div className={style["input-priceMin"]}>
                <input type="number" 
                  min = {0}
                  placeholder="Đến..."
                  value={searchPriceMax}
                  onChange={(e) => handlePriceMax(e.target.value) }
                >
                </input>
              </div>
            </div>
          </div>
        </div>
        <div className={style["menu-tab-row"]}>
          <div className={style["row"]}>
            <div className={style['col-lg-12']}>
              <div className={style["menu-tab"]}>
                <ul>
                  {menuTabs.map(tab => (
                    <li key={tab.id}>
                      <button
                        onClick={() => setSelectedType(tab.id)}
                        className={style['menu-tab-btn'] + ' ' + style[selectedType === tab.id ? 'active' : '']}
                      >
                        {tab.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className={style["menu-list-row"]}>
          <div className={style["row"]}>
            {filteredItems.map(item => (
              <div key={item.id} className={style["col-lg-3"]}>
                <div className={style["menu-item"]}>
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <h6>{item.description}</h6>
                  <p>Rs. {item.price}</p>
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
