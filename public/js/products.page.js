import ProductsService from "./products.service.js";
import { productUrlEncode, priceToString } from "./utils.js";

const INTERVAL_REFRESH_MS = 5000;

const getHtmlProduct = (product) => `
<div class="col-6 col-md-3">
    
        <div
        class="card cardRadius mb-3 bg-white border-0"
        >
            <div class="card-header cardRadius fw-bold border-0 bg-white fs-6 pb-0"
            >${product.brand}
            </div>
            <div class="card-body text-primary bg-white pt-0 pb-0">
            <a href="${productUrlEncode(
              product.id,
              product.brand
            )}" class="links">
                <img src="./img${product.image}" alt="${
  product.brand
}" class="w-100" />
</a>
            </div>            
            <div
                class="card-footer cardFooterRadius bg-white border-0 p-0"
            >
                <div class="row d-flex flex-row align-items-center w-100 m-0">
                    <div class="col-9 p-0">
                    <span class="fw-bold ps-3" id="price-${product.id}"></span>
                    </div>
                    <div class="col-3 p-0 d-flex flex-row justify-content-end">
                        <div
                        class="plusButton d-flex flex-row justify-content-center align-items-center m-0">
                        <span class="fs-1 text-white">+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
</div>`;

const products = ProductsService.getAll();

const fetchPriceStock = async (product) => {
  const response = await ProductsService.getStockPrice(product.skus[0].code);
  const { price } = await response.json();

  document.getElementById(`price-${product.id}`).innerHTML =
    priceToString(price);

  setTimeout(async () => await fetchPriceStock(product), INTERVAL_REFRESH_MS);
};

products.forEach((i) => fetchPriceStock(i));

document.getElementById("products-container").innerHTML = products
  .map((i) => getHtmlProduct(i))
  .join("");
