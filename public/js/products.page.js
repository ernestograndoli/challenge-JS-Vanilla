import ProductsService from "./products.service.js";
import { productUrlEncode, priceToString } from "./utils.js";

const INTERVAL_REFRESH_MS = 5000;

const getHtmlProduct = (product) => {
  const container = document.createElement("div");
  const divColumn = document.createElement("div");
  divColumn.classList.add("col-6", "col-md-3");

  const card = document.createElement("div");
  card.classList.add("card", "cardRadius", "mb-3", "bg-white", "border-0");

  const cardHeader = document.createElement("div");
  cardHeader.innerHTML = product.brand;
  cardHeader.classList.add(
    "card-header",
    "cardRadius",
    "fw-bold",
    "border-0",
    "bg-white",
    "fs-6",
    "pb-0"
  );

  const cardBody = document.createElement("div");
  cardBody.classList.add(
    "card-body",
    "text-primary",
    "bg-white",
    "pt-0",
    "pb-0"
  );

  const linkCard = document.createElement("a");
  linkCard.classList.add("links");
  linkCard.setAttribute("href", productUrlEncode(product.id, product.brand));

  const img = document.createElement("img");
  img.classList.add("w-100");
  img.setAttribute("src", `./img${product.image}`);
  img.setAttribute("alt", product.brand);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add(
    "card-footer",
    "cardFooterRadius",
    "bg-white",
    "border-0",
    "p-0"
  );

  const rowFlex = document.createElement("div");
  rowFlex.classList.add(
    "row",
    "d-flex",
    "flex-row",
    "align-items-center",
    "w-100",
    "m-0"
  );

  const rowFlexColumn9 = document.createElement("div");
  rowFlexColumn9.classList.add("col-9", "p-0");

  const span = document.createElement("span");
  span.classList.add("fw-bold", "ps-3");
  span.setAttribute("id", `price-${product.id}`);

  const rowFlexColumn3 = document.createElement("div");
  rowFlexColumn3.classList.add(
    "col-3",
    "p-0",
    "d-flex",
    "flex-row",
    "justify-content-end"
  );

  const plusButton = document.createElement("div");
  plusButton.classList.add(
    "plusButton",
    "d-flex",
    "flex-row",
    "justify-content-center",
    "align-items-center",
    "m-0"
  );

  const spanButton = document.createElement("span");
  spanButton.classList.add("fs-1", "text-white");
  spanButton.innerHTML = "+";

  linkCard.appendChild(img);
  cardBody.appendChild(linkCard);

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  rowFlexColumn9.appendChild(span);
  rowFlex.appendChild(rowFlexColumn9);

  plusButton.appendChild(spanButton);
  rowFlexColumn3.appendChild(plusButton);
  rowFlex.appendChild(rowFlexColumn3);
  cardFooter.appendChild(rowFlex);
  card.appendChild(cardFooter);
  divColumn.appendChild(card);
  container.appendChild(divColumn);

  return container.innerHTML;
};

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
