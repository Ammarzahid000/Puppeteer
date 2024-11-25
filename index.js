const puppeteer = require('puppeteer');
const xlsx = require('xlsx');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://books.toscrape.com/');

    const bookDetails = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.product_pod');
        const books = [];

        for (const product of productElements) {
            const title = product.querySelector('h3 > a')?.getAttribute('title') || 'No title';
            const price = product.querySelector('.price_color')?.innerText || 'No price';

            books.push({ title, price });
        }

        return books;
    });

    // Create a new workbook and add a worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(bookDetails);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Books');

    // Save the workbook to a file
    xlsx.writeFile(workbook, 'books.xlsx');

    console.log('Data saved as Excel: books.xlsx');
    await browser.close();
})();
