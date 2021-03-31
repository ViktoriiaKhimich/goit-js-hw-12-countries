import './styles.css';
import cardTemplate from './templates/card.hbs'
import countriesListTemplate from './templates/countries-list.hbs'
const { alert, notice, info, success, error } = require('@pnotify/core');
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');

const countriesList = document.querySelector('.countries-list');
const countryCardContainer = document.querySelector('.country-container');
const searchField = document.querySelector('.form-control');
searchField.addEventListener('input', debounce(searchCountry, 500))

async function searchCountry (e) {
    const searchFieldValue = e.target.value;
    console.log(searchFieldValue);

    clearContainer();

    const basicUrl = 'https://restcountries.eu/rest/v2/name';
    try {
        const response = await fetch(`${basicUrl}/${searchFieldValue}`);
        console.log(response);
        if(!response.ok){
            throw new Error("Bad request")
        }
        const countryList = await response.json();
        console.log(countryList);
        if (countryList.length >= 10) {
            
            error(
                {
                    text: 'Too many matches found. Please enter a more specific query',
                    delay: 1000,
                });
            return;
        } 
        if (countryList.length > 1 && countryList.length < 10) {
            const countriesListMarkup = countriesListTemplate(countryList);
            countriesList.insertAdjacentHTML('beforeend', countriesListMarkup);
        }
        if (countryList.length === 1) {
            console.log(countryList)
            const countryCardMarkup = cardTemplate(...countryList);
            countryCardContainer.insertAdjacentHTML('beforeend', countryCardMarkup);
        }
    }
    catch(error){
        console.log(error)
    }
}

function clearContainer () {
    countriesList.innerHTML = '';
    countryCardContainer.innerHTML = '';
}