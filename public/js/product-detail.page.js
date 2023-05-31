import ProductsService from "./products.service.js";

import { productUrlEncode, priceToString } from "./utils.js";

const INTERVAL_REFRESH_MS = 5000;

const getSkuView = ({ name }) => {
  const container = document.createElement("div");
  const divColumn = document.createElement("div");
  divColumn.classList.add("col-4");

  const pill = document.createElement("div");
  pill.classList.add("border", "rounded-pill", "text-center");

  const nameSku = document.createElement("span");
  nameSku.innerHTML = name;
  nameSku.classList.add("skuPill");

  pill.appendChild(nameSku);
  divColumn.appendChild(pill);
  container.appendChild(divColumn);

  return container.innerHTML;
};

const updateView = (product, priceStock) => {
  console.log(document.getElementById("price"));
  document.getElementById("brand").innerHTML = product.brand;
  document.getElementById("origin").innerHTML = product.origin;
  document.getElementById("description").innerHTML = product.information;
  document.getElementById("price").innerHTML = priceToString(priceStock.price);
  document.getElementById("stock").innerHTML = priceStock.stock;
  document.getElementById("img").src = `./img${product.image}`;
  document.getElementById("img").alt = product.brand;
  document.getElementById("skusContainer").innerHTML = product.skus
    .map(getSkuView)
    .join("");
};

const fetchPriceStock = async (product) => {
  const response = await ProductsService.getStockPrice(product.skus[0].code);
  const stockPrice = await response.json();

  updateView(product, stockPrice);

  setTimeout(async () => await fetchPriceStock(product), INTERVAL_REFRESH_MS);
};

const currentProductIdBrand = window.location.pathname.substring(1);

const product = ProductsService.getAll().find(
  (i) => productUrlEncode(i.id, i.brand) == currentProductIdBrand
);

if (!product) window.location.replace("/");

fetchPriceStock(product);
