//! Buraya kendi api anahtarınızı giriniz.
let apiKey = "";
//! DOM ACCESS
const newsContainer = document.getElementById("news-container");
const carouselContainer = document.getElementById("carousel-container");
const carouselİndicators = document.getElementById("indicators");
const loading = document.getElementById("loading-screen");
//! DOM ACCESS
let topNews = []; //? Öne çıkan haberler burada tutulur.
let categoryNews = []; //? Seçilen kategorideki haberler burada tutulur.
//! Apiden çektiği haberler ile ilgili verileri tutacak nesne.
class NewsData {
  constructor(author, desc, time, title, content, url, imageUrl, source) {
    this.author = author;
    this.desc = desc;
    this.time = time;
    this.title = title;
    this.content = content;
    this.url = url;
    this.imageUrl = imageUrl;
    this.source = source;
  }
  //! Datadaki zaman bilgisini okunaklı formata cevirir.
  getTime() {
    let datetime = new Date(this.time);
    let datePart = datetime.toLocaleDateString();
    let timePart = datetime.toLocaleTimeString();
    return `${datePart}  ${timePart}`;
  }
}

class UI {
  //! Aldığı parametreye göre haberler sekmesindeki haberleri günceller
  static display(newsArray, header) {
    let result = "";
    result += `<h2 id="news-header" class="container py-3 border border-2  fw-bold text-capitalize   border-secondary-subtle border-end-0 border-start-0 " >${header} News</h2>`;
    newsArray.forEach((item) => {
      let currentNews = [];
      currentNews.push(item);
      result += `
        <div class="card mb-3 rounded-0 shadow ">
        <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
        <div class="card-body">
            <h5 class="card-title fw-bold fs-4">${item.title}</h5>
            <p class="card-text">${item.desc}</p>
            <a class="${header} d-block text-center text-secondary" data-id="${newsArray.indexOf(
        item
      )}" onclick="shownews(event)" href="#">Read More...</a>
        </div>
    </div>
        `;
    });
    newsContainer.innerHTML = result;
  }
  //! Carousel sliderdaki haberleri günceller.
  static sliderDisplay(sliderArray) {
    let result = "";
    let result2 = "";
    for (let i = 1; i <= sliderArray.length; i++) {
      result2 += `
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${
          i - 1
        }" aria-label="Slide ${i}"></button>
        `;
    }
    carouselİndicators.innerHTML = result2;
    try {
      carouselİndicators.childNodes[1].classList.add("active");
    } catch {}

    sliderArray.forEach((item) => {
      result += `
        <div class="carousel-item" data-bs-interval="6000">
        <img src="${item.imageUrl}" class="d-block w-100 " alt="...">
        <div class="carousel-caption d-none d-md-block">
          <h5 class="fw-bold text-light text-left h1">${item.title}</h5>
          <p class=" text-light h3">${item.desc}</p>
        </div>
      </div>
        `;
    });
    carouselContainer.innerHTML = result;
    try {
      document
        .getElementsByClassName("carousel-item")[0]
        .classList.add("active");
    } catch {}
  }
  //! Read more butonuna basıldığında o haberin detaylarının ekranda gözükmesini sağlar.
  static showNews(newsObject) {
    newsContainer.innerHTML = `
    <div class="card mb-3 rounded-0 border-0  ">
            <img style="height: 500px;" src="${
              newsObject.imageUrl
            }" class="card-img-top" alt="fsdfdsfsd">
            <div class="card-body">
                <h5 class="card-title fw-bold fs-1 ms-4 my-3">${
                  newsObject.title
                }</h5>
                <p class="card-text fw-bolder">${newsObject.desc}</p>
                <p class="card-text">${newsObject.content}</p>
                <p class="text-success">Author:${newsObject.author}   </p>
                <p class="text-secondary">${newsObject.getTime()} </p>
                <p class="text-secondary">Source:${newsObject.source}</p>
                <p class="text-secondary">Source Url: <a href="${
                  newsObject.url
                }" class="text-primary ">${newsObject.url}</a></p>
               
            </div> 
      </div>
    
    `;
  }
}
//! Return top butonun belirli bir aşağı kaydırmadan sonra gözükmesini sağlar.
window.addEventListener("scroll", () => {
  if (scrollY > 600) {
    document.getElementById("return-top").style.display = "flex";
  } else {
    document.getElementById("return-top").style.display = "none";
  }
});
//! Fetch Api ile News Api ye http isteği yollarız ve haberleri ordan çekeriz
//? Kullanılan Api: News API
const news = async (category) => {
  loading.classList.add("d-flex");
  loading.classList.remove("d-none");
  let apiUrl;
  if (category == "") {
    apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
  } else {
    apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
  }
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    topNews = [];
    categoryNews = [];
    data.articles.forEach((item) => {
      if (item.urlToImage == null) return;
      const {
        author,
        content,
        description,
        publishedAt,
        source,
        title,
        url,
        urlToImage,
      } = item;
      let NewsObject = new NewsData(
        author,
        description,
        publishedAt,
        title,
        content,
        url,
        urlToImage,
        source.name
      );
      if (category == "") {
        topNews.push(NewsObject);
        UI.display(topNews, "Featured");
        UI.sliderDisplay(topNews);
      } else {
        categoryNews.push(NewsObject);
        UI.display(categoryNews, category);
        UI.sliderDisplay(categoryNews);
      }
    });
  } 
  catch (error) {
    console.error("Haber getirme hatası:", error);
  }
  //? Hata versede vermesede try catch blogunun sonunda calısır.
  finally{
    loading.classList.remove("d-flex");
    loading.classList.add("d-none");
  }
};
//! Ekran ilk açıldığında apiye öne çıkan haberler için istek yollar ve arayüzü ona göre günceller.
window.addEventListener("DOMContentLoaded", () => {
  news("");
  UI.display(topNews, "Featured");
  UI.sliderDisplay(topNews);
});
//! Read more basıldığında eğer öne çıkan haberse ilgili haberin detaylarını topNews dizisinden alır.
//! Ve ilgili UI static metodu ile arayüzü günceller.
//! Eğer kategori haberi ise categoryNews dizisinden aynı işlemleri yapar
const shownews = (e) => {
  if (e.target.classList.contains("Featured"))
    UI.showNews(topNews[Number(e.target.dataset.id)]);
  else 
    UI.showNews(categoryNews[Number(e.target.dataset.id)]);
};
//! Kategori butonlarından birine basıldığında ilgili kategoride haberlerin ekrana gelmesini sağlar.
const showCategories = (category, e) => {
  news(category);
  const listİtems = document.querySelectorAll(".list-group-item");
  const navİtems = document.querySelectorAll(".nav-link");
  for (let i = 0; i < navİtems.length; i++) 
    navİtems[i].classList.remove("active");
  
  for (let i = 0; i < listİtems.length; i++) 
    listİtems[i].classList.remove("bg-secondary", "text-light");
  
  if (e.target.classList.contains("nav-link")) {
    e.target.classList.add("active");
    listİtems.forEach((item) => {
      if (item.textContent.toLowerCase() === category) {
        item.classList.add("bg-secondary", "text-light");
      }
    });
  } else {
    e.target.classList.add("bg-secondary", "text-light");
    navİtems.forEach((item) => {
      if (item.textContent.toLowerCase() === category) {
        item.classList.add("active");
      }
    });
  }
};
