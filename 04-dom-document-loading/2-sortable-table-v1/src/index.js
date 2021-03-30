export default class SortableTable {

  section;
  sectionData = {};
  headerHtml;
  bodyHtml;
  subElements;
  element;

  constructor(header = [], { data } = []) {
    this.header = header;
    this.data = data;
    this.renderHeader();
    this.renderStringTable();
    this.mergeHtmlSection();
  }

  get templateHeaderArrow() {
    return `
    <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
    </span>`;
  }

  renderHeader() {
    let elementDiv = document.createElement('div');
    elementDiv.innerHTML = `<div data-element="header" class="sortable-table__header sortable-table__row">`;
    const mainElementHeader = elementDiv.firstElementChild;

    for(const dataCell of this.header) {
      elementDiv.innerHTML = `<div class="sortable-table__cell" data-id="${dataCell.id}" data-sortable="${dataCell.sortable}" data-order="">`;
      const cellTable = elementDiv.firstElementChild;
      elementDiv.innerHTML = `<span>${dataCell.title}</span>`;
      const cellTitleTable = elementDiv.firstElementChild;
      cellTable.append(cellTitleTable);
      mainElementHeader.append(cellTable)
    }
    this.headerHtml = mainElementHeader;
  }

  renderStringTable(data = this.data) {
    this.getSectionsTable();
    const elementDiv = document.createElement('div');
    elementDiv.innerHTML = `<div data-element="body" className="sortable-table__body">`;
    const elementBody = elementDiv.firstElementChild;



    for (const [key, value] of data.entries()) {

      elementDiv.innerHTML = `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">`;
      const rowTable = elementDiv.firstElementChild;

      for(const [num, cut] of Object.entries(this.section)) {

        if(!this.header[num].sortable && this.header[num].template) {

          const path = data[key][cut];
          elementDiv.innerHTML = this.header[num]?.template(path);
          const templateElement = elementDiv.firstElementChild;
          rowTable.append(templateElement);
        }
        else if (Object.keys(data[key]).find((elem) => elem === cut)) {

          elementDiv.innerHTML = `<div class="sortable-table__cell">${data[key][cut]}</div>`;

          console.log(this.sectionData[cut]);

          this.sectionData[cut].push(data[key][cut]);

          const paramItem = elementDiv.firstElementChild;
          rowTable.append(paramItem);
        }
      }
      elementBody.append(rowTable);
    }

    console.log(elementBody.firstElementChild);
    this.subElements = elementBody;
  }

  mergeHtmlSection() {
    const elementDiv = document.createElement('div');
    elementDiv.innerHTML = `<div data-element="productsContainer" className="products-list__container">`;
    const mainHtml = elementDiv.firstElementChild;
    elementDiv.innerHTML = `<div className="sortable-table" data-element="inner-table">`;
    const innerHtml = elementDiv.firstElementChild;
    this.bodyHtml = innerHtml;
    innerHtml.append(this.headerHtml);
    innerHtml.append(this.subElements);
    mainHtml.append(innerHtml);
    this.element = mainHtml;
  }

  // getSubElements(element) {
  //   const elements = element.querySelectorAll('[data-element]');
  //   return [...elements].reduce((accum, subElement) => {
  //     accum[subElement.dataset.element] = subElement;
  //     return accum;
  //   }, {});
  // }

  getSectionsTable() {
    this.section = this.header.reduce((accum, next) => {
      accum.push(next.id);
      if(next.sortable) {
        this.sectionData[next.id] = [];
      }
      return accum;
    }, []);
  }

  sortValueString(arrayForSort, orderValue) {
    let direction = 0;
    switch (orderValue) {
      case 'asc':
        direction = 1
        break;
      case 'desc':
        direction = -1
    }
    return  arrayForSort.sort((a, b) => {
      return a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper'}) * direction;
    });
  }

  sortValueNumber(arrayForSort, orderValue) {
    return  arrayForSort.sort((a, b) => {
      switch (orderValue) {
        case 'asc':
          return  a - b;
        case 'desc':
          return  b - a
      }
    });
  }

  destroy(){
    this.element = null;
  }
  remove() {
    this.subElements.remove();
  }

  showSort(){
    this.bodyHtml.append(this.subElements);
  }

  sort(fieldValue, orderValue) {

    let sortArray;

    if(typeof this.sectionData[fieldValue][0] === 'string') {

      sortArray = this.sortValueString(this.sectionData[fieldValue], orderValue);
    }
    else {
      sortArray = this.sortValueNumber(this.sectionData[fieldValue], orderValue);
    }
    const resultSort = [];

    for(const value of sortArray) {
      resultSort.push(this.data.find((item) => item[fieldValue] === value));
    }
    this.remove();
    this.renderStringTable(resultSort);
    this.showSort();
  }
}
