const apiUrl = "https://hexschool.github.io/js-filter-data/data.json";
const showList = document.querySelector(".showList");
const btnGroup = document.querySelector(".button-group");
const btnTypeList = document.querySelectorAll(".btn-type");
const search = document.querySelector(".seach-group");
const inputCrop = document.querySelector("#crop");
const showResult = document.querySelector(".show-result");
const select = document.querySelector("#js-select");
const selectMoblie = document.querySelector("#js-moblie-select");
const selectAdvanced = document.querySelector(".js-sort-advanced");


let productsData = [];
let filteredData = [];


function getOriginData() {
    axios.get(apiUrl)
    .then(function (response) {
        // 去掉 種類代碼 or 作物名稱 是 null 的資料
        productsData = response.data.filter((item) => ((item["種類代碼"] !== null) || (item["作物名稱"] !== null)));
        // renderData(productsData);
    })
    .catch(function (error) {
        console.log(error);
    });
}

function renderData(dataArray) {
    let allDataStr = "";
    dataArray.forEach(function(item)  {
        let oneDataStr = `
            <tr>
                <td>${item["作物名稱"]}</td>
                <td>${item["市場名稱"]}</td>
                <td>${item["上價"]}</td>
                <td>${item["中價"]}</td>
                <td>${item["下價"]}</td>
                <td>${item["平均價"]}</td>
                <td>${item["交易量"]}</td>
            </tr>
        `;
        allDataStr += oneDataStr;
    });
    showList.innerHTML = allDataStr;
}

// 篩選『蔬菜』、『水果』、『花卉』三個類別
btnGroup.addEventListener("click", function(e) {
    if (e.target.nodeName !== "BUTTON") return;
    console.log(e.target.getAttribute("data-type"));

    // 切換顏色
    btnTypeList.forEach(function(item) {
        item.classList.remove("active");
    });
    e.target.classList.add("active");

    const typeCode = e.target.getAttribute("data-type");

    filteredData = productsData.filter(function(item) {
         return item["種類代碼"] === typeCode;
    });

    renderData(filteredData);
});

// 搜尋作物名稱，並顯示當前搜尋的字詞和結果
search.addEventListener("click", function(e) {

    // 取消類別按鈕的顏色
    btnTypeList.forEach(function(item) {
        item.classList.remove("active");
    });

    if (e.target.nodeName === "BUTTON") {
        if (inputCrop.value.trim() === "") return alert("記得輸入作物名稱喔！");
        const inputCropText = inputCrop.value.trim();
        filteredData = productsData.filter(function(item) {
            return item["作物名稱"].match(inputCropText);
        });
        if (filteredData.length === 0) {
            showList.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center p-3">查詢不到交易資訊QQ</td>
                </tr>
            `;
            showResult.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>沒有「${inputCropText}」的搜尋結果......`;
        } else {
            renderData(filteredData);
            showResult.innerHTML = `<i class="fas fa-search"></i>「${inputCropText}」的搜尋結果：`;
        }
        inputCrop.value = "";
    }
});

// 排序篩選資料
select.addEventListener("change", function (e) {
    if (filteredData.length === 0) return alert("請先搜尋作物名稱或點擊分類再進行篩選喔！");
    switch (e.target.value) {
        case "依上價排序":
            selectChange("上價");
            break;
        case "依中價排序":
            selectChange("中價");
            break;
        case "依下價排序":
            selectChange("下價");
            break;
        case "依平均價排序":
            selectChange("平均價");
            break;
        case "依交易量排序":
            selectChange("交易量");
            break;
        // default:
    }
});

selectMoblie.addEventListener("change", function (e) {
    console.log(e.target.value);
    if (filteredData.length === 0) return alert("請先搜尋作物名稱或點擊分類再進行篩選喔！");
    switch (e.target.value) {
        case "上價":
            selectChange("上價");
            break;
        case "中價":
            selectChange("中價");
            break;
        case "下價":
            selectChange("下價");
            break;
        case "平均價":
            selectChange("平均價");
            break;
        case "交易量":
            selectChange("交易量");
            break;
        // default:
    }
});

function selectChange(value) {
    filteredData.sort(function(a, b) {
        return b[value] -  a[value];
    });
    renderData(filteredData);
}

// 進階排序資料(小箭頭)
selectAdvanced.addEventListener("click", function(e) {
    if (filteredData.length === 0) return alert("請先搜尋作物名稱或點擊分類再進行篩選喔！");
    if (e.target.nodeName === "I") {
        let sortPrice = e.target.getAttribute("data-price");
        let sortCaret = e.target.getAttribute("data-sort");
        filteredData.sort((a, b) => (sortCaret === "up") ? b[sortPrice] - a[sortPrice] : a[sortPrice] - b[sortPrice]);
        renderData(filteredData);
    }
});


showList.innerHTML = `
    <tr>
        <td colspan="7" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td>
    </tr>
`;
getOriginData();