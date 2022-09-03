const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
    .then(res => res.json())
    .then(data => displayCateories(data.data.news_category))
    .catch(error => errorHandling(error));
}

const displayCateories = (categories) =>{
    const categoryContainer = document.getElementById('category-container');

    // const lastCategory = categories.length-1;
    // const categoryId   = categories[lastCategory].category_id;
    // const categoryName = categories[lastCategory].category_name;
    // console.log(categoryId+' '+ categoryName);

    categories.reverse().forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('col');
        const categoryId   = category.category_id;
        const categoryName = category.category_name;
        categoryDiv.innerHTML = `<button id="navButton-${categoryId}" onclick="loadCategoryByIdAndName(${categoryId},'${categoryName}')" style="border: none; background:rgb(246,246,246)">
                                    <b>${categoryName}</b>
                                </button>`;
        categoryContainer.appendChild(categoryDiv);
    });
}

const errorHandling = error => {
    console.log(error);
    const errorHandling = document.getElementById('error-handling');
    errorHandling.classList.remove('d-none');

    const errorText = document.getElementById('error-text');
    errorText.innerText = '404 Not Found';
}


const loadCategoryByIdAndName = (categoryId, categoryName) => {
    toggleSpinner(true);

    navbarColorChange(categoryId);
    const url = 'https://openapi.programming-hero.com/api/news/category/0'+categoryId;
    fetch(url)
    .then(res => res.json())
    .then(data => displayCategoryWiseNews(data.data, categoryName))
    .catch(error => errorHandling(error));
}


const displayCategoryWiseNews = (categoryWiseNews, categoryName) =>{
    
    const foundCard = document.getElementById('found-card');
    foundCard.classList.remove('d-none');

    const foundText = document.getElementById('found-text');
    if (categoryWiseNews.length==0) {
        foundText.innerText = `No data found `;
        return;
    }
    foundText.innerHTML = `${categoryWiseNews.length} items found for the category of <i><b>${categoryName}</b></i>`;

    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML='';

    // Sort By total View
    categoryWiseNews.sort((a, b) =>  b.total_view - a.total_view);
    
    categoryWiseNews.forEach( item => {
        let cardNews = document.createElement('div');
        cardNews.innerHTML = `
            <div class="card mb-3 mt-3" >
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${item.image_url}" class="img-fluid rounded-start" style="height:260px">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${item.details.slice(0, 300)+'...'}</p>
                            <div class="d-flex flex-row">
                                <div>
                                    <img src="${item.author.img}" class=" mt-4 rounded float-start" style="width:50px;border-radius: 50%;">
                                </div>
                                <div class="mt-3 ms-2">
                                    <small>${item.author.name}</small> <br>
                                    <small class="text-muted">${item.author.published_date}</small>
                                </div>
                                <div class="mt-3 ms-5" >
                                    <b style="margin-left:70px" class="mt-5">
                                        <i class="fa fa-eye" aria-hidden="true"></i>
                                        <small class="text-muted">${item.total_view}</small>
                                    </b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `; 
        newsContainer.appendChild(cardNews);
    });
    toggleSpinner(false);

}


let ids_arr = [];
const navbarColorChange = categoryId => {
    ids_arr.push(categoryId); 
    if (ids_arr.length > 1) {
        const navbar = document.getElementById('navButton-0'+ids_arr[0]);
        navbar.style.color = "";
    }
    const navbar = document.getElementById('navButton-0'+categoryId);
    navbar.style.color = "blue";
    if (ids_arr.length == 2) {
        ids_arr.shift();
    }
}

const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if(isLoading){
        loaderSection.classList.remove('d-none');
    }else{
        loaderSection.classList.add('d-none');
    }
}


loadCategories();